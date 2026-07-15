import { createLocale } from './createLocale';

export const ru = createLocale({
  common: {
    loading: 'Загрузка стоимости использования...', appName: 'Стоимость использования', appSubTitle: 'Узнайте реальную ценность до покупки',
    autofilled: 'Данные товара заполнены со страницы.', autofillBtn: 'Заполнить', saveSuccess: 'Настройки сохранены.',
    saveError: 'Не удалось сохранить настройки.', yrShort: 'г.', moShort: 'мес.', productDefault: 'Товар',
  },
  tabs: { calculate: 'Расчёт', compare: 'Сравнение', history: 'История' },
  calculator: {
    placeholderProduct: 'Что вы покупаете?', labelPrice: 'Введите цену', titlePrice: 'Цена товара',
    labelDuration: 'Как долго вы будете владеть товаром?', labelUsage: 'Как часто вы будете им пользоваться?',
    advancedToggle: 'Дополнительно (Перепродажа, платежи, зарплата)', labelResale: 'Ожидаемая стоимость перепродажи',
    labelMaintenance: 'Ожидаемые расходы на обслуживание', labelPayments: 'Количество платежей', labelTotalPaid: 'Общая сумма платежей',
    labelHourlyWage: 'Чистая почасовая оплата', btnCalculate: 'Рассчитать стоимость использования',
    errors: {
      priceRequired: 'Цена должна быть больше нуля.', durationRequired: 'Срок должен быть больше нуля.',
      usesRequired: 'Количество использований должно быть больше нуля.', resaleLimit: 'Стоимость перепродажи не может превышать общую стоимость.',
      generic: 'Исправьте ошибки формы.', calculateFirst: 'Сначала выполните расчёт.',
    },
  },
  results: {
    title: 'Результаты', costPerUse: 'Стоимость использования', valueRating: 'Оценка ценности', btnSave: 'Сохранить расчёт',
    btnCompare: 'Добавить к сравнению', metrics: { perDay: 'В день', perMonth: 'В месяц', perYear: 'В год', totalUses: 'Всего использований', netCost: 'Чистая стоимость' },
    ratingLabels: { excellent: 'Отлично', good: 'Хорошо', think_twice: 'Стоит подумать', expensive: 'Дорого' },
    perUseLabel: '/ использование', disclaimer: 'Оценка основана на ваших данных. Фактическая ценность зависит от использования.',
    btnCompared: 'Добавлено', timesLabel: 'раз',
  },
  compare: {
    title: 'Сравнение товаров', btnRemove: 'Удалить', btnClear: 'Очистить всё', empty: 'Нет товаров для сравнения.',
    bestBadge: 'Лучший выбор', alreadyAdded: 'Уже добавлено к сравнению.', addedSuccess: '{product} добавлен к сравнению.', removed: 'Удалено из сравнения.',
  },
  scraper: {
    systemPage: 'Нельзя читать системные страницы.', injectFailed: 'Не удалось запустить автозаполнение. Обновите страницу.',
    connectFailed: 'Не удалось подключиться к странице.', autofillSuccess: 'Данные товара заполнены.', noProductDetails: 'Данные товара не найдены.',
  },
  history: {
    title: 'Сохранённые расчёты', empty: 'Сохранённых расчётов пока нет.', recentTitle: 'Недавние расчёты', viewAll: 'Показать все ({count})',
    btnClear: 'Очистить историю', btnExport: 'Экспорт JSON', btnImport: 'Импорт JSON', deleteConfirm: 'Расчёт удалён.',
    clearConfirm: 'История очищена.', saveSuccess: 'Расчёт сохранён локально.', tableProduct: 'Товар', tablePrice: 'Цена',
    tableNetCost: 'Чистая стоимость', tableDuration: 'Владение и использование', tableRating: 'Оценка', tableCostUse: 'Цена / использование',
    tableActions: 'Действия', unnamedProduct: 'Безымянный товар', usesCount: '{count} использований',
  },
  settings: {
    title: 'Значения и параметры', subTitle: 'Настройки и персонализация', labelCurrency: 'Валюта по умолчанию', customCurrencySymbol: 'Свой символ',
    labelDuration: 'Срок', labelDurationUnit: 'Единица', labelUsesPerWeek: 'Использований в неделю',
    labelEnableLabor: 'Показывать эквивалент рабочего времени', descEnableLabor: 'Преобразовать стоимость в рабочее время',
    labelAutoFill: 'Автозаполнение со страниц товаров', descAutoFill: 'Локально читает название и цену с активной страницы. Данные не передаются.',
    labelTheme: 'Тема', labelLanguage: 'Язык', privacyTitle: 'Конфиденциальность',
    privacyDesc: 'Данные страницы и расчёты остаются в локальном хранилище браузера.',
    privacyBadge1: 'Только локальное хранение', privacyBadge2: 'Без отслеживания', btnSave: 'Сохранить настройки',
    btnClearDb: 'Очистить базу', btnConfirmClearDb: 'Подтвердить очистку', saveSuccess: 'Настройки сохранены.',
  },
  support: {
    title: 'Поддержать расширение', description: 'Расширение бесплатно и имеет открытый исходный код. Поддержите разработку на Patreon.',
    patreonBtn: 'Поддержать на Patreon', freeBadge: 'Бесплатно и открыто', noAdsBadge: 'Без рекламы и отслеживания',
  },
});
