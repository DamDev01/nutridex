"use client";

import { useRef, useState } from 'react';
import { strToU8, zip, type Zippable } from 'fflate';
import { Archive, ArrowDownToLine, FolderLock, ShieldCheck, X } from 'lucide-react';
import styles from './backup.module.css';

export function BackupDownload() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [accepted, setAccepted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

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

  return <>
    <div className={styles.backup} aria-busy={busy}>
      <div className={styles.overview}>
        <span className={styles.icon}><Archive aria-hidden="true" size={25} /></span>
        <div>
          <span className={styles.eyebrow}>SEUS DADOS COM VOCÊ</span>
          <h3>Uma cópia do seu consultório</h3>
          <p>Exporte seus registros e fotografias em um único arquivo ZIP e escolha onde guardar.</p>
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.hint}><ShieldCheck aria-hidden="true" size={18} /> Download privado · Até 256 MB</span>
        <button type="button" className={styles.primary} disabled={busy} onClick={() => { setAccepted(false); dialog.current?.showModal(); }}>
          <ArrowDownToLine aria-hidden="true" size={18} />{busy ? 'Gerando backup…' : 'Baixar backup completo'}
        </button>
      </div>
      <p className={message ? styles.status : styles.silentStatus} role="status" aria-live="polite">{message}</p>
    </div>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="backup-title" aria-describedby="backup-description" onClose={() => setAccepted(false)}>
      <div className={styles.dialogHeader}>
        <span className={styles.icon}><FolderLock aria-hidden="true" size={25} /></span>
        <button type="button" className={styles.close} aria-label="Fechar orientações de backup" onClick={() => dialog.current?.close()}><X aria-hidden="true" size={20} /></button>
      </div>
      <span className={styles.eyebrow}>ANTES DE BAIXAR</span>
      <h2 id="backup-title">Cuide da sua cópia de segurança</h2>
      <p id="backup-description" className={styles.intro}>O ZIP reúne os registros do consultório e as fotografias da sua conta, incluindo dados pessoais e clínicos dos pacientes.</p>
      <div className={styles.guidance}>
        <section><h3>Guarde em um lugar privado</h3><p>Escolha uma pasta protegida no computador, um HD externo ou uma conta pessoal no Google Drive, OneDrive ou Dropbox. Confira quem tem acesso à pasta e evite links públicos.</p></section>
        <section><h3>A cópia fica sob seus cuidados</h3><p>Ao baixar, você fica responsável por guardar, proteger e compartilhar essa cópia apenas com pessoas autorizadas. O ZIP não é protegido por senha. Prefira armazenamento com senha e autenticação em duas etapas.</p></section>
        <section><h3>Confira o arquivo depois de baixar</h3><p>Mantenha esta página aberta e evite editar registros durante a geração. Depois, confirme que o ZIP abre e contém seus arquivos. A restauração automática por upload ainda não está disponível.</p></section>
      </div>
      <form onSubmit={event => { event.preventDefault(); if (!accepted || busy) return; dialog.current?.close(); void download(); }}>
        <label className={styles.acceptance}><input type="checkbox" required checked={accepted} onChange={event => setAccepted(event.target.checked)} /><span>Li as orientações e estou ciente dos cuidados e da minha responsabilidade pela cópia baixada.</span></label>
        <div className={styles.dialogActions}>
          <button type="button" className={styles.secondary} onClick={() => dialog.current?.close()}>Cancelar</button>
          <button type="submit" className={styles.primary} disabled={!accepted || busy}><ArrowDownToLine aria-hidden="true" size={18} />Aceitar e baixar ZIP</button>
        </div>
      </form>
    </dialog>
  </>;
}
