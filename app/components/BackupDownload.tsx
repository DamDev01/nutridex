"use client";

import { useState } from 'react';
import { strToU8, zip, type Zippable } from 'fflate';

export function BackupDownload() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function download() {
    setBusy(true);
    setMessage('Reunindo os dados do consultório…');
    try {
      const response = await fetch('/api/backup', { cache: 'no-store', signal: AbortSignal.timeout(180_000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível gerar o backup.');
      const { files, ...manifest } = result as { files: { path: string; url: string }[]; [key: string]: unknown };
      const contents: Zippable = {};
      const maxBytes = 256 * 1024 * 1024;
      let bytes = 0;
      for (const [index, file] of files.entries()) {
        setMessage(`Reunindo fotografias (${index + 1}/${files.length})…`);
        const photo = await fetch(file.url, { signal: AbortSignal.timeout(60_000) });
        if (!photo.ok) throw new Error('Uma fotografia falhou no download. Gere o backup novamente.');
        const body = new Uint8Array(await photo.arrayBuffer());
        bytes += body.byteLength;
        if (bytes > maxBytes) throw new Error('Este backup ultrapassa 256 MB. Entre em contato com o suporte para exportar todos os arquivos.');
        contents[file.path] = [body, { level: 0 }];
      }
      const json = strToU8(JSON.stringify({ ...manifest, files: files.map(({ path }) => path) }, null, 2));
      if (bytes + json.byteLength > maxBytes) throw new Error('Este backup ultrapassa 256 MB. Solicite uma exportação ao suporte.');
      contents['dados.json'] = json;
      contents['LEIA-ME.txt'] = strToU8('Backup do consultório NutriDex\n\nOs registros estão em dados.json. As fotografias estão na pasta fotografias. O arquivo contém dados pessoais e clínicos. Guarde-o em um local privado de sua preferência.\n\nO backup reúne os dados existentes durante a exportação. Evite editar registros enquanto o arquivo é gerado. A restauração automática por upload ainda não está disponível.\n');
      setMessage('Preparando o arquivo ZIP…');
      const archive = await new Promise<Uint8Array>((resolve, reject) => {
        zip(contents, { level: 6 }, (error, value) => error ? reject(error) : resolve(value));
      });
      const url = URL.createObjectURL(new Blob([new Uint8Array(archive)], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `nutridex-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setMessage('Arquivo enviado para download. Guarde o ZIP no local de sua preferência.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível gerar o backup. Tente novamente.');
    } finally { setBusy(false); }
  }

  return <div className="space-y-3">
    <p>Baixe os dados do seu consultório e as fotografias em um arquivo ZIP para guardar no local de sua preferência. Evite editar registros durante a geração.</p>
    <button type="button" className="nx-button" disabled={busy} onClick={() => void download()}>{busy ? 'Gerando backup…' : 'Baixar backup completo (.zip)'}</button>
    <p role="status" aria-live="polite">{message}</p>
  </div>;
}
