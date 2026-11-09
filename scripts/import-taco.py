"""Rebuild the bundled TACO data from the NEPA/UNICAMP XLSX (Python standard library only)."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
from urllib.request import urlopen
from xml.etree import ElementTree as ET
from zipfile import ZipFile

SOURCE_URL = "https://nepa.unicamp.br/wp-content/uploads/sites/27/2023/10/Taco-4a-Edicao.xlsx"
SOURCE_SHA256 = "a66b8ec528daeabc63bc2b015fc9bd8c6d76b941c2fc0ed93a4311d449302d14"
NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
FIELDS = {"calories": 3, "protein": 5, "fat": 6, "carbs": 8}

def column_index(address):
    number = 0
    for letter in re.match(r"[A-Z]+", address).group():
        number = number * 26 + ord(letter) - ord("A") + 1
    return number - 1

def read_rows(raw):
    with ZipFile(io.BytesIO(raw)) as book:
        strings = ["".join(si.itertext()) for si in ET.fromstring(book.read("xl/sharedStrings.xml")).findall("s:si", NS)]
        sheet = ET.fromstring(book.read("xl/worksheets/sheet1.xml"))
        for row in sheet.findall(".//s:sheetData/s:row", NS):
            values = {}
            for cell in row.findall("s:c", NS):
                index = column_index(cell.attrib["r"])
                value = cell.findtext("s:v", default="", namespaces=NS)
                kind = cell.attrib.get("t")
                if kind == "s":
                    values[index] = strings[int(value)] if value else None
                elif kind == "inlineStr":
                    values[index] = "".join(cell.find("s:is", NS).itertext())
                elif kind == "str":
                    values[index] = value or None
                elif kind == "e":
                    values[index] = None
                else:
                    values[index] = float(value) if value else None
            yield values

def normalize(raw):
    category = None
    foods = []
    for row in read_rows(raw):
        code = row.get(0)
        if isinstance(code, (int, float)) and code.is_integer() and 1 <= code <= 597:
            nutrition, traces, source_issues = {}, [], {}
            for name, column in FIELDS.items():
                value = row.get(column)
                if isinstance(value, str) and value.strip().lower() == "tr":
                    nutrition[name] = 0
                    traces.append(name)
                elif value is None or isinstance(value, str) and value.strip().upper() in ("", "NA", "*"):
                    nutrition[name] = None
                else:
                    number = float(value)
                    if number < 0:
                        nutrition[name] = None
                        source_issues[name] = round(number, 6)
                    else:
                        nutrition[name] = round(number, 6)
            food = {
                "id": "taco-" + str(int(code)), "sourceCode": int(code),
                "name": str(row[1]).strip(), "category": category, "serving": "100 g",
                "source": "TACO", "referenceGrams": 100, "traces": traces, **nutrition,
            }
            if source_issues:
                food["sourceIssues"] = source_issues
            foods.append(food)
        elif isinstance(code, str) and not row.get(1) and code.strip() and code.strip() not in ("Alimento", "Número do"):
            category = code.strip()
    assert len(foods) == 597 and {f["sourceCode"] for f in foods} == set(range(1, 598))
    assert len({f["category"] for f in foods}) == 15
    return foods

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, help="Already downloaded official XLSX")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "data/taco-4a-edicao.json")
    args = parser.parse_args()
    raw = args.input.read_bytes() if args.input else urlopen(SOURCE_URL, timeout=60).read()
    if hashlib.sha256(raw).hexdigest() != SOURCE_SHA256:
        raise ValueError("Official source changed. Review the workbook before updating the recorded checksum.")
    foods = normalize(raw)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(foods, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"foods": len(foods), "source_sha256": SOURCE_SHA256, "output": str(args.output)}))
