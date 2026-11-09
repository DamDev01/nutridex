"use client";
export function FoodPager({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages < 2) return null;
  return <nav className="food-pagination" aria-label="Páginas de alimentos">
    <span>Página <strong>{page}</strong> de {pages}</span>
    <div>
      <button type="button" onClick={() => onChange(1)} disabled={page === 1} aria-label="Primeira página">«</button>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Página anterior">‹</button>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pages} aria-label="Próxima página">›</button>
      <button type="button" onClick={() => onChange(pages)} disabled={page === pages} aria-label="Última página">»</button>
    </div>
  </nav>;
}
