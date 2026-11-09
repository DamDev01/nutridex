
        function openCalculator(type) {
            const modal = document.getElementById('calculator-modal');
            const content = document.getElementById('calculator-content');
            
            // Limpa o conteúdo anterior
            content.innerHTML = '';
            
            // Adiciona o novo conteúdo baseado no tipo
            switch(type) {
                case 'tmb':
                    content.innerHTML = `
                        <h2>Calculadora TMB</h2>
                        <form id="tmb-form">
                            <div class="form-group">
                                <label>Nome do Paciente:</label>
                                <input type="text" id="tmb-nome" required>
                            </div>
                            <div class="form-group">
                                <label>Fórmula:</label>
                                <select id="tmb-formula">
                                    <option value="harris">Harris-Benedict</option>
                                    <option value="mifflin">Mifflin-St Jeor</option>
                                    <option value="cunningham">Cunningham</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Peso (kg):</label>
                                <input type="number" id="tmb-peso" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Altura (cm):</label>
                                <input type="number" id="tmb-altura" required>
                            </div>
                            <div class="form-group">
                                <label>Idade:</label>
                                <input type="number" id="tmb-idade" required>
                            </div>
                            <div class="form-group">
                                <label>Sexo:</label>
                                <select id="tmb-sexo">
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularTMB()">Calcular TMB</button>
                            <div id="tmb-resultado" class="result"></div>
                        </form>
                    `;
                    break;

                case 'get':
                    content.innerHTML = `
                        <h2>Calculadora GET</h2>
                        <form id="get-form">
                            <div class="form-group">
                                <label>TMB:</label>
                                <input type="number" id="get-tmb" required>
                            </div>
                            <div class="form-group">
                                <label>Fator Atividade:</label>
                                <select id="get-fator">
                                    <option value="1.2">Sedentário</option>
                                    <option value="1.375">Levemente ativo</option>
                                    <option value="1.55">Moderadamente ativo</option>
                                    <option value="1.725">Muito ativo</option>
                                    <option value="1.9">Extremamente ativo</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularGET()">Calcular GET</button>
                            <div id="get-resultado" class="result"></div>
                        </form>
                    `;
                    break;

                case 'imc':
                    content.innerHTML = `
                        <h2>Calculadora IMC</h2>
                        <form id="imc-form">
                            <div class="form-group">
                                <label>Peso (kg):</label>
                                <input type="number" id="imc-peso" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Altura (m):</label>
                                <input type="number" id="imc-altura" step="0.01" required>
                            </div>
                            <button type="button" onclick="calcularIMC()">Calcular IMC</button>
                            <div id="imc-resultado" class="result"></div>
                        </form>
                    `;
                    break;

                case 'homa':
                    content.innerHTML = `
                        <h2>Calculadora HOMA-IR</h2>
                        <form id="homa-ir-form">
                            <div class="form-group">
                                <label>Glicemia de jejum (mg/dL):</label>
                                <input type="number" id="homa-glicemia" required>
                            </div>
                            <div class="form-group">
                                <label>Insulina de jejum (μU/mL):</label>
                                <input type="number" id="homa-insulina" required>
                            </div>
                            <button type="button" onclick="calcularHOMAIR()">Calcular HOMA-IR</button>
                            <div id="homa-ir-resultado" class="result"></div>
                        </form>
                    `;
                    break;

                case 'tfg':
                    content.innerHTML = `
                        <h2>Calculadora TFG</h2>
                        <form id="tfg-form">
                            <div class="form-group">
                                <label>Creatinina sérica (mg/dL):</label>
                                <input type="number" id="tfg-creatinina" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label>Idade:</label>
                                <input type="number" id="tfg-idade" required>
                            </div>
                            <div class="form-group">
                                <label>Sexo:</label>
                                <select id="tfg-sexo">
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Raça:</label>
                                <select id="tfg-raca">
                                    <option value="N">Não negro</option>
                                    <option value="S">Negro</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularTFG()">Calcular TFG</button>
                            <div id="tfg-resultado" class="result"></div>
                        </form>
                    `;
                    break;

                case 'lipid':
                    content.innerHTML = `
                        <h2>Razões Lipídicas</h2>
                        <form id="lipid-form">
                            <div class="form-group">
                                <label>Colesterol Total (mg/dL):</label>
                                <input type="number" id="colesterol-total" required>
                            </div>
                            <div class="form-group">
                                <label>HDL (mg/dL):</label>
                                <input type="number" id="hdl" required>
                            </div>
                            <div class="form-group">
                                <label>LDL (mg/dL):</label>
                                <input type="number" id="ldl" required>
                            </div>
                            <div class="form-group">
                                <label>Triglicerídeos (mg/dL):</label>
                                <input type="number" id="triglicerides" required>
                            </div>
                            <button type="button" onclick="calcularRazoesLipidicas()">Calcular Razões</button>
                            <div id="lipid-resultado" class="result"></div>
                        </form>
                    `;
                    break;

                case 'bolus':
                    content.innerHTML = `
                        <h2>Calculadora de Bolus</h2>
                        <form id="bolus-form">
                            <div class="form-group">
                                <label>Carboidratos totais da refeição (g):</label>
                                <input type="number" id="bolus-carb" required>
                            </div>
                            <div class="form-group">
                                <label>Relação Insulina:Carboidrato (1:x):</label>
                                <input type="number" id="bolus-ratio" placeholder="Ex: 15 para 1:15" required>
                            </div>
                            <div class="form-group">
                                <label>Glicemia atual (mg/dL):</label>
                                <input type="number" id="bolus-glicemia" required>
                            </div>
                            <div class="form-group">
                                <label>Meta de glicemia (mg/dL):</label>
                                <input type="number" id="bolus-meta" value="100" required>
                            </div>
                            <div class="form-group">
                                <label>Fator de Sensibilidade (FSI):</label>
                                <input type="number" id="bolus-fsi" placeholder="mg/dL por 1UI" required>
                            </div>
                            <button type="button" onclick="calcularBolus()">Calcular Bolus</button>
                            <div id="bolus-resultado" class="result"></div>
                        </form>
                    `;

                    break;

                case 'superavit':
                    content.innerHTML= `
                    <h2>Calculadora Superávit</h2>
                    <form id="superavit-form">
                        <div class="form-group">
                            <label>GET (kcal):</label>
                            <input type="number" id="superavit-get" required>
                        </div>
                        <div class="form-group">
                            <label>Porcentagem de Superávit (%):</label>
                            <input type="number" id="superavit-percentual" value="10" min="0" max="30" required>
                        </div>
                        <button type="button" onclick="calcularSuperavit()">Calcular Superávit</button>
                        <div id="superavit-resultado" class="result"></div>
                    </form>
                    `;

                    break; 
                    
                case 'Deficit':
                    content.innerHTML= `
                     <h2>Calculadora Déficit</h2>
                    <form id="deficit-form">
                        <div class="form-group">
                            <label>GET (kcal):</label>
                            <input type="number" id="deficit-get" required>
                        </div>
                        <div class="form-group">
                            <label>Porcentagem de Déficit (%):</label>
                            <input type="number" id="deficit-percentual" value="20" min="0" max="30" required>
                        </div>
                        <button type="button" onclick="calcularDeficit()">Calcular Déficit</button>
                        <div id="deficit-resultado" class="result"></div>
                    </form>
                    `;
                    break;
                    case 'cbc':
                    content.innerHTML = `
                        <h2>Análise de Hemograma</h2>
                            <form id="cbc-form">
                                <div class="form-group">
                                    <label>Hemoglobina (g/dL):</label>
                                    <input type="number" id="cbc-hemoglobina" step="0.1" required>
                                </div>
                                <div class="form-group">
                                    <label>Hematócrito (%):</label>
                                    <input type="number" id="cbc-hematocrito" step="0.1" required>
                                </div>
                                <div class="form-group">
                                    <label>Leucócitos (mil/mm³):</label>
                                    <input type="number" id="cbc-leucocitos" step="0.1" required>
                                </div>
                                <div class="form-group">
                                    <label>Plaquetas (mil/mm³):</label>
                                    <input type="number" id="cbc-plaquetas" required>
                                </div>
                                <div class="form-group">
                                    <label>Sexo:</label>
                                    <select id="cbc-sexo">
                                        <option value="M">Masculino</option>
                                        <option value="F">Feminino</option>
                                    </select>
                                </div>
                                <button type="button" onclick="analisarHemograma()">Analisar Hemograma</button>
                                <div id="cbc-resultado" class="result"></div>
                            </form>
                                 `;
                            break;
                            case 'satfat':
                    content.innerHTML = `
                        <h2>Calculadora de Gordura Saturada</h2>
                        <form id="satfat-form">
                            <div class="form-group">
                                <label>Calorias totais da dieta (kcal):</label>
                                <input type="number" id="satfat-calorias" required>
                            </div>
                            <div class="form-group">
                                <label>Percentual desejado de gordura saturada (%):</label>
                                <input type="number" id="satfat-percentual" value="7" min="0" max="10" required>
                            </div>
                            <button type="button" onclick="calcularGorduraSaturada()">Calcular</button>
                            <div id="satfat-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                    case 'proteina':
                    content.innerHTML = `
                        <h2>Necessidades Proteicas</h2>
                        <form id="proteina-form">
                            <div class="form-group">
                                <label>Peso (kg):</label>
                                <input type="number" id="proteina-peso" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Situação:</label>
                                <select id="proteina-situacao">
                                    <option value="sedentario">Sedentário (0.8g/kg)</option>
                                    <option value="atividade">Atividade Física (1.2g/kg)</option>
                                    <option value="atleta">Atleta (1.6-2.0g/kg)</option>
                                    <option value="idoso">Idoso (1.0-1.2g/kg)</option>
                                    <option value="doenca">Doença (1.2-1.5g/kg)</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularProteina()">Calcular</button>
                            <div id="proteina-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                
                case 'hidratacao':
                    content.innerHTML = `
                        <h2>Necessidades Hídricas</h2>
                        <form id="hidratacao-form">
                            <div class="form-group">
                                <label>Peso (kg):</label>
                                <input type="number" id="hidratacao-peso" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Clima:</label>
                                <select id="hidratacao-clima">
                                    <option value="normal">Normal</option>
                                    <option value="quente">Quente</option>
                                    <option value="muito-quente">Muito Quente</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Nível de Atividade:</label>
                                <select id="hidratacao-atividade">
                                    <option value="sedentario">Sedentário</option>
                                    <option value="moderado">Moderadamente Ativo</option>
                                    <option value="intenso">Muito Ativo</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularHidratacao()">Calcular</button>
                            <div id="hidratacao-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                
                case 'rcq':
                    content.innerHTML = `
                        <h2>Relação Cintura-Quadril</h2>
                        <form id="rcq-form">
                            <div class="form-group">
                                <label>Circunferência da Cintura (cm):</label>
                                <input type="number" id="rcq-cintura" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Circunferência do Quadril (cm):</label>
                                <input type="number" id="rcq-quadril" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Sexo:</label>
                                <select id="rcq-sexo">
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Idade:</label>
                                <input type="number" id="rcq-idade" required>
                            </div>
                            <button type="button" onclick="calcularRCQ()">Calcular</button>
                            <div id="rcq-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                
                case 'bioquimicos':
                    content.innerHTML = `
                        <h2>Avaliação de Exames Bioquímicos</h2>
                        <form id="bioquimicos-form">
                            <div class="form-group">
                                <label>Vitamina D (ng/mL):</label>
                                <input type="number" id="bio-vitd" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Ferritina (ng/mL):</label>
                                <input type="number" id="bio-ferritina" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>TSH (mUI/L):</label>
                                <input type="number" id="bio-tsh" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label>T4 livre (ng/dL):</label>
                                <input type="number" id="bio-t4" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label>Ácido Úrico (mg/dL):</label>
                                <input type="number" id="bio-urico" step="0.1" required>
                            </div>
                            <button type="button" onclick="avaliarBioquimicos()">Avaliar</button>
                            <div id="bioquimicos-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                    case 'pesoIdeal':
                    content.innerHTML = `
                        <h2>Cálculo de Peso Ideal</h2>
                        <form id="peso-ideal-form">
                            <div class="form-group">
                                <label>Altura (cm):</label>
                                <input type="number" id="pi-altura" required>
                            </div>
                            <div class="form-group">
                                <label>Sexo:</label>
                                <select id="pi-sexo">
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Compleição:</label>
                                <select id="pi-compleicao">
                                    <option value="pequena">Pequena</option>
                                    <option value="media">Média</option>
                                    <option value="grande">Grande</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularPesoIdeal()">Calcular</button>
                            <div id="peso-ideal-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                
                    case 'gastoAtividade':
                    content.innerHTML = `
                        <h2>Gasto Calórico por Atividade</h2>
                        <form id="gasto-atividade-form">
                            <div class="form-group">
                                <label>Peso (kg):</label>
                                <input type="number" id="atividade-peso" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Tempo (minutos):</label>
                                <input type="number" id="atividade-tempo" required>
                            </div>
                            <div class="form-group">
                                <label>Atividade:</label>
                                <select id="atividade-tipo">
                                    <optgroup label="Artes Marciais">
                                        <option value="jiu-leve">Jiu-Jitsu (treino leve) - MET 6.0</option>
                                        <option value="jiu-moderado">Jiu-Jitsu (sparring) - MET 9.0</option>
                                        <option value="jiu-intenso">Jiu-Jitsu (competição) - MET 12.0</option>
                                        <option value="muay">Muay Thai - MET 10.0</option>
                                        <option value="boxe">Boxe - MET 9.0</option>
                                        <option value="karate">Karatê - MET 8.0</option>
                                        <option value="judo">Judô - MET 9.0</option>
                                    </optgroup>
                                    <optgroup label="Musculação">
                                        <option value="musc-leve">Musculação leve - MET 3.5</option>
                                        <option value="musc-moderada">Musculação moderada - MET 5.0</option>
                                        <option value="musc-intensa">Musculação intensa - MET 6.0</option>
                                    </optgroup>
                                    <optgroup label="Cardio">
                                        <option value="corrida-leve">Corrida leve - MET 7.0</option>
                                        <option value="corrida-moderada">Corrida moderada - MET 9.0</option>
                                        <option value="corrida-intensa">Corrida intensa - MET 12.0</option>
                                        <option value="bike">Ciclismo - MET 8.0</option>
                                        <option value="natacao">Natação - MET 7.0</option>
                                    </optgroup>
                                    <optgroup label="Outros">
                                        <option value="futebol">Futebol - MET 7.0</option>
                                        <option value="volei">Vôlei - MET 4.0</option>
                                        <option value="basquete">Basquete - MET 6.5</option>
                                        <option value="tenis">Tênis - MET 7.0</option>
                                        <option value="yoga">Yoga - MET 2.5</option>
                                        <option value="pilates">Pilates - MET 3.0</option>
                                    </optgroup>
                                </select>
                            </div>
                            <button type="button" onclick="calcularGastoAtividade()">Calcular</button>
                            <div id="atividade-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                
                case 'macros':
                    content.innerHTML = `
                        <h2>Distribuição de Macronutrientes</h2>
                        <form id="macros-form">
                            <div class="form-group">
                                <label>Calorias Totais:</label>
                                <input type="number" id="macros-calorias" required>
                            </div>
                            <div class="form-group">
                                <label>Tipo de Dieta:</label>
                                <select id="macros-tipo">
                                    <option value="balanced">Balanceada (45C/30P/25G)</option>
                                    <option value="lowcarb">Low Carb (25C/40P/35G)</option>
                                    <option value="keto">Cetogênica (5C/30P/65G)</option>
                                    <option value="highcarb">Alta em Carbo (60C/25P/15G)</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularMacros()">Calcular</button>
                            <div id="macros-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                
                case 'dri':
                    content.innerHTML = `
                        <h2>Adequação da Dieta (DRI)</h2>
                        <form id="dri-form">
                            <div class="form-group">
                                <label>Energia (kcal):</label>
                                <input type="number" id="dri-energia" required>
                            </div>
                            <div class="form-group">
                                <label>Proteína (g):</label>
                                <input type="number" id="dri-proteina" required>
                            </div>
                            <div class="form-group">
                                <label>Cálcio (mg):</label>
                                <input type="number" id="dri-calcio" required>
                            </div>
                            <div class="form-group">
                                <label>Ferro (mg):</label>
                                <input type="number" id="dri-ferro" required>
                            </div>
                            <div class="form-group">
                                <label>Fibras (g):</label>
                                <input type="number" id="dri-fibras" required>
                            </div>
                            <div class="form-group">
                                <label>Sexo:</label>
                                <select id="dri-sexo">
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Idade:</label>
                                <input type="number" id="dri-idade" required>
                            </div>
                            <button type="button" onclick="calcularDRI()">Calcular</button>
                            <div id="dri-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                case 'riscoFratura':
                    content.innerHTML = `
                        <h2>Calculadora de Risco de Fratura</h2>
                        <form id="risco-fratura-form">
                            <div class="form-group">
                                <label>Nome da Paciente:</label>
                                <input type="text" id="fratura-nome" required>
                            </div>
                            <div class="form-group">
                                <label>Idade (anos):</label>
                                <input type="number" id="fratura-idade" min="40" max="90" required>
                            </div>
                            <div class="form-group">
                                <label>DMO T-score:</label>
                                <input type="number" id="fratura-dmo" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label>Fratura prévia:</label>
                                <select id="fratura-previa">
                                    <option value="no">Não</option>
                                    <option value="yes">Sim</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fratura de quadril em um dos pais:</label>
                                <select id="fratura-pais">
                                    <option value="no">Não</option>
                                    <option value="yes">Sim</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fumante atual:</label>
                                <select id="fratura-fumante">
                                    <option value="no">Não</option>
                                    <option value="yes">Sim</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Uso de glicocorticoides:</label>
                                <select id="fratura-glicocorticoides">
                                    <option value="no">Não</option>
                                    <option value="yes">Sim</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Artrite reumatoide:</label>
                                <select id="fratura-artrite">
                                    <option value="no">Não</option>
                                    <option value="yes">Sim</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Osteoporose secundária:</label>
                                <select id="fratura-secundaria">
                                    <option value="no">Não</option>
                                    <option value="yes">Sim</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Consumo de álcool (≥3 doses/dia):</label>
                                <select id="fratura-alcool">
                                    <option value="no">Não</option>
                                    <option value="yes">Sim</option>
                                </select>
                            </div>
                            <button type="button" onclick="calcularRiscoFratura()">Calcular Risco</button>
                            <div id="fratura-resultado" class="result"></div>
                        </form>
                    `;
                    break;
                    case 'pesi':
    content.innerHTML = `
        <h2>Calculadora do Índice de Severidade de Embolia Pulmonar (PESI)</h2>
        <form id="pesi-form">
            <div class="form-group">
                <label>Nome do Paciente:</label>
                <input type="text" id="pesi-nome" required>
            </div>
            <div class="form-group">
                <label>Idade (anos):</label>
                <input type="number" id="pesi-idade" required>
            </div>
            <div class="form-group">
                <label>Sexo:</label>
                <select id="pesi-sexo">
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                </select>
            </div>
            <div class="form-group">
                <label>Câncer:</label>
                <select id="pesi-cancer">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Insuficiência cardíaca:</label>
                <select id="pesi-icc">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Doença pulmonar crônica:</label>
                <select id="pesi-dpoc">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Frequência cardíaca ≥110 bpm:</label>
                <select id="pesi-fc110">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Pressão arterial sistólica <100 mmHg:</label>
                <select id="pesi-pas">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Frequência respiratória ≥30/min:</label>
                <select id="pesi-fr">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Temperatura <36°C:</label>
                <select id="pesi-temp">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Alteração do estado mental:</label>
                <select id="pesi-mental">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Saturação arterial de O₂ <90%:</label>
                <select id="pesi-saturacao">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <button type="button" onclick="calcularPESI()">Calcular PESI</button>
            <div id="pesi-resultado" class="result"></div>
        </form>
    `;
    break;
    
    case 'perc':
    content.innerHTML = `
        <h2>Calculadora da Regra PERC para Embolia Pulmonar</h2>
        <form id="perc-form">
            <div class="form-group">
                <label>Nome do Paciente:</label>
                <input type="text" id="perc-nome" required>
            </div>
            <div class="form-group">
                <label>Idade ≥50 anos:</label>
                <select id="perc-idade">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Frequência cardíaca ≥100 bpm:</label>
                <select id="perc-fc">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Saturação de O₂ <95%:</label>
                <select id="perc-saturacao">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Edema unilateral de perna:</label>
                <select id="perc-edema">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Hemoptise:</label>
                <select id="perc-hemoptise">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cirurgia ou trauma recente (4 semanas):</label>
                <select id="perc-cirurgia">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>História prévia de TVP/EP:</label>
                <select id="perc-historia">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Uso de hormônios (estrogênio):</label>
                <select id="perc-hormonios">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <button type="button" onclick="calcularPERC()">Avaliar Critérios</button>
            <div id="perc-resultado" class="result"></div>
        </form>
    `;
    break;

    case 'epWells':
    content.innerHTML = `
        <h2>Calculadora de Probabilidade Clínica de EP (Wells)</h2>
        <form id="ep-wells-form">
            <div class="form-group">
                <label>Nome do Paciente:</label>
                <input type="text" id="ep-nome" required>
            </div>
            <div class="form-group">
                <label>Sinais clínicos e sintomas de TVP:</label>
                <select id="ep-tvp">
                    <option value="0">Não</option>
                    <option value="3">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Diagnóstico alternativo menos provável que EP:</label>
                <select id="ep-diagnostico">
                    <option value="0">Não</option>
                    <option value="3">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Frequência cardíaca >100 bpm:</label>
                <select id="ep-taquicardia">
                    <option value="0">Não</option>
                    <option value="1.5">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Imobilização ou cirurgia nas 4 semanas anteriores:</label>
                <select id="ep-imobilizacao">
                    <option value="0">Não</option>
                    <option value="1.5">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>História prévia de TVP/EP:</label>
                <select id="ep-historia">
                    <option value="0">Não</option>
                    <option value="1.5">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Hemoptise:</label>
                <select id="ep-hemoptise">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Malignidade (em tratamento, tratada nos últimos 6 meses ou paliativa):</label>
                <select id="ep-malignidade">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <button type="button" onclick="calcularEPWells()">Calcular Probabilidade</button>
            <div id="ep-resultado" class="result"></div>
        </form>
    `;
    break;

    case 'tvpWells':
    content.innerHTML = `
        <h2>Calculadora de Probabilidade Clínica de TVP (Wells)</h2>
        <form id="tvp-wells-form">
            <div class="form-group">
                <label>Nome do Paciente:</label>
                <input type="text" id="tvp-nome" required>
            </div>
            <div class="form-group">
                <label>Câncer ativo (tratamento atual ou nos últimos 6 meses):</label>
                <select id="tvp-cancer">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Paralisia ou imobilização recente dos membros inferiores:</label>
                <select id="tvp-paralisia">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Repouso no leito recente (>3 dias) ou cirurgia maior nas últimas 12 semanas:</label>
                <select id="tvp-repouso">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Sensibilidade localizada ao longo do sistema venoso profundo:</label>
                <select id="tvp-sensibilidade">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Edema em toda a perna:</label>
                <select id="tvp-edema-perna">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Inchaço da panturrilha >3cm em comparação com a perna assintomática:</label>
                <select id="tvp-inchaço">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Edema depressível (cacifo) maior na perna sintomática:</label>
                <select id="tvp-edema-cacifo">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Veias colaterais superficiais (não varicosas):</label>
                <select id="tvp-veias">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Diagnóstico alternativo tão ou mais provável que TVP:</label>
                <select id="tvp-diagnostico">
                    <option value="0">Não</option>
                    <option value="-2">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>História prévia de TVP documentada:</label>
                <select id="tvp-historia">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <button type="button" onclick="calcularTVPWells()">Calcular Probabilidade</button>
            <div id="tvp-resultado" class="result"></div>
        </form>
    `;
    break;
    case 'ldlCalculadora':
    content.innerHTML = `
        <h2>Calculadora de LDL e Tamanho de Partícula</h2>
        <form id="ldl-form">
            <div class="form-group">
                <label>Nome do Paciente:</label>
                <input type="text" id="ldl-nome" required>
            </div>
            <div class="form-group">
                <label>Colesterol Total (mg/dL):</label>
                <input type="number" id="ldl-colesterol-total" required>
            </div>
            <div class="form-group">
                <label>HDL (mg/dL):</label>
                <input type="number" id="ldl-hdl" required>
            </div>
            <div class="form-group">
                <label>Triglicerídeos (mg/dL):</label>
                <input type="number" id="ldl-triglicerideos" required>
            </div>
            <button type="button" onclick="calcularLDL()">Calcular LDL</button>
            <div id="ldl-resultado" class="result"></div>
        </form>
    `;
    break;
    case 'tireoideDiagnostico':
    content.innerHTML = `
        <h2>Calculadora de Diagnóstico Tireoidiano</h2>
        <form id="tireoide-form">
            <div class="form-group">
                <label>Nome do Paciente:</label>
                <input type="text" id="tireoide-nome" required>
            </div>
            <div class="form-group">
                <label>TSH (mUI/L):</label>
                <input type="number" step="0.01" id="tireoide-tsh" required>
            </div>
            <div class="form-group">
                <label>T4 livre (ng/dL):</label>
                <input type="number" step="0.01" id="tireoide-t4l" required>
            </div>
            <div class="form-group">
                <label>T3 livre (pg/mL) (opcional):</label>
                <input type="number" step="0.01" id="tireoide-t3l">
            </div>
            <div class="form-group">
                <label>Anti-TPO (UI/mL) (opcional):</label>
                <input type="number" step="0.01" id="tireoide-anti-tpo">
            </div>
            <div class="form-group">
                <label>Anti-Tg (UI/mL) (opcional):</label>
                <input type="number" step="0.01" id="tireoide-anti-tg">
            </div>
            <div class="form-group">
                <label>Anticorpos anti-receptor de TSH (TRAb):</label>
                <select id="tireoide-trab">
                    <option value="nao_realizado">Não realizado</option>
                    <option value="positivo">Positivo</option>
                    <option value="negativo">Negativo</option>
                </select>
            </div>
            <button type="button" onclick="calcularDiagnosticoTireoidiano()">Analisar Resultados</button>
            <div id="tireoide-resultado" class="result"></div>
        </form>
    `;
    break;
    case 'ascvdRisco':
    content.innerHTML = `
        <h2>Calculadora de Risco de ASCVD (Doença Cardiovascular Aterosclerótica)</h2>
        <form id="ascvd-form">
            <div class="form-group">
                <label>Nome do Paciente:</label>
                <input type="text" id="ascvd-nome" required>
            </div>
            <div class="form-group">
                <label>Idade (anos):</label>
                <input type="number" id="ascvd-idade" min="40" max="79" required>
                <small>Calculadora validada para idades entre 40-79 anos</small>
            </div>
            <div class="form-group">
                <label>Sexo:</label>
                <select id="ascvd-sexo" required>
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
            </div>
            <div class="form-group">
                <label>Raça/Etnia:</label>
                <select id="ascvd-raca" required>
                    <option value="">Selecione</option>
                    <option value="AA">Afro-Americano/Negro</option>
                    <option value="BR">Branco/Outra raça</option>
                </select>
            </div>
            <div class="form-group">
                <label>Colesterol Total (mg/dL):</label>
                <input type="number" id="ascvd-colesterol-total" min="130" max="320" required>
            </div>
            <div class="form-group">
                <label>HDL (mg/dL):</label>
                <input type="number" id="ascvd-hdl" min="20" max="100" required>
            </div>
            <div class="form-group">
                <label>Pressão Arterial Sistólica (mmHg):</label>
                <input type="number" id="ascvd-pas" min="90" max="200" required>
            </div>
            <div class="form-group">
                <label>Tratamento para Hipertensão:</label>
                <select id="ascvd-hipertensao" required>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Diabetes:</label>
                <select id="ascvd-diabetes" required>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Fumante Atual:</label>
                <select id="ascvd-fumante" required>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            
            <!-- Fatores adicionais (opcionais) -->
            <h3>Fatores de Risco Adicionais (Opcionais)</h3>
            
            <div class="form-group">
                <label>História Familiar de DCV Prematura:</label>
                <select id="ascvd-historico-familiar">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
                <small>Infarto ou AVC em parente de 1º grau: homem &lt;55 anos ou mulher &lt;65 anos</small>
            </div>
            
            <div class="form-group">
                <label>PCR-us Elevada:</label>
                <select id="ascvd-pcr">
                    <option value="0">Não ou Não Avaliada</option>
                    <option value="1">Sim (≥2 mg/L)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Escore de Cálcio Coronário:</label>
                <select id="ascvd-calcificacao">
                    <option value="nao_realizado">Não Realizado</option>
                    <option value="0">0 (Zero)</option>
                    <option value="1-99">1-99</option>
                    <option value="100-300">100-300</option>
                    <option value=">300">Maior que 300</option>
                </select>
            </div>
            
            <button type="button" onclick="calcularRiscoASCVD()">Calcular Risco ASCVD</button>
            <div id="ascvd-resultado" class="result"></div>
        </form>
    `;
    break;
                
            }
            
            modal.style.display = 'block';
        }

        function closeModal() {
            document.getElementById('calculator-modal').style.display = 'none';
        }

        function calcularTMB() {
            const peso = parseFloat(document.getElementById('tmb-peso').value);
            const altura = parseFloat(document.getElementById('tmb-altura').value);
            const idade = parseInt(document.getElementById('tmb-idade').value);
            const sexo = document.getElementById('tmb-sexo').value;
            const formula = document.getElementById('tmb-formula').value;
            let tmb = 0;

            switch(formula) {
                case 'harris':
                    if(sexo === 'M') {
                        tmb = 66.5 + (13.75 * peso) + (5.003 * altura) - (6.75 * idade);
                    } else {
                        tmb = 655.1 + (9.563 * peso) + (1.850 * altura) - (4.676 * idade);
                    }
                    break;
                case 'mifflin':
                    if(sexo === 'M') {
                        tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
                    } else {
                        tmb = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
                    }
                    break;
                case 'cunningham':
                    tmb = 22 * peso + 500;
                    break;
            }

            const nome = document.getElementById('tmb-nome').value;
            const resultado = document.getElementById('tmb-resultado');
            resultado.innerHTML = `
                <h3>Resultado para ${nome}:</h3>
                <p>TMB: ${tmb.toFixed(2)} kcal/dia</p>
                <p>Fórmula utilizada: ${document.getElementById('tmb-formula').options[document.getElementById('tmb-formula').selectedIndex].text}</p>
            `;
        }

        function calcularGET() {
            const tmb = parseFloat(document.getElementById('get-tmb').value);
            const fator = parseFloat(document.getElementById('get-fator').value);
            const get = tmb * fator;
            
            document.getElementById('get-resultado').innerHTML = `
                GET: ${get.toFixed(2)} kcal/dia
            `;
        }

        function calcularIMC() {
            const peso = parseFloat(document.getElementById('imc-peso').value);
            const altura = parseFloat(document.getElementById('imc-altura').value);
            const imc = peso / (altura * altura);
            let classificacao = '';
            
            if(imc < 18.5) classificacao = 'Abaixo do peso';
            else if(imc < 25) classificacao = 'Peso normal';
            else if(imc < 30) classificacao = 'Sobrepeso';
            else if(imc < 35) classificacao = 'Obesidade Grau I';
            else if(imc < 40) classificacao = 'Obesidade Grau II';
            else classificacao = 'Obesidade Grau III';
            
            document.getElementById('imc-resultado').innerHTML = `
                IMC: ${imc.toFixed(2)} - ${classificacao}
            `;
        }

        function calcularHOMAIR() {
            const glicemia = parseFloat(document.getElementById('homa-glicemia').value);
            const insulina = parseFloat(document.getElementById('homa-insulina').value);
            const homa = (glicemia * insulina) / 405;
            let interpretacao = '';
            
            if(homa < 2.71) interpretacao = 'Normal';
            else if(homa < 4.0) interpretacao = 'Resistência leve';
            else interpretacao = 'Resistência significativa';
            
            document.getElementById('homa-ir-resultado').innerHTML = `
                HOMA-IR: ${homa.toFixed(2)} - ${interpretacao}
            `;
        }

        function calcularTFG() {
            const creatinina = parseFloat(document.getElementById('tfg-creatinina').value);
            const idade = parseInt(document.getElementById('tfg-idade').value);
            const sexo = document.getElementById('tfg-sexo').value;
            const raca = document.getElementById('tfg-raca').value;
            
            let tfg = 186 * Math.pow(creatinina, -1.154) * Math.pow(idade, -0.203);
            
            if(sexo === 'F') tfg *= 0.742;
            if(raca === 'S') tfg *= 1.212;
            
            document.getElementById('tfg-resultado').innerHTML = `
                TFG: ${tfg.toFixed(2)} mL/min/1.73m²
            `;
        }

        function calcularRazoesLipidicas() {
            const ct = parseFloat(document.getElementById('colesterol-total').value);
            const hdl = parseFloat(document.getElementById('hdl').value);
            const ldl = parseFloat(document.getElementById('ldl').value);
            const tg = parseFloat(document.getElementById('triglicerides').value);
            
            const ctHdl = (ct / hdl).toFixed(2);
            const ldlHdl = (ldl / hdl).toFixed(2);
            const tgHdl = (tg / hdl).toFixed(2);
            
            document.getElementById('lipid-resultado').innerHTML = `
                CT/HDL: ${ctHdl} (Ideal < 4.5)<br>
                LDL/HDL: ${ldlHdl} (Ideal < 3.5)<br>
                TG/HDL: ${tgHdl} (Ideal < 2.3)
            `;
        }

        function calcularBolus() {
            const carb = parseFloat(document.getElementById('bolus-carb').value);
            const ratio = parseFloat(document.getElementById('bolus-ratio').value);
            const glicemia = parseFloat(document.getElementById('bolus-glicemia').value);
            const meta = parseFloat(document.getElementById('bolus-meta').value);
            const fsi = parseFloat(document.getElementById('bolus-fsi').value);
            
            const bolusComida = carb / ratio;
            const bolusCorrecao = (glicemia - meta) / fsi;
            const bolusTotal = bolusComida + Math.max(bolusCorrecao, 0);
            
            document.getElementById('bolus-resultado').innerHTML = `
                Bolus alimentar: ${bolusComida.toFixed(2)} UI<br>
                Bolus correção: ${bolusCorrecao.toFixed(2)} UI<br>
                <strong>Total: ${bolusTotal.toFixed(2)} UI</strong>
            `;
        }
        
        function calcularSuperavit() {
            const get = parseFloat(document.getElementById('superavit-get').value);
            const percentual = parseFloat(document.getElementById('superavit-percentual').value);
            const superavit = get * (1 + percentual/100);

            document.getElementById('superavit-resultado').innerHTML = 
                `Calorias com Superávit: ${Math.round(superavit)} kcal/dia<br>` +
                `Adicional: ${Math.round(superavit - get)} kcal/dia
            `;
        }

        function calcularDeficit() {
            const get = parseFloat(document.getElementById('deficit-get').value);
            const percentual = parseFloat(document.getElementById('deficit-percentual').value);
            const deficit = get * (1 - percentual/100);

            document.getElementById('deficit-resultado').innerHTML = 
                `Calorias com Déficit: ${Math.round(deficit)} kcal/dia<br>` +
                `Redução: ${Math.round(get - deficit)} kcal/dia`;
        }
        function analisarHemograma() {
            const hemoglobina = parseFloat(document.getElementById('cbc-hemoglobina').value);
            const hematocrito = parseFloat(document.getElementById('cbc-hematocrito').value);
            const leucocitos = parseFloat(document.getElementById('cbc-leucocitos').value);
            const plaquetas = parseFloat(document.getElementById('cbc-plaquetas').value);
            const sexo = document.getElementById('cbc-sexo').value;
        
            let resultado = '';
            
            // Análise de Hemoglobina
            const hemoglobinaRef = sexo === 'M' ? 
                {min: 13.5, max: 17.5} : 
                {min: 12.0, max: 16.0};
            
            resultado += `<strong>Hemoglobina:</strong> ${hemoglobina} g/dL - `;
            if (hemoglobina < hemoglobinaRef.min) resultado += 'Baixa';
            else if (hemoglobina > hemoglobinaRef.max) resultado += 'Alta';
            else resultado += 'Normal';
            
            // Análise de Hematócrito
            const hematocritoRef = sexo === 'M' ? 
                {min: 41, max: 53} : 
                {min: 36, max: 46};
            
            resultado += `<br><strong>Hematócrito:</strong> ${hematocrito}% - `;
            if (hematocrito < hematocritoRef.min) resultado += 'Baixo';
            else if (hematocrito > hematocritoRef.max) resultado += 'Alto';
            else resultado += 'Normal';
            
            // Análise de Leucócitos
            resultado += `<br><strong>Leucócitos:</strong> ${leucocitos} mil/mm³ - `;
            if (leucocitos < 4.0) resultado += 'Baixos';
            else if (leucocitos > 11.0) resultado += 'Altos';
            else resultado += 'Normal';
            
            // Análise de Plaquetas
            resultado += `<br><strong>Plaquetas:</strong> ${plaquetas} mil/mm³ - `;
            if (plaquetas < 150) resultado += 'Baixas';
            else if (plaquetas > 450) resultado += 'Altas';
            else resultado += 'Normal';
            
            document.getElementById('cbc-resultado').innerHTML = resultado;
        }
        
        function calcularGorduraSaturada() {
            const calorias = parseFloat(document.getElementById('satfat-calorias').value);
            const percentual = parseFloat(document.getElementById('satfat-percentual').value);
            
            // Cálculo da gordura saturada
            const caloriasSaturadas = (calorias * percentual) / 100;
            const gramasSaturadas = caloriasSaturadas / 9; // 1g de gordura = 9 kcal
            
            document.getElementById('satfat-resultado').innerHTML = `
                Limite de gordura saturada:<br>
                ${gramasSaturadas.toFixed(1)} g/dia<br>
                ${caloriasSaturadas.toFixed(1)} kcal/dia<br>
                ${percentual}% das calorias totais
            `;
        }
        function calcularProteina() {
            const peso = parseFloat(document.getElementById('proteina-peso').value);
            const situacao = document.getElementById('proteina-situacao').value;
            
            let fator;
            switch(situacao) {
                case 'sedentario': fator = 0.8; break;
                case 'atividade': fator = 1.2; break;
                case 'atleta': fator = 1.8; break;
                case 'idoso': fator = 1.1; break;
                case 'doenca': fator = 1.3; break;
            }
            
            const proteina = peso * fator;
            const proteina_kcal = proteina * 4;
            
            document.getElementById('proteina-resultado').innerHTML = `
                Necessidade proteica: ${proteina.toFixed(1)} g/dia<br>
                Equivalente a: ${proteina_kcal.toFixed(1)} kcal/dia
            `;
        }
        
        function calcularHidratacao() {
            const peso = parseFloat(document.getElementById('hidratacao-peso').value);
            const clima = document.getElementById('hidratacao-clima').value;
            const atividade = document.getElementById('hidratacao-atividade').value;
            
            let fator = 35; // ml/kg base
            
            if (clima === 'quente') fator += 5;
            if (clima === 'muito-quente') fator += 10;
            
            if (atividade === 'moderado') fator += 5;
            if (atividade === 'intenso') fator += 10;
            
            const hidratacao = peso * fator;
            
            document.getElementById('hidratacao-resultado').innerHTML = `
                Necessidade hídrica: ${hidratacao.toFixed(0)} mL/dia<br>
                Equivalente a: ${(hidratacao/1000).toFixed(1)} L/dia
            `;
        }
        
        function calcularRCQ() {
            const cintura = parseFloat(document.getElementById('rcq-cintura').value);
            const quadril = parseFloat(document.getElementById('rcq-quadril').value);
            const sexo = document.getElementById('rcq-sexo').value;
            const idade = parseInt(document.getElementById('rcq-idade').value);
            
            const rcq = cintura / quadril;
            
            let risco = '';
            if (sexo === 'M') {
                if (rcq <= 0.83) risco = 'Baixo';
                else if (rcq <= 0.88) risco = 'Moderado';
                else if (rcq <= 0.94) risco = 'Alto';
                else risco = 'Muito Alto';
            } else {
                if (rcq <= 0.71) risco = 'Baixo';
                else if (rcq <= 0.77) risco = 'Moderado';
                else if (rcq <= 0.82) risco = 'Alto';
                else risco = 'Muito Alto';
            }
            
            document.getElementById('rcq-resultado').innerHTML = `
                RCQ: ${rcq.toFixed(2)}<br>
                Classificação: Risco ${risco}
            `;
        }
        
        function avaliarBioquimicos() {
            const vitD = parseFloat(document.getElementById('bio-vitd').value);
            const ferritina = parseFloat(document.getElementById('bio-ferritina').value);
            const tsh = parseFloat(document.getElementById('bio-tsh').value);
            const t4 = parseFloat(document.getElementById('bio-t4').value);
            const urico = parseFloat(document.getElementById('bio-urico').value);
            
            let resultado = '<strong>Avaliação:</strong><br>';
            
            // Vitamina D
            resultado += 'Vitamina D: ';
            if (vitD < 20) resultado += 'Deficiência';
            else if (vitD < 30) resultado += 'Insuficiência';
            else if (vitD <= 100) resultado += 'Adequado';
            else resultado += 'Elevado';
            
            // Ferritina
            resultado += '<br>Ferritina: ';
            if (ferritina < 30) resultado += 'Baixa';
            else if (ferritina <= 300) resultado += 'Normal';
            else resultado += 'Elevada';
            
            // TSH
            resultado += '<br>TSH: ';
            if (tsh < 0.4) resultado += 'Baixo';
            else if (tsh <= 4.0) resultado += 'Normal';
            else resultado += 'Elevado';
            
            // T4 livre
            resultado += '<br>T4 livre: ';
            if (t4 < 0.7) resultado += 'Baixo';
            else if (t4 <= 1.8) resultado += 'Normal';
            else resultado += 'Elevado';
            
            // Ácido Úrico
            resultado += '<br>Ácido Úrico: ';
            if (urico < 3.5) resultado += 'Baixo';
            else if (urico <= 7.2) resultado += 'Normal';
            else resultado += 'Elevado';
            
            document.getElementById('bioquimicos-resultado').innerHTML = resultado;
        }
        
        function calcularPesoIdeal() {
            const altura = parseFloat(document.getElementById('pi-altura').value);
            const sexo = document.getElementById('pi-sexo').value;
            const compleicao = document.getElementById('pi-compleicao').value;
        
            let pesoBase = 0;
            if (sexo === 'M') {
                pesoBase = (altura - 100) - ((altura - 150) / 4);
            } else {
                pesoBase = (altura - 100) - ((altura - 150) / 2.5);
            }
        
            let fatorCompleicao = 1;
            switch(compleicao) {
                case 'pequena': fatorCompleicao = 0.9; break;
                case 'media': fatorCompleicao = 1.0; break;
                case 'grande': fatorCompleicao = 1.1; break;
            }
        
            const pesoIdeal = pesoBase * fatorCompleicao;
            const faixaInferior = (pesoIdeal * 0.95).toFixed(1);
            const faixaSuperior = (pesoIdeal * 1.05).toFixed(1);
        
            document.getElementById('peso-ideal-resultado').innerHTML = `
                Faixa de Peso Ideal: ${faixaInferior} - ${faixaSuperior} kg
            `;
        }
        
        function calcularGastoAtividade() {
            const peso = parseFloat(document.getElementById('atividade-peso').value);
            const tempo = parseFloat(document.getElementById('atividade-tempo').value);
            const atividade = document.getElementById('atividade-tipo').value;
            
            const mets = {
                'jiu-leve': 6.0,
                'jiu-moderado': 9.0,
                'jiu-intenso': 12.0,
                'muay': 10.0,
                'boxe': 9.0,
                'karate': 8.0,
                'judo': 9.0,
                'musc-leve': 3.5,
                'musc-moderada': 5.0,
                'musc-intensa': 6.0,
                'corrida-leve': 7.0,
                'corrida-moderada': 9.0,
                'corrida-intensa': 12.0,
                'bike': 8.0,
                'natacao': 7.0,
                'futebol': 7.0,
                'volei': 4.0,
                'basquete': 6.5,
                'tenis': 7.0,
                'yoga': 2.5,
                'pilates': 3.0
            };
        
            // Fórmula: Kcal = MET × peso × tempo em horas
            const gasto = (mets[atividade] * peso * (tempo/60));
            
            document.getElementById('atividade-resultado').innerHTML = `
                Gasto calórico estimado: ${gasto.toFixed(0)} kcal<br>
                MET utilizado: ${mets[atividade]}
            `;
        }
        
        function calcularMacros() {
            const calorias = parseFloat(document.getElementById('macros-calorias').value);
            const tipo = document.getElementById('macros-tipo').value;
        
            let carboPct, protPct, gordPct;
            switch(tipo) {
                case 'balanced':
                    [carboPct, protPct, gordPct] = [45, 30, 25];
                    break;
                case 'lowcarb':
                    [carboPct, protPct, gordPct] = [25, 40, 35];
                    break;
                case 'keto':
                    [carboPct, protPct, gordPct] = [5, 30, 65];
                    break;
                case 'highcarb':
                    [carboPct, protPct, gordPct] = [60, 25, 15];
                    break;
            }
        
            const carboG = (calorias * carboPct/100 / 4).toFixed(1);
            const protG = (calorias * protPct/100 / 4).toFixed(1);
            const gordG = (calorias * gordPct/100 / 9).toFixed(1);
        
            document.getElementById('macros-resultado').innerHTML = `
                Carboidratos: ${carboG}g (${carboPct}%)<br>
                Proteínas: ${protG}g (${protPct}%)<br>
                Gorduras: ${gordG}g (${gordPct}%)
            `;
        }
        
        function calcularDRI() {
            const energia = parseFloat(document.getElementById('dri-energia').value);
            const proteina = parseFloat(document.getElementById('dri-proteina').value);
            const calcio = parseFloat(document.getElementById('dri-calcio').value);
            const ferro = parseFloat(document.getElementById('dri-ferro').value);
            const fibras = parseFloat(document.getElementById('dri-fibras').value);
            const sexo = document.getElementById('dri-sexo').value;
            const idade = parseInt(document.getElementById('dri-idade').value);
        
            let energiaRef, proteinaRef, calcioRef, ferroRef, fibrasRef;
        
            if (sexo === 'M') {
                energiaRef = idade < 30 ? 2900 : 2300;
                proteinaRef = 56;
                calcioRef = 1000;
                ferroRef = 8;
                fibrasRef = 38;
            } else {
                energiaRef = idade < 30 ? 2200 : 1800;
                proteinaRef = 46;
                calcioRef = 1000;
                ferroRef = 18;
                fibrasRef = 25;
            }
        
            const adequacoes = {
                energia: (energia/energiaRef * 100).toFixed(1),
                proteina: (proteina/proteinaRef * 100).toFixed(1),
                calcio: (calcio/calcioRef * 100).toFixed(1),
                ferro: (ferro/ferroRef * 100).toFixed(1),
                fibras: (fibras/fibrasRef * 100).toFixed(1)
            };
        
            document.getElementById('dri-resultado').innerHTML = `
                Adequação em relação à DRI:<br>
                Energia: ${adequacoes.energia}%<br>
                Proteína: ${adequacoes.proteina}%<br>
                Cálcio: ${adequacoes.calcio}%<br>
                Ferro: ${adequacoes.ferro}%<br>
                Fibras: ${adequacoes.fibras}%
            `;
        }

        function calcularRiscoFratura() {
    // Obter valores do formulário
    const nome = document.getElementById('fratura-nome').value;
    const idade = parseFloat(document.getElementById('fratura-idade').value);
    const dmo = parseFloat(document.getElementById('fratura-dmo').value);
    const previaFratura = document.getElementById('fratura-previa').value === 'yes' ? 1 : 0;
    const fraturaPais = document.getElementById('fratura-pais').value === 'yes' ? 1 : 0;
    const fumante = document.getElementById('fratura-fumante').value === 'yes' ? 1 : 0;
    const glicocorticoides = document.getElementById('fratura-glicocorticoides').value === 'yes' ? 1 : 0;
    const artrite = document.getElementById('fratura-artrite').value === 'yes' ? 1 : 0;
    const secundaria = document.getElementById('fratura-secundaria').value === 'yes' ? 1 : 0;
    const alcool = document.getElementById('fratura-alcool').value === 'yes' ? 1 : 0;

    // Validar entrada
    if (!nome || isNaN(idade) || isNaN(dmo)) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (idade < 40 || idade > 90) {
        alert("A idade deve estar entre 40 e 90 anos.");
        return;
    }

    // Cálculo do risco de fratura principal (simplificado baseado no modelo FRAX)
    let riscoMaior = 9.3; // Risco base para mulheres brasileiras
    
    // Ajuste pela idade (aumenta 1.4% por ano acima de 50)
    riscoMaior += (idade > 50) ? (idade - 50) * 0.4 : 0;
    
    // Ajuste pela DMO (risco aumenta conforme o T-score diminui)
    if (dmo <= -2.5) {
        riscoMaior *= 3.0; // Osteoporose estabelecida
    } else if (dmo <= -1.0) {
        riscoMaior *= 1.5; // Osteopenia
    }
    
    // Fatores de risco adicionais
    if (previaFratura) riscoMaior *= 1.85;
    if (fraturaPais) riscoMaior *= 1.5;
    if (fumante) riscoMaior *= 1.25;
    if (glicocorticoides) riscoMaior *= 1.65;
    if (artrite) riscoMaior *= 1.35;
    if (secundaria) riscoMaior *= 1.2;
    if (alcool) riscoMaior *= 1.4;
    
    // Limite superior razoável
    riscoMaior = Math.min(riscoMaior, 60);
    
    // Risco de fratura de quadril (aproximadamente 1/3 do risco principal, com maior peso para idade)
    let riscoQuadril = riscoMaior / 3;
    
    // Idade tem maior impacto em fratura de quadril
    if (idade > 65) {
        riscoQuadril *= 1 + ((idade - 65) * 0.08);
    }
    
    // Ajustes para DMO específica para quadril
    if (dmo <= -2.5) {
        riscoQuadril *= 3.3; // Maior impacto na fratura de quadril
    } else if (dmo <= -1.0) {
        riscoQuadril *= 1.7;
    }
    
    // Limite superior razoável para risco de quadril
    riscoQuadril = Math.min(riscoQuadril, 25);
    
    // Arredondar para uma casa decimal
    const riscoMaiorFinal = Math.round(riscoMaior * 10) / 10;
    const riscoQuadrilFinal = Math.round(riscoQuadril * 10) / 10;
    
    // Interpretação do risco
    let interpretacao = "";
    if (riscoMaiorFinal >= 20 || riscoQuadrilFinal >= 3) {
        interpretacao = "Risco alto: Considerar tratamento farmacológico.";
    } else if (riscoMaiorFinal >= 10 || riscoQuadrilFinal >= 1) {
        interpretacao = "Risco moderado: Considerar medidas preventivas e monitoramento.";
    } else {
        interpretacao = "Risco baixo: Medidas preventivas gerais recomendadas.";
    }

    // Exibir resultados
    const resultadoElement = document.getElementById('fratura-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultados para ${nome}:</h3>
        <p><strong>Risco de fratura principal (10 anos):</strong> ${riscoMaiorFinal}%</p>
        <p><strong>Risco de fratura de quadril (10 anos):</strong> ${riscoQuadrilFinal}%</p>
        <p><strong>Interpretação:</strong> ${interpretacao}</p>
        <p><strong>Fatores de risco:</strong> ${listarFatoresRisco(previaFratura, fraturaPais, fumante, glicocorticoides, artrite, secundaria, alcool)}</p>
        <p><strong>DMO:</strong> ${interpretarDMO(dmo)}</p>
    `;
}

function listarFatoresRisco(previa, pais, fumante, glico, artrite, secund, alcool) {
    const fatores = [];
    if (previa) fatores.push("Fratura prévia");
    if (pais) fatores.push("Histórico familiar de fratura");
    if (fumante) fatores.push("Tabagismo");
    if (glico) fatores.push("Uso de glicocorticoides");
    if (artrite) fatores.push("Artrite reumatoide");
    if (secund) fatores.push("Osteoporose secundária");
    if (alcool) fatores.push("Consumo excessivo de álcool");
    
    return fatores.length > 0 ? fatores.join(", ") : "Nenhum fator de risco adicional";
}

function interpretarDMO(dmo) {
    if (dmo <= -2.5) {
        return `T-score ${dmo} (Osteoporose)`;
    } else if (dmo <= -1.0) {
        return `T-score ${dmo} (Osteopenia)`;
    } else {
        return `T-score ${dmo} (Normal)`;
    };

}

// Função para calculadora de TVP Wells
function calcularTVPWells() {
    const nome = document.getElementById('tvp-nome').value;
    if (!nome) {
        alert("Por favor, preencha o nome do paciente.");
        return;
    }
    
    // Coletar pontuações
    const cancer = parseInt(document.getElementById('tvp-cancer').value);
    const paralisia = parseInt(document.getElementById('tvp-paralisia').value);
    const repouso = parseInt(document.getElementById('tvp-repouso').value);
    const sensibilidade = parseInt(document.getElementById('tvp-sensibilidade').value);
    const edemaPerna = parseInt(document.getElementById('tvp-edema-perna').value);
    const inchaço = parseInt(document.getElementById('tvp-inchaço').value);
    const edema = parseInt(document.getElementById('tvp-edema-cacifo').value);
    const veias = parseInt(document.getElementById('tvp-veias').value);
    const diagnostico = parseInt(document.getElementById('tvp-diagnostico').value);
    const historia = parseInt(document.getElementById('tvp-historia').value);
    
    // Calcular pontuação total
    const pontuacao = cancer + paralisia + repouso + sensibilidade + edemaPerna + 
                     inchaço + edema + veias + diagnostico + historia;
    
    // Determinar probabilidade
    let probabilidade = "";
    let recomendacao = "";
    
    if (pontuacao >= 3) {
        probabilidade = "Alta (probabilidade de TVP: ~75%)";
        recomendacao = "Realizar ultrassonografia e considerar anticoagulação enquanto aguarda resultado.";
    } else if (pontuacao === 1 || pontuacao === 2) {
        probabilidade = "Moderada (probabilidade de TVP: ~17%)";
        recomendacao = "Realizar ultrassonografia e considerar teste D-dímero.";
    } else {
        probabilidade = "Baixa (probabilidade de TVP: ~3%)";
        recomendacao = "Considerar teste D-dímero para excluir TVP.";
    }
    
    // Mostrar resultado
    const resultadoElement = document.getElementById('tvp-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultado para ${nome}:</h3>
        <p><strong>Pontuação de Wells para TVP:</strong> ${pontuacao} pontos</p>
        <p><strong>Probabilidade Clínica:</strong> ${probabilidade}</p>
        <p><strong>Recomendação:</strong> ${recomendacao}</p>
    `;
}

// Função para calculadora de EP Wells
function calcularEPWells() {
    const nome = document.getElementById('ep-nome').value;
    if (!nome) {
        alert("Por favor, preencha o nome do paciente.");
        return;
    }
    
    // Coletar pontuações
    const tvp = parseFloat(document.getElementById('ep-tvp').value);
    const diagnostico = parseFloat(document.getElementById('ep-diagnostico').value);
    const taquicardia = parseFloat(document.getElementById('ep-taquicardia').value);
    const imobilizacao = parseFloat(document.getElementById('ep-imobilizacao').value);
    const historia = parseFloat(document.getElementById('ep-historia').value);
    const hemoptise = parseFloat(document.getElementById('ep-hemoptise').value);
    const malignidade = parseFloat(document.getElementById('ep-malignidade').value);
    
    // Calcular pontuação total
    const pontuacao = tvp + diagnostico + taquicardia + imobilizacao + historia + hemoptise + malignidade;
    
    // Determinar probabilidade
    let probabilidade = "";
    let recomendacao = "";
    
    if (pontuacao > 6) {
        probabilidade = "Alta (probabilidade de EP: >40%)";
        recomendacao = "Considerar anticoagulação empírica durante investigação; realizar angiotomografia ou cintilografia pulmonar.";
    } else if (pontuacao >= 2 && pontuacao <= 6) {
        probabilidade = "Moderada (probabilidade de EP: ~28%)";
        recomendacao = "Realizar teste D-dímero; se positivo, prosseguir com angiotomografia ou cintilografia.";
    } else {
        probabilidade = "Baixa (probabilidade de EP: ~2%)";
        recomendacao = "Considerar teste D-dímero para excluir EP antes de outros exames de imagem.";
    }
    
    // Mostrar resultado
    const resultadoElement = document.getElementById('ep-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultado para ${nome}:</h3>
        <p><strong>Pontuação de Wells para EP:</strong> ${pontuacao.toFixed(1)} pontos</p>
        <p><strong>Probabilidade Clínica:</strong> ${probabilidade}</p>
        <p><strong>Recomendação:</strong> ${recomendacao}</p>
    `;
}

// Função para calculadora PERC
function calcularPERC() {
    const nome = document.getElementById('perc-nome').value;
    if (!nome) {
        alert("Por favor, preencha o nome do paciente.");
        return;
    }
    
    // Coletar critérios
    const idade = parseInt(document.getElementById('perc-idade').value);
    const fc = parseInt(document.getElementById('perc-fc').value);
    const saturacao = parseInt(document.getElementById('perc-saturacao').value);
    const edema = parseInt(document.getElementById('perc-edema').value);
    const hemoptise = parseInt(document.getElementById('perc-hemoptise').value);
    const cirurgia = parseInt(document.getElementById('perc-cirurgia').value);
    const historia = parseInt(document.getElementById('perc-historia').value);
    const hormonios = parseInt(document.getElementById('perc-hormonios').value);
    
    // Calcular total de critérios positivos
    const criteriosPositivos = idade + fc + saturacao + edema + hemoptise + cirurgia + historia + hormonios;
    
    // Determinar resultado
    let resultado = "";
    let recomendacao = "";
    
    if (criteriosPositivos === 0) {
        resultado = "Todos os critérios PERC negativos";
        recomendacao = "EP pode ser excluída com segurança (risco <2%) sem testes adicionais em pacientes com baixa probabilidade pré-teste.";
    } else {
        resultado = `${criteriosPositivos} critério(s) PERC positivo(s)`;
        recomendacao = "PERC positivo: não pode excluir EP; prosseguir com avaliação adicional (D-dímero e/ou exames de imagem).";
    }
    
    // Identificar critérios positivos
    const criteriosPositivosList = [];
    if (idade === 1) criteriosPositivosList.push("Idade ≥50 anos");
    if (fc === 1) criteriosPositivosList.push("FC ≥100 bpm");
    if (saturacao === 1) criteriosPositivosList.push("Saturação O₂ <95%");
    if (edema === 1) criteriosPositivosList.push("Edema unilateral");
    if (hemoptise === 1) criteriosPositivosList.push("Hemoptise");
    if (cirurgia === 1) criteriosPositivosList.push("Cirurgia/trauma recente");
    if (historia === 1) criteriosPositivosList.push("História prévia de TVP/EP");
    if (hormonios === 1) criteriosPositivosList.push("Uso de hormônios");
    
    // Mostrar resultado
    const resultadoElement = document.getElementById('perc-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultado para ${nome}:</h3>
        <p><strong>Regra PERC:</strong> ${resultado}</p>
        <p><strong>Recomendação:</strong> ${recomendacao}</p>
        ${criteriosPositivosList.length > 0 ? 
          `<p><strong>Critérios Positivos:</strong> ${criteriosPositivosList.join(", ")}</p>` : 
          "<p><strong>Critérios Positivos:</strong> Nenhum</p>"}
    `;
}

// Função para calculadora PESI
function calcularPESI() {
    const nome = document.getElementById('pesi-nome').value;
    const idade = parseInt(document.getElementById('pesi-idade').value);
    
    if (!nome || isNaN(idade)) {
        alert("Por favor, preencha o nome e a idade do paciente.");
        return;
    }
    
    // Coletar fatores
    const sexo = document.getElementById('pesi-sexo').value;
    const cancer = parseInt(document.getElementById('pesi-cancer').value);
    const icc = parseInt(document.getElementById('pesi-icc').value);
    const dpoc = parseInt(document.getElementById('pesi-dpoc').value);
    const fc110 = parseInt(document.getElementById('pesi-fc110').value);
    const pas = parseInt(document.getElementById('pesi-pas').value);
    const fr = parseInt(document.getElementById('pesi-fr').value);
    const temp = parseInt(document.getElementById('pesi-temp').value);
    const mental = parseInt(document.getElementById('pesi-mental').value);
    const saturacao = parseInt(document.getElementById('pesi-saturacao').value);
    
    // Calcular pontuação
    let pontuacao = idade; // Pontuação inicial é a idade em anos
    
    // Pontos adicionais para cada fator de risco
    if (sexo === "M") pontuacao += 10; // 10 pontos para sexo masculino
    if (cancer === 1) pontuacao += 30;
    if (icc === 1) pontuacao += 10;
    if (dpoc === 1) pontuacao += 10;
    if (fc110 === 1) pontuacao += 20;
    if (pas === 1) pontuacao += 30;
    if (fr === 1) pontuacao += 20;
    if (temp === 1) pontuacao += 20;
    if (mental === 1) pontuacao += 60;
    if (saturacao === 1) pontuacao += 20;
    
    // Determinar classe de risco
    let classe = "";
    let mortalidade = "";
    let recomendacao = "";
    
    if (pontuacao <= 65) {
        classe = "Classe I (Muito Baixo Risco)";
        mortalidade = "0-1.6%";
        recomendacao = "Considerar tratamento ambulatorial ou alta precoce.";
    } else if (pontuacao >= 66 && pontuacao <= 85) {
        classe = "Classe II (Baixo Risco)";
        mortalidade = "1.7-3.5%";
        recomendacao = "Considerar tratamento ambulatorial ou alta precoce.";
    } else if (pontuacao >= 86 && pontuacao <= 105) {
        classe = "Classe III (Risco Moderado)";
        mortalidade = "3.2-7.1%";
        recomendacao = "Considerar hospitalização para monitoramento.";
    } else if (pontuacao >= 106 && pontuacao <= 125) {
        classe = "Classe IV (Alto Risco)";
        mortalidade = "4.0-11.4%";
        recomendacao = "Hospitalização para tratamento e monitoramento intensivo.";
    } else {
        classe = "Classe V (Risco Muito Alto)";
        mortalidade = "10.0-24.5%";
        recomendacao = "Considerar unidade de terapia intensiva e monitoramento rigoroso.";
    }
    
    // Mostrar resultado
    const resultadoElement = document.getElementById('pesi-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultado para ${nome}:</h3>
        <p><strong>Pontuação PESI:</strong> ${pontuacao} pontos</p>
        <p><strong>Classificação:</strong> ${classe}</p>
        <p><strong>Mortalidade em 30 dias:</strong> ${mortalidade}</p>
        <p><strong>Recomendação:</strong> ${recomendacao}</p>
    `;
    
}
// Função para calculadora de LDL 
function calcularLDL() {
    const nome = document.getElementById('ldl-nome').value;
    const colesterolTotal = parseFloat(document.getElementById('ldl-colesterol-total').value);
    const hdl = parseFloat(document.getElementById('ldl-hdl').value);
    const triglicerideos = parseFloat(document.getElementById('ldl-triglicerideos').value);
    
    if (!nome || isNaN(colesterolTotal) || isNaN(hdl) || isNaN(triglicerideos)) {
        alert("Por favor, preencha todos os campos com valores numéricos válidos.");
        return;
    }
    
    // Verificar se triglicerídeos estão muito altos para a fórmula de Friedewald
    const friedewaldValida = triglicerideos < 400;
    
    // Calcular LDL pela equação de Friedewald (CT - HDL - TG/5)
    let ldlFriedewald = "";
    if (friedewaldValida) {
        ldlFriedewald = colesterolTotal - hdl - (triglicerideos / 5);
        ldlFriedewald = ldlFriedewald.toFixed(1);
    } else {
        ldlFriedewald = "Não aplicável (TG ≥ 400 mg/dL)";
    }
    
    // Calcular LDL pela equação do estudo citado (CT - HDL - TG/x)
    // Assumindo que a equação do estudo usa um fator diferente (exemplo: 6)
    // Ajuste este valor conforme necessário para a equação específica
    const fatorEstudo = 6; 
    const ldlEstudo = colesterolTotal - hdl - (triglicerideos / fatorEstudo);
    
    // Calcular razão TG/HDL para estimar tamanho da partícula de LDL
    const razaoTGHDL = triglicerideos / hdl;
    
    // Interpretação do tamanho da partícula de LDL baseada na razão TG/HDL
    let tamanhoLDL = "";
    let riscoLDL = "";
    
    if (razaoTGHDL < 2.0) {
        tamanhoLDL = "Predominância de partículas grandes";
        riscoLDL = "Menor risco cardiovascular";
    } else if (razaoTGHDL >= 2.0 && razaoTGHDL <= 3.8) {
        tamanhoLDL = "Tamanho intermediário";
        riscoLDL = "Risco cardiovascular moderado";
    } else {
        tamanhoLDL = "Predominância de partículas pequenas e densas";
        riscoLDL = "Maior risco cardiovascular";
    }
    
    // Mostrar resultado
    const resultadoElement = document.getElementById('ldl-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultado para ${nome}:</h3>
        <p><strong>LDL calculada (Friedewald):</strong> ${ldlFriedewald} mg/dL ${!friedewaldValida ? " - Fórmula não recomendada quando TG ≥ 400 mg/dL" : ""}</p>
        <p><strong>LDL calculada (Equação do estudo):</strong> ${ldlEstudo.toFixed(1)} mg/dL</p>
        <p><strong>Razão TG/HDL:</strong> ${razaoTGHDL.toFixed(2)}</p>
        <p><strong>Estimativa do tamanho da partícula de LDL:</strong> ${tamanhoLDL}</p>
        <p><strong>Implicação clínica:</strong> ${riscoLDL}</p>
        
        <div class="additional-info">
            <h4>Interpretação:</h4>
            <ul>
                <li><strong>LDL < 100 mg/dL:</strong> Ótimo</li>
                <li><strong>LDL 100-129 mg/dL:</strong> Desejável</li>
                <li><strong>LDL 130-159 mg/dL:</strong> Limítrofe alto</li>
                <li><strong>LDL 160-189 mg/dL:</strong> Alto</li>
                <li><strong>LDL ≥ 190 mg/dL:</strong> Muito alto</li>
            </ul>
            <p><strong>Nota:</strong> A razão TG/HDL é um marcador substituto para estimar o tamanho da partícula de LDL. Uma razão TG/HDL > 3.8 sugere predominância de partículas de LDL pequenas e densas, que são mais aterogênicas.</p>
        </div>
    `;
}
// Função para calculadora de diagnóstico tireoidiano
function calcularDiagnosticoTireoidiano() {
    const nome = document.getElementById('tireoide-nome').value;
    const tsh = parseFloat(document.getElementById('tireoide-tsh').value);
    const t4l = parseFloat(document.getElementById('tireoide-t4l').value);
    const t3l = parseFloat(document.getElementById('tireoide-t3l').value) || null; // Opcional
    const antiTpo = parseFloat(document.getElementById('tireoide-anti-tpo').value) || null; // Opcional
    const antiTg = parseFloat(document.getElementById('tireoide-anti-tg').value) || null; // Opcional
    const trAb = document.getElementById('tireoide-trab').value;
    
    if (!nome || isNaN(tsh) || isNaN(t4l)) {
        alert("Por favor, preencha pelo menos o nome do paciente, TSH e T4 livre.");
        return;
    }
    
    // Valores de referência (ajuste conforme o laboratório)
    const tshRefMin = 0.4;
    const tshRefMax = 4.5;
    const t4lRefMin = 0.8;
    const t4lRefMax = 1.8;
    const t3lRefMin = 2.3;
    const t3lRefMax = 4.2;
    const antiTpoRef = 35; // Valor máximo de referência
    const antiTgRef = 40; // Valor máximo de referência
    
    // Diagnóstico baseado em TSH e T4L
    let diagnostico = "";
    let recomendacoes = "";
    
    if (tsh < tshRefMin && t4l > t4lRefMax) {
        diagnostico = "Hipertireoidismo primário";
        recomendacoes = "Considerar tratamento com drogas antitireoidianas, iodo radioativo ou cirurgia. Encaminhar para endocrinologista.";
    } else if (tsh < tshRefMin && t4l >= t4lRefMin && t4l <= t4lRefMax) {
        diagnostico = "Hipertireoidismo subclínico";
        recomendacoes = "Monitorar periodicamente. Considerar tratamento em idosos, pacientes com doença cardíaca, osteoporose ou sintomas de hipertireoidismo.";
    } else if (tsh < tshRefMin && t4l < t4lRefMin) {
        diagnostico = "Hipotireoidismo central (hipofisário) ou síndrome do eutireoidiano doente";
        recomendacoes = "Investigar função hipofisária e/ou condições graves concomitantes. Encaminhar para endocrinologista.";
    } else if (tsh >= tshRefMin && tsh <= tshRefMax && t4l >= t4lRefMin && t4l <= t4lRefMax) {
        diagnostico = "Eutireoidismo (função tireoidiana normal)";
        recomendacoes = "Nenhuma intervenção necessária para função tireoidiana.";
    } else if (tsh > tshRefMax && t4l >= t4lRefMin && t4l <= t4lRefMax) {
        diagnostico = "Hipotireoidismo subclínico";
        recomendacoes = "Monitorar periodicamente. Considerar tratamento se TSH > 10 mUI/L, anticorpos positivos, sintomas de hipotireoidismo, gestantes ou mulheres tentando engravidar.";
    } else if (tsh > tshRefMax && t4l < t4lRefMin) {
        diagnostico = "Hipotireoidismo primário";
        recomendacoes = "Iniciar reposição de levotiroxina. Ajustar dose conforme níveis de TSH.";
    } else if (tsh > tshRefMax && t4l > t4lRefMax) {
        diagnostico = "Resistência aos hormônios tireoidianos ou problema laboratorial";
        recomendacoes = "Considerar repetir exames. Avaliar necessidade de encaminhamento para endocrinologista.";
    }
    
    // Avaliação de anticorpos
    let statusAutoimune = "";
    if (antiTpo !== null && antiTpo > antiTpoRef) {
        statusAutoimune += "Anticorpos anti-TPO elevados, sugerindo tireoidite autoimune (Hashimoto). ";
    }
    
    if (antiTg !== null && antiTg > antiTgRef) {
        statusAutoimune += "Anticorpos anti-Tg elevados, reforçando a suspeita de tireoidite autoimune. ";
    }
    
    if (trAb === "positivo") {
        statusAutoimune += "Anticorpos anti-receptor de TSH (TRAb) positivos, sugerindo doença de Graves. ";
    }
    
    if (statusAutoimune === "" && (antiTpo !== null || antiTg !== null || trAb !== "nao_realizado")) {
        statusAutoimune = "Anticorpos tireoidianos dentro dos valores de referência.";
    }
    
    // Avaliação do T3L, se disponível
    let statusT3L = "";
    if (t3l !== null) {
        if (t3l < t3lRefMin) {
            statusT3L = "T3 livre baixo. ";
            if (diagnostico.includes("Hipotireoidismo")) {
                statusT3L += "Consistente com hipotireoidismo.";
            } else {
                statusT3L += "Considerar síndrome do T3 baixo (eutireoidiano doente) ou hipotireoidismo.";
            }
        } else if (t3l > t3lRefMax) {
            statusT3L = "T3 livre elevado. ";
            if (diagnostico.includes("Hipertireoidismo")) {
                statusT3L += "Consistente com hipertireoidismo.";
            } else if (tsh < tshRefMin && t4l >= t4lRefMin && t4l <= t4lRefMax) {
                statusT3L += "Possível T3-tireotoxicose.";
                diagnostico = "T3-tireotoxicose (hipertireoidismo por T3)";
                recomendacoes = "Encaminhar para endocrinologista para avaliação e tratamento.";
            } else {
                statusT3L += "Avaliar clinicamente.";
            }
        } else {
            statusT3L = "T3 livre dentro dos valores de referência.";
        }
    }
    
    // Mostrar resultado
    const resultadoElement = document.getElementById('tireoide-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultado para ${nome}:</h3>
        <p><strong>Diagnóstico provável:</strong> ${diagnostico}</p>
        <p><strong>TSH:</strong> ${tsh} mUI/L (Ref: ${tshRefMin}-${tshRefMax})</p>
        <p><strong>T4 livre:</strong> ${t4l} ng/dL (Ref: ${t4lRefMin}-${t4lRefMax})</p>
        ${t3l !== null ? `<p><strong>T3 livre:</strong> ${t3l} pg/mL (Ref: ${t3lRefMin}-${t3lRefMax})</p>` : ''}
        ${antiTpo !== null ? `<p><strong>Anti-TPO:</strong> ${antiTpo} UI/mL (Ref: < ${antiTpoRef})</p>` : ''}
        ${antiTg !== null ? `<p><strong>Anti-Tg:</strong> ${antiTg} UI/mL (Ref: < ${antiTgRef})</p>` : ''}
        ${trAb !== "nao_realizado" ? `<p><strong>TRAb:</strong> ${trAb}</p>` : ''}
        
        ${statusAutoimune ? `<p><strong>Avaliação autoimune:</strong> ${statusAutoimune}</p>` : ''}
        ${statusT3L ? `<p><strong>Avaliação de T3 livre:</strong> ${statusT3L}</p>` : ''}
        
        <p><strong>Recomendações:</strong> ${recomendacoes}</p>
        
        <div class="additional-info">
            <h4>Notas importantes:</h4>
            <ul>
                <li>Os valores de referência podem variar dependendo do laboratório e da metodologia utilizada.</li>
                <li>A interpretação deve sempre considerar o contexto clínico do paciente.</li>
                <li>Medicações, condições médicas e fatores como gravidez podem afetar os resultados.</li>
                <li>Em caso de discordância entre resultados laboratoriais e clínica, considerar repetir os exames.</li>
            </ul>
        </div>
    `;
}
// Função para calculadora de risco de ASCVD (Doença Cardiovascular Aterosclerótica)
function calcularRiscoASCVD() {
    // Obter dados do formulário
    const nome = document.getElementById('ascvd-nome').value;
    const idade = parseInt(document.getElementById('ascvd-idade').value);
    const sexo = document.getElementById('ascvd-sexo').value;
    const raca = document.getElementById('ascvd-raca').value;
    const colesterolTotal = parseFloat(document.getElementById('ascvd-colesterol-total').value);
    const hdl = parseFloat(document.getElementById('ascvd-hdl').value);
    const pasSistolica = parseFloat(document.getElementById('ascvd-pas').value);
    const hipertensaoTratada = document.getElementById('ascvd-hipertensao').value === "1";
    const diabetes = document.getElementById('ascvd-diabetes').value === "1";
    const fumante = document.getElementById('ascvd-fumante').value === "1";
    
    // Validar entradas
    if (!nome || isNaN(idade) || !sexo || !raca || isNaN(colesterolTotal) || 
        isNaN(hdl) || isNaN(pasSistolica)) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    
    // Verificar limites de idade para o cálculo (40-79 anos)
    if (idade < 40 || idade > 79) {
        alert("Cálculo de ASCVD é validado apenas para idades entre 40 e 79 anos.");
        // Ainda calcularemos, mas com aviso
    }
    
    // Código para calcular o risco ASCVD
    // Usando as equações do ACC/AHA de 2013, atualizadas em 2018
    let s0, lnAge, lnTotalChol, lnHDL, lnAge_lnTotalChol, lnAge_Squared, lnHDL_lnAge;
    let risco10Anos = 0;
    
    if (sexo === "F") { // Mulheres
        // Coeficientes para mulheres
        if (raca === "AA") { // Afro-americanas
            // ln(idade) * ln(Colesterol Total)
            lnAge_lnTotalChol = Math.log(idade) * Math.log(colesterolTotal);
            
            // ln(idade) * ln(HDL)
            lnHDL_lnAge = Math.log(hdl) * Math.log(idade);
            
            // ln(idade)^2
            lnAge_Squared = Math.pow(Math.log(idade), 2);
            
            // Cálculo do risco para mulheres afro-americanas
            s0 = 0.95334;
            const sum = 
                17.1141 * Math.log(idade) +
                0.9396 * Math.log(colesterolTotal) +
                -18.9196 * Math.log(hdl) +
                4.4748 * lnAge_lnTotalChol +
                -4.4748 * lnHDL_lnAge +
                29.2907 * lnAge_Squared +
                0.6908 * Number(hipertensaoTratada) +
                0.8738 * Number(diabetes) +
                0.6646 * Number(fumante);
            
            risco10Anos = 1 - Math.pow(s0, Math.exp(sum - 86.6081));
        }
        else { // Mulheres brancas e outras etnias
            // Cálculo do risco para mulheres brancas e outras etnias
            s0 = 0.9665;
            const sum = 
                -29.799 * Math.log(idade) +
                4.884 * Math.pow(Math.log(idade), 2) +
                13.540 * Math.log(colesterolTotal) +
                -3.114 * Math.log(idade) * Math.log(colesterolTotal) +
                -13.578 * Math.log(hdl) +
                3.149 * Math.log(idade) * Math.log(hdl) +
                2.019 * Number(hipertensaoTratada) +
                0.940 * Number(diabetes) +
                1.957 * Number(fumante);
            
            risco10Anos = 1 - Math.pow(s0, Math.exp(sum - (-29.18)));
        }
    }
    else { // Homens
        // Coeficientes para homens
        if (raca === "AA") { // Afro-americanos
            // Cálculo do risco para homens afro-americanos
            s0 = 0.89536;
            const sum = 
                2.469 * Math.log(idade) +
                0.302 * Math.log(colesterolTotal) +
                -0.307 * Math.log(hdl) +
                1.916 * Number(hipertensaoTratada) +
                0.758 * Number(diabetes) +
                0.549 * Number(fumante);
            
            risco10Anos = 1 - Math.pow(s0, Math.exp(sum - 19.5425));
        }
        else { // Homens brancos e outras etnias
            // Cálculo do risco para homens brancos e outras etnias
            s0 = 0.9144;
            const sum = 
                12.344 * Math.log(idade) +
                11.853 * Math.log(colesterolTotal) +
                -2.664 * Math.log(idade) * Math.log(colesterolTotal) +
                -7.990 * Math.log(hdl) +
                1.769 * Math.log(idade) * Math.log(hdl) +
                1.797 * Number(hipertensaoTratada) +
                0.658 * Number(diabetes) +
                0.674 * Number(fumante);
            
            risco10Anos = 1 - Math.pow(s0, Math.exp(sum - 61.18));
        }
    }
    
    // Converter para porcentagem
    const riscoPorcentagem = risco10Anos * 100;
    
    // Fatores de risco adicionais (não incluídos no cálculo original)
    const fatoresAdicionais = [];
    
    // Histórico familiar (opcional)
    const historicoFamiliar = document.getElementById('ascvd-historico-familiar').value === "1";
    if (historicoFamiliar) {
        fatoresAdicionais.push("História familiar de DCV prematura");
    }
    
    // PCR elevada (opcional)
    const pcrElevada = document.getElementById('ascvd-pcr').value === "1";
    if (pcrElevada) {
        fatoresAdicionais.push("PCR-us elevada (≥2 mg/L)");
    }
    
    // Calcificação coronária (opcional)
    const calcificacaoCoronaria = document.getElementById('ascvd-calcificacao').value;
    if (calcificacaoCoronaria && calcificacaoCoronaria !== "nao_realizado") {
        fatoresAdicionais.push(`Escore de cálcio coronário: ${calcificacaoCoronaria}`);
    }
    
    // Determinar categoria de risco
    let categoriaRisco = "";
    let recomendacoes = "";
    
    if (riscoPorcentagem < 5) {
        categoriaRisco = "Baixo risco";
        recomendacoes = "Foco em estilo de vida saudável. Reavaliação do risco em 4-6 anos.";
    } else if (riscoPorcentagem >= 5 && riscoPorcentagem < 7.5) {
        categoriaRisco = "Risco limítrofe";
        recomendacoes = "Considerar fatores de risco adicionais. Discussão sobre estatinas pode ser apropriada. Reavaliação anual.";
    } else if (riscoPorcentagem >= 7.5 && riscoPorcentagem < 20) {
        categoriaRisco = "Risco intermediário";
        recomendacoes = "Discussão sobre benefício de estatinas recomendada. Considerar escore de cálcio coronário para refinar o risco.";
    } else {
        categoriaRisco = "Alto risco";
        recomendacoes = "Terapia com estatinas de alta intensidade geralmente recomendada. Controle rigoroso de todos os fatores de risco.";
    }
    
    // Ajustes com base em fatores adicionais
    if (fatoresAdicionais.length > 0) {
        recomendacoes += " Os fatores de risco adicionais podem aumentar o risco estimado.";
    }
    
    if (calcificacaoCoronaria === "0") {
        recomendacoes += " Escore de cálcio zero indica menor risco do que calculado.";
    } else if (calcificacaoCoronaria === ">300") {
        recomendacoes += " Escore de cálcio elevado indica maior risco do que calculado.";
    }
    
    // Mostrar resultado
    const resultadoElement = document.getElementById('ascvd-resultado');
    resultadoElement.innerHTML = `
        <h3>Resultado para ${nome}:</h3>
        <p><strong>Risco de evento cardiovascular em 10 anos:</strong> ${riscoPorcentagem.toFixed(1)}%</p>
        <p><strong>Categoria de risco:</strong> ${categoriaRisco}</p>
        
        ${fatoresAdicionais.length > 0 ? 
            `<p><strong>Fatores de risco adicionais:</strong> ${fatoresAdicionais.join(", ")}</p>` : ''}
        
        <p><strong>Recomendações:</strong> ${recomendacoes}</p>
        
        <div class="additional-info">
            <h4>Categorias de risco ASCVD em 10 anos:</h4>
            <ul>
                <li><strong>Baixo risco:</strong> < 5%</li>
                <li><strong>Risco limítrofe:</strong> 5% a < 7.5%</li>
                <li><strong>Risco intermediário:</strong> 7.5% a < 20%</li>
                <li><strong>Alto risco:</strong> ≥ 20%</li>
            </ul>
            <p><strong>Nota:</strong> Este cálculo é baseado nas diretrizes do ACC/AHA. Fatores adicionais podem modificar a estimativa de risco e o julgamento clínico deve sempre prevalecer.</p>
            ${idade < 40 || idade > 79 ? 
                '<p><strong>Atenção:</strong> Esta calculadora foi validada para idades entre 40 e 79 anos. Os resultados fora desta faixa devem ser interpretados com cautela.</p>' : ''}
        </div>
    `;
}
        
    
        window.onclick = function(event) {
            const modal = document.getElementById('calculator-modal');
            if(event.target == modal) {
                closeModal();
            }
        }
        
    