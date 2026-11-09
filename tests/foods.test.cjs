const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const root = path.resolve(__dirname, "..");

function load(relative, mocks = {}) {
  const cache = new Map();
  function moduleAt(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    if (filename.endsWith(".json")) return JSON.parse(fs.readFileSync(filename, "utf8"));
    const module = { exports: {} };
    cache.set(filename, module);
    const source = fs.readFileSync(filename, "utf8");
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    function localRequire(name) {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (!name.startsWith(".")) return require(name);
      const base = path.resolve(path.dirname(filename), name);
      const file = [base, base + ".ts", base + ".tsx", base + ".json"].find((value) => fs.existsSync(value) && fs.statSync(value).isFile());
      if (!file) throw new Error("Unresolved test module: " + name);
      return moduleAt(file);
    }
    new Function("require", "module", "exports", code)(localRequire, module, module.exports);
    return module.exports;
  }
  return moduleAt(path.join(root, relative));
}
const nutrition = load("app/lib/foodNutrition.ts");
const { TACO_FOODS, getTacoFood } = load("app/lib/foodCatalog.ts");
const ownId = "11111111-1111-4111-8111-111111111111";
const own = { id: ownId, name: "Receita própria", category: "Receitas", serving: "50 g", calories: 100, protein: 10, carbs: 5, fat: 2, source: "personal" };

test("official catalog retains 597 unique TACO codes and 15 categories", () => {
  assert.equal(TACO_FOODS.length, 597);
  assert.equal(new Set(TACO_FOODS.map((food) => food.id)).size, 597);
  assert.equal(new Set(TACO_FOODS.map((food) => food.category)).size, 15);
  for (let code = 1; code <= 597; code++) {
    const food = getTacoFood("taco-" + code);
    assert.equal(food.sourceCode, code);
    assert.equal(food.referenceGrams, 100);
  }
});
test("150 g rice uses the unrounded 100 g reference, then rounds the portion", () => {
  assert.deepEqual(nutrition.foodPortion(getTacoFood("taco-3"), { grams: "150" }), { amount: "150 g", calories: 192.4, protein: 3.78, carbs: 42.09, fat: 0.34 });
  assert.equal(nutrition.foodPortion(getTacoFood("taco-3"), { grams: "300" }).calories, 384.8);
});
test("search ignores accents, case, and word order but preserves preparation terms", () => {
  assert(nutrition.matchesFoodSearch(getTacoFood("taco-3"), "COZIDO arroz"));
  assert(nutrition.matchesFoodSearch(getTacoFood("taco-66"), "abobora"));
  assert(!nutrition.matchesFoodSearch(getTacoFood("taco-3"), "arroz cru"));
});
test("trace and missing data are distinct; missing nutrients cannot become zero", () => {
  assert.equal(nutrition.nutrientLabel(getTacoFood("taco-91"), "fat"), "Tr");
  assert.equal(nutrition.nutrientLabel(getTacoFood("taco-458"), "calories"), "ND");
  assert.equal(nutrition.hasCompleteNutrition(getTacoFood("taco-458")), false);
  assert.throws(() => nutrition.foodPortion(getTacoFood("taco-458"), { grams: 100 }), /não disponíveis/);
  assert.equal(nutrition.foodPortion(getTacoFood("taco-91"), { grams: 100 }).fat, 0);
});
test("personal food uses its declared gram reference, including decimal comma", () => {
  assert.equal(nutrition.referenceGrams({ ...own, serving: "50,5 g" }), 50.5);
  assert.deepEqual(nutrition.foodPortion(own, { grams: 150 }), { amount: "150 g", calories: 300, protein: 30, carbs: 15, fat: 6 });
});
test("units and milliliters use counted portions without inventing density or gram weights", () => {
  const unit = { ...own, serving: "1 unidade" };
  assert.equal(nutrition.referenceGrams(unit), null);
  assert.equal(nutrition.foodPortion(unit, { servings: "2" }).calories, 200);
  assert.equal(nutrition.foodPortion({ ...own, serving: "100 ml" }, { servings: 2 }).amount, "2 porções (100 ml)");
  assert.throws(() => nutrition.foodPortion(unit, { grams: 100 }), /porções/);
});
test("empty, negative, infinite, nonnumeric, boolean and oversized portions are rejected", () => {
  for (const grams of [undefined, null, "", " ", 0, -1, Infinity, "Infinity", true, "1e3", "abc", 5001]) {
    assert.throws(() => nutrition.foodPortion(getTacoFood("taco-3"), { grams }), RangeError);
  }
  assert.throws(() => nutrition.foodPortion({ ...own, serving: "1 unidade" }, { servings: 101 }), RangeError);
  assert.equal(nutrition.foodPortion(getTacoFood("taco-3"), { grams: "150,5" }).amount, "150,5 g");
});
test("numeric overflow is rejected instead of saving null nutrients", () => {
  assert.throws(() => nutrition.foodPortion({ ...own, calories: 1e308 }, { grams: 5000 }), RangeError);
});
test("private foods are combined with the shared reference without modifying either", async () => {
  const lib = load("app/lib/foodLibraryServer.ts", { "./supabaseServer": { listRows: async () => ({ ok: true, data: [own] }) } });
  const result = await lib.getFoodLibrary();
  assert.equal(result.length, 598);
  assert.equal(result[0].id, ownId);
  assert.equal(result[0].source, "personal");
  assert.equal(result[0].referenceGrams, 50);
  assert.equal(own.referenceGrams, undefined);
  assert.equal(result.filter((food) => food.source === "TACO").length, 597);
});
test("a failed private-food query is surfaced, not silently converted to an empty account", async () => {
  const lib = load("app/lib/foodLibraryServer.ts", { "./supabaseServer": { listRows: async () => ({ ok: false, data: [] }) } });
  await assert.rejects(lib.getFoodLibrary(), /carregar os alimentos/);
});
test("personal selection uses an exact authenticated lookup and rejects inaccessible IDs", async () => {
  let lookup = "";
  const lib = load("app/lib/foodLibraryServer.ts", { "./supabaseServer": { queryRows: async (query) => { lookup = query; return { ok: true, data: [] }; } } });
  await assert.rejects(lib.getFoodForPlan(ownId), /não encontrado na sua conta/);
  assert(lookup.includes("id=eq." + ownId + "&limit=1"));
  await assert.rejects(lib.getFoodForPlan("taco-9999"), /alimento válido/);
  assert.equal((await lib.getFoodForPlan("taco-3")).source, "TACO");
});
function route(food = getTacoFood("taco-3")) {
  const writes = [];
  const module = load("app/api/meal-plan-items/route.ts", {
    "../../lib/foodLibraryServer": { getFoodForPlan: async () => food },
    "../../lib/supabaseServer": {
      insertRow: async (table, payload) => { writes.push({ table, payload }); return { ok: true, simulated: false, data: [{ id: "saved-item", ...payload }] }; },
      jsonError: (error, status = 500) => Response.json({ ok: false, error: error.message }, { status }),
    },
  });
  return { ...module, writes };
}
const request = (body) => new Request("https://nutridex.example/api/meal-plan-items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
test("meal API recalculates from its server reference and ignores forged preview and owner fields", async () => {
  const api = route();
  const response = await api.POST(request({ meal_plan_id: "own-plan", meal_name: "Almoço", food_id: "taco-3", grams: 150, calories: 999999, food_name: "alterado", owner_id: "another-user" }));
  assert.equal(response.status, 200);
  const saved = api.writes[0].payload;
  assert.equal(saved.food_name, "Arroz, tipo 1, cozido (TACO)");
  assert.equal(saved.calories, 192.4);
  assert.equal(saved.amount, "150 g");
  assert.equal(saved.owner_id, undefined);
  assert.equal(saved.food_id, undefined);
});
test("incomplete reference and invalid portions return 400 without inserting anything", async () => {
  const unavailable = route(getTacoFood("taco-458"));
  assert.equal((await unavailable.POST(request({ food_id: "taco-458", grams: 100 }))).status, 400);
  assert.equal(unavailable.writes.length, 0);
  const bad = route();
  assert.equal((await bad.POST(request({ food_id: "taco-3", grams: -100 }))).status, 400);
  assert.equal(bad.writes.length, 0);
});
test("existing manual and copied plan items preserve their saved snapshot", async () => {
  const api = route();
  const response = await api.POST(request({ meal_plan_id: "own-plan", meal_name: "Jantar", food_name: "Item anterior", amount: "1 porção", calories: "123,4", protein: 4.5, carbs: 6.7, fat: 8.9 }));
  assert.equal(response.status, 200);
  assert.deepEqual(api.writes[0].payload, { meal_plan_id: "own-plan", meal_name: "Jantar", food_name: "Item anterior", amount: "1 porção", calories: 123.4, protein: 4.5, carbs: 6.7, fat: 8.9 });
});
test("food-library rows compare nutrition and expose editing only for private foods", () => {
  const { FoodsBrowser } = load("app/components/FoodsBrowser.tsx", {
    "./AppShell": { Card: ({ children }) => React.createElement("section", null, children), CardTitle: () => null },
    "./RecordActions": { RecordActions: ({ endpoint }) => React.createElement("button", { "data-edit-endpoint": endpoint }, "Editar") },
  });
  const html = renderToStaticMarkup(React.createElement(FoodsBrowser, { foods: [{ ...own, name: "Abacate próprio" }, ...TACO_FOODS] }));
  assert(html.includes("Tabela TACO"));
  assert(html.includes("Buscar alimentos"));
  assert(!html.includes("NEPA/UNICAMP"), "the citation belongs in the page footer, not in the results");
  assert(html.includes("Última página"));
  assert(html.includes("Usar no plano"));
  assert.equal((html.match(/<tr/g) || []).length, 16);
  assert(html.includes('data-edit-endpoint="/api/foods/' + ownId + '"'));
  assert(!html.includes('data-edit-endpoint="/api/foods/taco-'));
});

test("inconsistent negative source values remain traceable and unavailable for calculation", () => {
  for (const id of ["taco-288", "taco-322", "taco-337", "taco-400"]) {
    const food = getTacoFood(id);
    assert.equal(food.carbs, null);
    assert(food.sourceIssues.carbs < 0);
    assert.equal(nutrition.nutrientLabel(food, "carbs"), "ND");
    assert.throws(() => nutrition.foodPortion(food, { grams: 100 }), /não disponíveis/);
  }
  for (const food of TACO_FOODS) for (const key of nutrition.NUTRIENTS) {
    assert(food[key] === null || Number.isFinite(food[key]) && food[key] >= 0, food.id + ":" + key);
  }
});

test("pagination reaches every catalog food without the former 80-option cutoff", () => {
  const search = load("app/lib/foodSearch.ts");
  const sorted = search.findFoods(TACO_FOODS, "");
  const reached = [];
  for (let page = 1; page <= Math.ceil(sorted.length / 8); page++) reached.push(...search.foodPage(sorted, page, 8).items.map(food => food.id));
  assert.equal(reached.length, 597);
  assert.equal(new Set(reached).size, 597);
  const late = sorted[sorted.length - 1];
  assert(search.findFoods(TACO_FOODS, late.name).some(food => food.id === late.id));
  assert(search.foodPage(sorted, 9999, 8).items.length > 0);
  assert.equal(search.findFoods([own, ...TACO_FOODS], "", "", "personal").length, 1);
});
test("picker renders searchable result buttons and pages rather than a truncated select", () => {
  const { FoodPicker } = load("app/components/FoodPicker.tsx");
  const html = renderToStaticMarkup(React.createElement(FoodPicker, { foods: TACO_FOODS, value: "", onChange() {} }));
  assert(html.includes("Resultados de alimentos"));
  assert.equal((html.match(/class="food-result"/g) || []).length, 8);
  assert(html.includes("Última página"));
  assert(!html.includes('name="foodId"'));
});
test("a food opened from the library is preselected with a valid calculated portion", () => {
  const { MealFoodForm } = load("app/components/MealFoodForm.tsx");
  const html = renderToStaticMarkup(React.createElement(MealFoodForm, { foods: TACO_FOODS, planId: "test-plan", mealName: "Almoço", initialFoodId: "taco-3", onAdded() {} }));
  assert(html.includes("Arroz, tipo 1, cozido"));
  assert(html.includes('value="100"'));
  assert(html.includes("Nutrientes da porção"));
  assert(!html.includes("NEPA/UNICAMP"));
});
