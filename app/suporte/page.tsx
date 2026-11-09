import { PublicDocument } from '../components/PublicDocument';
import { commercial } from '../lib/commercial';
export default function SupportPage() {
  return <PublicDocument title="Suporte NutriDex"><p>Para dúvidas de acesso, uso, cobrança, cancelamento ou privacidade, fale com o responsável pela NutriDex.</p><p><a className="underline" href={'mailto:'+commercial.email}>{commercial.email}</a><br /><a className="underline" href={commercial.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp {commercial.phone}</a></p><p>Informe a página, o horário aproximado e o que aconteceu. Não envie senhas, códigos de acesso, dados de cartão, fotografias corporais ou prontuários pelo canal inicial de suporte.</p></PublicDocument>;
}
