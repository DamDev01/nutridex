import { Icon } from './Navigation';

const categories = [
  ['Energia', 'TMB, GET, déficit, superávit e gasto por atividade.'],
  ['Dieta', 'Proteínas, hidratação, macronutrientes e adequação da dieta.'],
  ['Antropometria', 'IMC, relação cintura-quadril e estimativa de peso ideal.'],
  ['Bioquímica e clínica', 'HOMA-IR, TFG, indicadores lipídicos e outras ferramentas de apoio.'],
];

export function CalculeNutriSection() {
  return <section className="nd-section nd-calc" id="calcule-nutri" aria-labelledby="calcule-nutri-title">
    <div><p className="nd-kicker">UM DESTAQUE DA NUTRIDEX</p><h2 id="calcule-nutri-title">Calcule Nutri.<br/>Mais ferramentas para<br/>sua prática nutricional.</h2><p>27 calculadoras nutricionais e clínicas integradas ao seu consultório. Dos cálculos de energia e nutrientes aos indicadores de avaliação, encontre as ferramentas da sua rotina em um só lugar.</p><p>Organizadas por categoria, com busca para você encontrar o cálculo que precisa durante o atendimento.</p><a className="nd-primary" href="/login?next=%2Fassinatura">Quero o Calcule Nutri <span>↗</span></a><small>Incluído no plano NutriDex. Acesso após confirmação do pagamento.</small></div>
    <div className="nd-calc-panel"><div className="nd-calc-panel-title"><span><Icon name="calculator"/>CALCULE NUTRI</span><strong>27<span>calculadoras</span></strong></div><div className="nd-calc-categories">{categories.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><p className="nd-calc-note">Cálculos de apoio à avaliação profissional, integrados à sua rotina.</p></div>
  </section>;
}
