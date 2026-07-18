import { createLocale } from './createLocale';

export const ar = createLocale({
  common: {
    loading: 'جارٍ تحميل تكلفة الاستخدام...', appName: 'تكلفة الاستخدام', appSubTitle: 'اعرف القيمة الحقيقية قبل الشراء',
    autofilled: 'تم ملء بيانات المنتج من الصفحة.', autofillBtn: 'ملء تلقائي', saveSuccess: 'تم حفظ التفضيلات.',
    saveError: 'تعذر حفظ التفضيلات.', yrShort: 'سنة', moShort: 'شهر', productDefault: 'منتج',
  },
  tabs: { calculate: 'حساب', compare: 'مقارنة', history: 'السجل' },
  calculator: {
    placeholderProduct: 'ماذا ستشتري؟', labelPrice: 'أدخل السعر', titlePrice: 'سعر المنتج',
    labelDuration: 'كم ستحتفظ به؟', labelUsage: 'كم مرة ستستخدمه؟', advancedToggle: 'متقدم (إعادة البيع، الأقساط، الأجر)',
    labelResale: 'قيمة إعادة البيع المتوقعة', labelMaintenance: 'تكلفة الصيانة المتوقعة', labelPayments: 'عدد الدفعات',
    labelTotalPaid: 'إجمالي المبلغ المدفوع', labelHourlyWage: 'صافي الأجر بالساعة', btnCalculate: 'احسب تكلفة الاستخدام',
    errors: {
      priceRequired: 'يجب أن يكون السعر أكبر من صفر.', durationRequired: 'يجب أن تكون المدة أكبر من صفر.',
      usesRequired: 'يجب أن يكون عدد مرات الاستخدام أكبر من صفر.', resaleLimit: 'لا يمكن أن تتجاوز قيمة إعادة البيع التكلفة الإجمالية.',
      generic: 'يرجى تصحيح أخطاء النموذج.', calculateFirst: 'يرجى إجراء الحساب أولاً.',
    },
  },
  results: {
    title: 'نتائج الحساب', costPerUse: 'تكلفة الاستخدام', valueRating: 'تقييم القيمة', btnSave: 'حفظ الحساب',
    btnCompare: 'إضافة للمقارنة', metrics: { perDay: 'يوميًا', perMonth: 'شهريًا', perYear: 'سنويًا', totalUses: 'إجمالي الاستخدامات', netCost: 'التكلفة الصافية' },
    ratingLabels: { excellent: 'ممتاز', good: 'جيد', think_twice: 'فكر مجددًا', expensive: 'مرتفع' },
    perUseLabel: '/ استخدام', disclaimer: 'هذا تقدير يعتمد على بياناتك. تعتمد القيمة الفعلية على الاستخدام.',
    btnCompared: 'تمت الإضافة', timesLabel: 'مرة',
  },
  compare: {
    title: 'مقارنة المنتجات', btnRemove: 'إزالة', btnClear: 'مسح الكل', empty: 'لا توجد منتجات للمقارنة بعد.',
    bestBadge: 'أفضل خيار', alreadyAdded: 'مضاف بالفعل إلى المقارنة.', addedSuccess: 'تمت إضافة {product} للمقارنة.', removed: 'تمت الإزالة من المقارنة.',
  },
  scraper: {
    systemPage: 'لا يمكن قراءة صفحات النظام.', injectFailed: 'تعذر تشغيل الملء التلقائي. حدّث الصفحة.',
    connectFailed: 'تعذر الاتصال بالصفحة.', autofillSuccess: 'تم ملء بيانات المنتج.', noProductDetails: 'لم يتم العثور على بيانات المنتج.',
  },
  history: {
    title: 'الحسابات المحفوظة', empty: 'لا توجد حسابات محفوظة.', recentTitle: 'الحسابات الأخيرة', viewAll: 'عرض الكل ({count})',
    btnClear: 'مسح السجل', btnExport: 'تصدير JSON', btnImport: 'استيراد JSON', deleteConfirm: 'تم حذف الحساب.',
    clearConfirm: 'تم مسح السجل.', saveSuccess: 'تم حفظ الحساب محليًا.', tableProduct: 'المنتج', tablePrice: 'السعر',
    tableNetCost: 'التكلفة الصافية', tableDuration: 'الملكية والاستخدام', tableRating: 'التقييم', tableCostUse: 'التكلفة / الاستخدام',
    tableActions: 'الإجراءات', unnamedProduct: 'منتج بلا اسم', usesCount: '{count} استخدام',
  },
  settings: {
    title: 'القيم والخيارات', subTitle: 'الإعدادات والتخصيص', labelCurrency: 'العملة الافتراضية', customCurrencySymbol: 'رمز مخصص',
    labelDuration: 'المدة', labelDurationUnit: 'الوحدة', labelUsesPerWeek: 'الاستخدامات أسبوعيًا',
    labelEnableLabor: 'إظهار ما يعادل وقت العمل', descEnableLabor: 'تحويل التكلفة إلى وقت عمل',
    labelAutoFill: 'تفعيل الملء من صفحات المنتجات', descAutoFill: 'يقرأ اسم المنتج وسعره محليًا من الصفحة النشطة. لا يتم إرسال هذه البيانات.',
    labelTheme: 'المظهر', labelLanguage: 'اللغة', privacyTitle: 'الخصوصية',
    privacyDesc: 'تبقى بيانات الصفحة والحسابات في التخزين المحلي للمتصفح.',
    privacyBadge1: 'تخزين محلي فقط', privacyBadge2: 'دون تتبع', btnSave: 'حفظ التفضيلات',
    btnClearDb: 'مسح قاعدة البيانات', btnConfirmClearDb: 'تأكيد المسح', saveSuccess: 'تم حفظ التفضيلات.',
  },
  updates: {
    eyebrow: 'الجديد في الإصدار {version}',
    title: 'نافذة أفضل مصممة لمتصفح Chrome',
    description: 'تفتح مساحة العمل الآن بحجم ثابت وتبقى جميع عناصر التحكم واضحة.',
    layoutTitle: 'مساحة أفضل للحساب',
    layoutDescription: 'تلائم الحاسبة والنتائج والمقارنات والسجل النافذة دون اقتطاع.',
    noticeTitle: 'ملاحظات تحديث لمرة واحدة',
    noticeDescription: 'ستظهر هذه الشاشة مرة واحدة فقط بعد كل إصدار جديد.',
    privacyTitle: 'الخصوصية جزء من التصميم',
    privacyDescription: 'تبقى حساباتك وتفضيلاتك وسجلك المحفوظ على جهازك.',
    releaseNotes: 'ملاحظات الإصدار',
    support: 'ادعمنا',
    continue: 'ابدأ الحساب',
    close: 'إغلاق ملاحظات التحديث',
  },
  support: {
    title: 'ادعم هذه الإضافة', description: 'هذه الإضافة مجانية ومفتوحة المصدر. يمكنك دعم تطويرها عبر Patreon.',
    patreonBtn: 'الدعم عبر Patreon', freeBadge: 'مجانية ومفتوحة المصدر', noAdsBadge: 'دون إعلانات أو تتبع',
  },
});
