# Checklist de produção e LGPD

> Consulte [o estado atual do projeto](docs/PROJECT_STATE.md) antes de interpretar esta lista histórica como pendências. Autenticação, isolamento, fotografias, documentos e cobrança têm implementações e validações posteriores registradas.

## Banco e disponibilidade

- Aplicar `supabase/schema.sql` e depois `supabase/rls.sql` em homologação.
- Validar DNS, HTTPS e saúde do Supabase antes do deploy.
- Configurar alertas para erros estruturados com `scope: supabase`.
- Monitorar `GET /api/health` externamente; o comando `npm run health` também pode ser usado por cron.
- Definir rotina de backup e testar restauração.

## Privacidade e LGPD

- Registrar consentimento antes de armazenar anamnese ou fotografia.
- Informar finalidade, prazo de retenção e canal para solicitações do titular.
- Usar bucket privado e URLs assinadas para fotografias antes do uso comercial.
- Revisar periodicamente o prazo de retenção salvo em Configurações e executar exclusões solicitadas pela tela do paciente.
- Definir processo para exportação, correção e exclusão dos dados do paciente.
- Evitar dados clínicos, chaves e tokens em logs.

## Segurança obrigatória antes do uso multiusuário

- Implementar Supabase Auth e sessão no servidor.
- Deixar de usar a service role nas requisições clínicas comuns.
- Preencher e validar `owner_id` com o usuário autenticado.
- Testar o isolamento entre pelo menos duas contas.
- Rotacionar todas as chaves compartilhadas durante desenvolvimento.

## Qualidade

- Executar `npm run lint`, `npm run build` e `npm run test:e2e`.
- Executar o CRUD automatizado somente contra banco de homologação.
- Confirmar estados de erro e banco vazio em desktop e celular.
