# Fonte da base de alimentos

NEPA/UNICAMP. **Tabela Brasileira de Composição de Alimentos — TACO**, 4ª edição revisada e ampliada. Campinas, 2011.

- Publicação oficial: https://nepa.unicamp.br/publicacoes/
- Planilha oficial: https://nepa.unicamp.br/wp-content/uploads/sites/27/2023/10/Taco-4a-Edicao.xlsx
- Publicação e condições de reprodução: https://nepa.unicamp.br/wp-content/uploads/sites/27/2023/10/taco_4_edicao_ampliada_e_revisada.pdf
- A publicação permite reprodução total ou parcial com citação da fonte (páginas ii–iii). Este projeto mantém a atribuição na biblioteca e no plano alimentar.
- SHA-256 da planilha: a66b8ec528daeabc63bc2b015fc9bd8c6d76b941c2fc0ed93a4311d449302d14.
- Importação conferida em 03/11/2026: 597 alimentos, 15 categorias. Os identificadores originais são preservados em sourceCode.

## Conversão e uso

O arquivo taco-4a-edicao.json foi gerado diretamente da primeira aba da planilha oficial, sem copiar uma API de terceiros. Não há chave, assinatura, limite de consultas externo ou dependência de rede durante o atendimento. A API autenticada /api/foods e as telas combinam esta referência com os cadastros privados da conta.

Os valores de energia (kcal), proteína, carboidratos e lipídeos (g) referem-se a 100 g de parte comestível. A descrição original identifica o preparo. Os números da planilha são preservados até seis casas decimais, antes da escala de porção. Não são inferidas medidas caseiras.

Células vazias ou NA são mantidas como null e exibidas como ND. Alimentos com algum dos quatro nutrientes indisponível não são adicionados automaticamente ao plano: o profissional pode cadastrar uma versão própria com valores revisados. A indicação Tr é preservada separadamente e aproximada como zero na soma; ela não significa ausência absoluta do nutriente.

As porções em gramas são escaladas no servidor. Em cadastros próprios sem peso em gramas explícito na porção, usa-se a quantidade de porções cadastradas, sem converter mililitros ou unidades arbitrariamente em gramas. O plano guarda uma cópia dos valores calculados; futuras alterações da referência não reescrevem refeições antigas. A indicação (TACO) acompanha o nome no registro salvo e nas exportações.

Para reproduzir sem dependências adicionais:

    python scripts/import-taco.py --input caminho/para/Taco-4a-Edicao.xlsx

Sem --input, o script baixa a planilha oficial e verifica o checksum antes de gerar o JSON. Mudanças na fonte exigem revisão explícita do arquivo e do checksum.

Valores negativos encontrados na planilha são mantidos no campo sourceIssues para rastreabilidade e tratados como ND no nutriente correspondente; não são convertidos em zero nem usados no plano.
