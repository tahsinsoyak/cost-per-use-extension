import { createLocale } from './createLocale';

export const ptBR = createLocale({
  common: {
    loading: 'Carregando Custo por Uso...', appName: 'Custo por Uso', appSubTitle: 'Conheça o valor real antes de comprar',
    autofilled: 'Dados do produto preenchidos pela página.', autofillBtn: 'Preencher', saveSuccess: 'Preferências salvas.',
    saveError: 'Não foi possível salvar as preferências.', yrShort: 'ano', moShort: 'mês', productDefault: 'Produto',
  },
  tabs: { calculate: 'Calcular', compare: 'Comparar', history: 'Histórico' },
  calculator: {
    placeholderProduct: 'O que você vai comprar?', labelPrice: 'Informe o preço', titlePrice: 'Preço do produto',
    labelDuration: 'Por quanto tempo você terá o produto?', labelUsage: 'Com que frequência você usará?',
    advancedToggle: 'Avançado (Revenda, parcelas, salário)', labelResale: 'Valor estimado de revenda',
    labelMaintenance: 'Custo estimado de manutenção', labelPayments: 'Número de pagamentos', labelTotalPaid: 'Valor total pago',
    labelHourlyWage: 'Salário líquido por hora', btnCalculate: 'Calcular custo por uso',
    errors: {
      priceRequired: 'O preço deve ser maior que zero.', durationRequired: 'A duração deve ser maior que zero.',
      usesRequired: 'Os usos por semana devem ser maiores que zero.', resaleLimit: 'O valor de revenda não pode superar o custo total.',
      generic: 'Corrija os erros do formulário.', calculateFirst: 'Faça o cálculo primeiro.',
    },
  },
  results: {
    title: 'Resultados', costPerUse: 'Custo por uso', valueRating: 'Avaliação de valor', btnSave: 'Salvar cálculo',
    btnCompare: 'Adicionar à comparação', metrics: { perDay: 'Por dia', perMonth: 'Por mês', perYear: 'Por ano', totalUses: 'Usos totais', netCost: 'Custo líquido' },
    ratingLabels: { excellent: 'Excelente', good: 'Bom', think_twice: 'Pense melhor', expensive: 'Caro' },
    perUseLabel: '/ uso', disclaimer: 'Esta estimativa usa os dados informados. O valor real depende do uso.',
    btnCompared: 'Adicionado', timesLabel: 'vezes',
  },
  compare: {
    title: 'Comparação de produtos', btnRemove: 'Remover', btnClear: 'Limpar tudo', empty: 'Nenhum produto para comparar.',
    bestBadge: 'Melhor escolha', alreadyAdded: 'Já adicionado à comparação.', addedSuccess: '{product} foi adicionado.', removed: 'Removido da comparação.',
  },
  scraper: {
    systemPage: 'Não é possível ler páginas do sistema.', injectFailed: 'Não foi possível iniciar o preenchimento. Atualize a página.',
    connectFailed: 'Não foi possível conectar à página.', autofillSuccess: 'Dados do produto preenchidos.', noProductDetails: 'Nenhum dado de produto encontrado.',
  },
  history: {
    title: 'Cálculos salvos', empty: 'Nenhum cálculo salvo.', recentTitle: 'Cálculos recentes', viewAll: 'Ver todos ({count})',
    btnClear: 'Limpar histórico', btnExport: 'Exportar JSON', btnImport: 'Importar JSON', deleteConfirm: 'Cálculo excluído.',
    clearConfirm: 'Histórico apagado.', saveSuccess: 'Cálculo salvo localmente.', tableProduct: 'Produto', tablePrice: 'Preço',
    tableNetCost: 'Custo líquido', tableDuration: 'Posse e uso', tableRating: 'Avaliação', tableCostUse: 'Custo / uso',
    tableActions: 'Ações', unnamedProduct: 'Produto sem nome', usesCount: '{count} usos',
  },
  settings: {
    title: 'Padrões e opções', subTitle: 'Configurações e personalização', labelCurrency: 'Moeda padrão', customCurrencySymbol: 'Símbolo personalizado',
    labelDuration: 'Duração', labelDurationUnit: 'Unidade', labelUsesPerWeek: 'Usos por semana',
    labelEnableLabor: 'Ativar conversão em tempo de trabalho', descEnableLabor: 'Mostrar o custo como tempo de trabalho',
    labelAutoFill: 'Ativar preenchimento em páginas de produto', descAutoFill: 'Lê localmente o título e o preço da página ativa. Esses dados nunca são transmitidos.',
    labelTheme: 'Tema', labelLanguage: 'Idioma', privacyTitle: 'Privacidade',
    privacyDesc: 'Dados da página e cálculos permanecem no armazenamento local do navegador.',
    privacyBadge1: 'Somente armazenamento local', privacyBadge2: 'Sem rastreadores', btnSave: 'Salvar preferências',
    btnClearDb: 'Limpar banco de dados', btnConfirmClearDb: 'Confirmar limpeza', saveSuccess: 'Preferências salvas.',
  },
  support: {
    title: 'Apoie esta extensão', description: 'Esta extensão é gratuita e de código aberto. Apoie o desenvolvimento no Patreon.',
    patreonBtn: 'Apoiar no Patreon', freeBadge: 'Grátis e código aberto', noAdsBadge: 'Sem anúncios nem rastreamento',
  },
});
