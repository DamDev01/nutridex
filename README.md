# NutriDex

Sistema de gestão para nutricionistas construído com Next.js 15, React 19, Tailwind CSS e Supabase. Reúne pacientes, agenda, prontuário clínico, antropometria, medidas, exames, fotografias, plano alimentar, alimentos, financeiro e relatórios.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Projeto Supabase ativo
- Git

## Configuração local

```bash
git clone https://github.com/DamDev01/nutri-dex.git
cd nutri-dex
npm install
```

Crie `.env.local` com base em `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Nunca envie `.env.local` ao Git. A chave `service_role` só pode existir no servidor, pois ignora as políticas RLS.

Inicie o projeto:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Supabase

1. Crie ou selecione um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Execute `supabase/rls.sql` para habilitar as políticas de segurança.
4. Configure as três variáveis de ambiente.
5. Ao enviar a primeira fotografia, o backend cria automaticamente o bucket público `patient-photos`.

O schema contém pacientes, consultas, notas clínicas, exames, antropometria, medidas, pagamentos, alimentos, fotografias, planos alimentares e itens de plano. As relações clínicas devem sempre usar `patient_id`.

### Storage

As fotografias aceitam JPG, PNG ou WEBP de até 10 MB. O arquivo fica no bucket `patient-photos`; os metadados e o vínculo com o paciente ficam na tabela `photos`. Ao excluir o registro, o backend também remove o objeto do Storage.

### RLS e segurança atual

As tabelas clínicas principais possuem RLS e políticas por `owner_id`. No estado atual, as rotas do servidor usam `SUPABASE_SERVICE_ROLE_KEY`, portanto o backend ignora RLS. Antes de disponibilizar o sistema para múltiplas contas, implemente autenticação Supabase, obtenha a sessão no servidor e faça as consultas com o token do usuário. Não exponha a chave de serviço no navegador.

## Scripts

```bash
npm run dev              # servidor de desenvolvimento
npm run build            # build de produção
npm run start            # servidor do build
npm run test:api         # smoke test CRUD contra a API
npm run test:e2e         # fluxos E2E no Chromium
npm run test:e2e:visual  # screenshots desktop e mobile
```

Na primeira execução dos testes E2E, instale o navegador:

```bash
npx playwright install chromium
```

Os testes E2E criam dados temporários com prefixo próprio e os excluem no final. Eles cobrem cadastro de paciente, criação do plano e item alimentar, upload de fotografia, relatório e geração de PDFs A4. Artefatos de falha ficam em `test-results/` e o relatório HTML em `playwright-report/`.

Para testar uma URL já em execução:

```powershell
$env:PLAYWRIGHT_BASE_URL="http://localhost:3000"
npm run test:e2e
```

## PDFs

Plano alimentar e relatórios possuem um documento de impressão dedicado com:

- cabeçalho e data de emissão;
- dados do paciente e período;
- totais e tabelas formatadas;
- observações editáveis;
- espaço para assinatura e carimbo;
- layout A4 independente da sidebar e da interface.

Use o botão `PDF` ou `Gerar PDF` e selecione **Salvar como PDF** na janela de impressão. Os testes E2E também validam o documento gerando PDFs diretamente pelo Chromium.

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Cadastre as três variáveis de `.env.local` em Project Settings > Environment Variables.
3. Use `npm run build` como build command.
4. Faça o deploy e valide `/api/patients`, `/fotografias` e `/relatorios`.
5. Mantenha o projeto Supabase ativo para evitar pausa por inatividade no plano gratuito.

Não coloque segredos em `NEXT_PUBLIC_*`, com exceção da chave pública `anon`.

## Como continuar o desenvolvimento

1. Atualize a branch: `git pull origin main`.
2. Crie uma branch: `git checkout -b feature/nome-da-tarefa`.
3. Configure seu próprio `.env.local` com acesso autorizado ao mesmo Supabase.
4. Rode `npm install`, `npm run build`, `npm run test:api` e `npm run test:e2e`.
5. Abra um pull request descrevendo alterações de schema, variáveis novas e testes executados.

Ao alterar o banco, atualize `supabase/schema.sql` e `supabase/rls.sql` no mesmo commit. Não edite dados de produção manualmente sem registrar a migração.

## Estrutura principal

- `app/`: páginas, componentes, APIs e integração Supabase
- `app/api/`: endpoints CRUD do servidor
- `app/components/`: componentes de interface e documentos de impressão
- `app/lib/`: acesso a dados, validação e Storage
- `supabase/`: schema e políticas RLS
- `scripts/`: testes de API
- `tests/e2e/`: testes Playwright

## Pendência estrutural

A principal pendência antes do uso comercial multiusuário é autenticação completa com Supabase Auth e isolamento real por conta. Depois disso, devem ser adicionados recuperação de senha, convite de membros e testes E2E do login.
## Biblioteca TACO

A biblioteca já inclui 597 alimentos da TACO / NEPA-UNICAMP, além dos cadastros privados. A busca do plano permite calcular por gramas ou pelas porções declaradas no cadastro, com validação no servidor. Consulte [fonte e reprodução dos dados](data/TACO.md) e [estado atual do projeto](docs/PROJECT_STATE.md).

Validação: `npm run test:foods` e `npm run test:billing`.
