'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Erro de renderização do NutriDex', error); }, [error]);
  return <main className='grid min-h-screen place-items-center bg-[var(--app-bg)] px-5 text-[var(--text)]'><section className='w-full max-w-xl rounded-md border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm'><p className='text-sm font-bold uppercase text-[var(--gold-strong)]'>Serviço temporariamente indisponível</p><h1 className='mt-2 text-2xl font-bold text-[var(--heading)]'>Não foi possível carregar esta tela</h1><p className='mt-3 text-sm leading-6 text-[var(--muted)]'>Verifique a conexão com o Supabase e tente novamente. Nenhum dado foi alterado.</p><button type='button' onClick={reset} className='mt-5 rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white'>Tentar novamente</button></section></main>;
}
