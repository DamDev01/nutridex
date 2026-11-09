# Estado do projeto — 03/11/2026

## Versão anterior à base TACO

- Sites: versão 13, origem 8f3710f822db509b11f8135c3e49d47f26ed136a.
- Mesmo conteúdo Git salvo no GitHub no commit 77ffb657c09901ec4745985d7850f9d16d09987c, PR #2. PR integrada à main com autorização explícita, merge 7a9547d00988ec6f3985e472202b99296c98610e.
- O portal exclusivo de assinaturas NutriDex está configurado em produção e vinculado no ambiente do Sites. Credenciais e configurações de servidor ficam no Sites, fora do Git.
- Compra e liberação de acesso passaram em ambiente de teste isolado, sem cobrança real. Cancelamento ao fim do período foi confirmado na assinatura fictícia. Isso não equivale a uma compra real em produção.
- Os 14 testes automatizados de cobrança passaram nesta atualização.
- Cadastro, anamnese, medidas, plano alimentar, isolamento entre contas, fotografias, exclusão e documentos têm validações registradas no histórico de outubro. Não recolocá-los como pendências genéricas sem um novo problema identificado.

## Integração TACO

A biblioteca combina 597 referências da TACO com alimentos privados da conta. Busca por nome, preparo, categoria e origem; cálculo de porções no servidor; persistência como cópia dos valores no item do plano, preservando refeições antigas.

A fonte é a planilha oficial do NEPA/UNICAMP, com importador reproduzível, checksum e atribuição em data/TACO.md. Não é necessária assinatura de API, chave ou migração do banco. Dados ausentes e inconsistentes são apresentados como ND; valores negativos da origem ficam registrados em sourceIssues. Traços são identificados e aproximados como zero na soma.

Verificações da integração: testes em tests/foods.test.cjs, comparação dos 597 registros com o importador da fonte oficial, checagem de TypeScript de app e compilação de produção. A ferramenta de controle do navegador ficou indisponível nesta rodada; não registrar uma nova conferência visual como concluída.

## Decisões e operação

- Backup/restauração foram adiados pelo responsável por falta de orçamento, fora desta fase.
- Alertas operacionais automáticos permanecem uma melhoria futura; consultas pontuais aos registros não equivalem a monitoramento contínuo.
- Esta documentação não substitui a consulta ao estado publicado no Sites e às branches/PRs do GitHub.
