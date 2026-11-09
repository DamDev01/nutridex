# NutriDex — assinatura e acesso

Plano: R$ 97,90/mês. Produto `prod_VWxgITWL5oV1CQ`, preço `price_1UVtl8JOwJCuf4fYUtOtq2gG`, conta Nexa.

## Fluxo

Página pública → Google → `/assinatura` → Checkout Session criada no servidor com o cliente vinculado à conta → webhook assinado → leitura atual da assinatura e da fatura na Stripe → registro do período pago no banco → `/painel`.

O retorno do checkout nunca concede acesso. RLS e middleware exigem assinatura ativa, fatura paga do preço NutriDex, período ainda válido e ausência de bloqueio de risco. Test-mode não concede acesso em produção. Cancelamento ao fim do período preserva o acesso enquanto o período pago estiver vigente; status canceled, pagamento pendente, falha de renovação e risco bloqueiam.

## Configuração necessária no servidor

Guardar apenas no ambiente secreto do Site (nunca em Git ou variáveis NEXT_PUBLIC):

- `STRIPE_RESTRICTED_KEY`: chave restrita criada para este servidor; Customers, Checkout Sessions e Customer Portal com escrita; Subscriptions, Invoices, Prices, Products e Charges and Refunds com leitura. Confirmar dependências de permissões apresentadas pela Stripe.
- `STRIPE_WEBHOOK_SECRET`: segredo do endpoint exclusivo `https://nutridex-gestao.damdev.chatgpt.site/api/billing/webhook`.
- `SUPABASE_SECRET_KEY`: chave de servidor do projeto NutriDex, necessária para gravar o resultado dos pagamentos; não deve chegar ao navegador.
- `STRIPE_PORTAL_CONFIGURATION`: configuração exclusiva da NutriDex para atualização de pagamento e cancelamento no fim do período, sem alterações de plano. Até existir, a gestão é encaminhada ao suporte.

O checkout fica indisponível até as três primeiras variáveis existirem. Configure `NUTRIDEX_SITE_ORIGIN` para a URL pública do Site e mantenha as variáveis públicas Supabase já existentes.

Webhook usa API `2026-09-30.endive`. Eventos tratados estão em `app/lib/billingConfig.ts`. O endpoint exige o corpo bruto, verifica assinatura e timestamp com o SDK oficial, usa leituras atuais para eventos fora de ordem e responde 500 para falhas que precisem de nova entrega. Não ativar o link de pagamento avulso como CTA: a aplicação usa Checkout Sessions com associação inequívoca da conta ao Stripe Customer.

Aplicar `supabase/billing.sql` depois do schema e das políticas de proprietário. As novas políticas são RESTRICTIVE: combinam pagamento E propriedade. A configuração do banco não concede planos ou períodos gratuitos a nenhuma conta.

## Verificação

- `node --test tests/billing.test.cjs`: assinatura criptográfica, pagamento pendente, preço incorreto, duplicatas, evento antigo, cancelamento, risco e middleware.
- `supabase/tests/billing.sql`: RLS com usuário pago, não pago, outra conta, vencimento e bloqueio de risco. Tudo roda em transação encerrada por rollback.
- Antes de divulgar vendas, validar pagamento em ambiente de teste separado, entrega do webhook, renovação, falha, cancelamento e portal. Não testar cartão fictício no modo real.

Impostos automáticos não foram habilitados; configure a tributação aplicável e os registros antes de ativar Stripe Tax. A Stripe não faz essa configuração automaticamente ao criar o plano.
