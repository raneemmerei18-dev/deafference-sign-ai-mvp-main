export const LOCALES = ["en", "ar"] as const
export type Locale = (typeof LOCALES)[number]
export type Direction = "ltr" | "rtl"

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_COOKIE = "deafference_locale"

export function parseLocale(value: string | null | undefined): Locale | null {
  return LOCALES.includes(value as Locale) ? (value as Locale) : null
}

export function dirFor(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr"
}

const en = {
  meta: {
    title: "Deafference — Offline-first sign language translation",
    description:
      "Two-way sign language translation that runs on the device, for healthcare, education and public services.",
  },
  skipToContent: "Skip to main content",
  nav: {
    home: "Deafference home",
    mainNav: "Main navigation",
    demo: "Demo",
    pricing: "Pricing",
    contact: "Contact",
    bookDemo: "Book a demo",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguageTo: "Switch language to",
    otherLanguageName: "العربية",
  },
  demo: {
    eyebrow: "Live demo",
    title: "Two-way sign language translation, right on the device",
    lead: "Deafference translates between speech, text and sign language without sending video to the cloud. Try a sample conversation below.",
    badges: {
      offline: "Works offline",
      private: "Private on-device processing",
      bilingual: "English & Arabic interface",
    },
    primaryCta: "Book a live demo",
    secondaryCta: "See pricing",
    modesLabel: "Translation direction",
    to: "to",
    modes: {
      speechToSign: { from: "Speech", to: "Sign" },
      signToText: { from: "Sign", to: "Text" },
    },
    phrasesLabel: "Sample phrases",
    phrases: {
      greeting: "Hello, how are you?",
      help: "I need help, please.",
      doctor: "Where is the doctor?",
      water: "I'd like some water, please.",
    },
    inputLabel: { speechToSign: "You say", signToText: "Signs detected" },
    outputLabel: { speechToSign: "Signed as", signToText: "Translated text" },
    translating: "Translating…",
    glossNote: "Signs are shown as ASL gloss, the written notation for each sign.",
    offlineNote: "Runs entirely on this device. No internet connection needed.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Plans for individuals, clinics and institutions",
    lead: "Start free. Upgrade when your team needs real-time translation across more devices and departments.",
    perMonth: "/month",
    custom: "Custom",
    customNote: "Tailored annual contract",
    recommended: "Recommended",
    includes: "Includes",
    pricesNote: "All prices in USD.",
    plans: {
      free: {
        name: "Free",
        audience: "For individual Deaf and hard-of-hearing users and personal emergency prep",
        features: ["Emergency quick-action hub", "Basic offline phrases", "Text-to-sign translation"],
        cta: "Get started",
      },
      basic: {
        name: "Basic",
        audience: "For small clinics, private practices and local community offices",
        features: [
          "AI real-time sign translation",
          "Digital communication cards",
          "Single-device access",
          "Email support",
        ],
        cta: "Choose Basic",
      },
      premium: {
        name: "Premium",
        audience: "For regional hospitals, educational institutions and mid-sized enterprises",
        features: [
          "Full two-way sign-to-speech and speech-to-sign translation",
          "Multi-dialect support",
          "Waiting-room visual and haptic alerts",
          "Priority 24/7 technical support",
        ],
        cta: "Choose Premium",
      },
      enterprise: {
        name: "Enterprise",
        audience: "For hospital networks, government agencies, universities and multi-location organizations",
        features: [
          "Full EHR/EMR and hospital system integration",
          "Custom regional dialect training",
          "Dedicated HIPAA/GDPR compliance reporting",
          "SLA guarantees",
          "Multi-department licensing",
        ],
        cta: "Contact sales",
      },
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your rollout",
    lead: "Tell us about your team or use case. We reply by email, or by video call in sign language if you prefer.",
    fields: {
      name: "Full name",
      email: "Work email",
      organization: "Organization",
      topic: "What can we help with?",
      contactMethod: "How should we reach you?",
      message: "Message",
    },
    optional: "(optional)",
    topicPlaceholder: "Select a topic",
    topics: {
      demo: "Book a demo",
      sales: "Pricing and plans",
      support: "Product support",
      partnership: "Partnerships",
      general: "Something else",
    },
    methods: {
      email: "Email",
      video: "Video call in sign language",
      text: "Text chat",
    },
    messagePlaceholder: "Tell us a bit about your team and what you're hoping to solve.",
    submit: "Send message",
    submitting: "Sending…",
    successTitle: "Thanks, your message is on its way.",
    successBody: "We'll reply to the email address you gave us.",
    sendAnother: "Send another message",
    errorGeneric: "We couldn't send your message. Please try again, or email us at",
    errorOffline: "You appear to be offline. Reconnect and try again, or email us at",
    errors: {
      summary: "Please fix the highlighted fields.",
      required: "This field is required.",
      email: "Enter a valid email address.",
      messageShort: "Please write at least 10 characters.",
      tooLong: "This is too long.",
    },
    channelsTitle: "Or email us directly",
    channels: {
      general: { title: "General inquiries", description: "Questions about the product or a demo walkthrough." },
      partners: {
        title: "Partnerships and sales",
        description: "Piloting Deafference across a clinic, campus or agency.",
      },
      support: { title: "Support", description: "Already using the app and need a hand." },
    },
  },
  footer: {
    tagline: "Offline-first sign language translation for healthcare, education and public services.",
    sitemap: "Sitemap",
    groups: { product: "Product", company: "Company", resources: "Resources" },
    connect: "Connect",
    accessibilityTitle: "Accessibility statement",
    accessibilityBody:
      "Deafference is built for Deaf and hard-of-hearing people. We aim to meet WCAG 2.2 Level AA across this site: every page works with a keyboard, supports right-to-left Arabic, respects reduced-motion settings and never relies on sound alone to convey information.",
    accessibilityContactLead: "If anything on this site is hard to use, email",
    accessibilityContactTail: "and we'll work with you to fix it.",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
}

export type Dictionary = typeof en

const ar: Dictionary = {
  meta: {
    title: "Deafference — ترجمة لغة الإشارة دون اتصال بالإنترنت",
    description: "ترجمة لغة الإشارة في الاتجاهين تعمل على الجهاز، لقطاعات الرعاية الصحية والتعليم والخدمات العامة.",
  },
  skipToContent: "انتقل إلى المحتوى الرئيسي",
  nav: {
    home: "الصفحة الرئيسية لـ Deafference",
    mainNav: "التنقل الرئيسي",
    demo: "العرض التجريبي",
    pricing: "الأسعار",
    contact: "تواصل معنا",
    bookDemo: "احجز عرضًا تجريبيًا",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    switchLanguageTo: "تغيير اللغة إلى",
    otherLanguageName: "English",
  },
  demo: {
    eyebrow: "عرض مباشر",
    title: "ترجمة لغة الإشارة في الاتجاهين، مباشرة على جهازك",
    lead: "يترجم Deafference بين الكلام والنص ولغة الإشارة دون إرسال الفيديو إلى السحابة. جرّب محادثة نموذجية أدناه.",
    badges: {
      offline: "يعمل دون اتصال بالإنترنت",
      private: "معالجة خاصة على الجهاز",
      bilingual: "واجهة بالعربية والإنجليزية",
    },
    primaryCta: "احجز عرضًا مباشرًا",
    secondaryCta: "اطّلع على الأسعار",
    modesLabel: "اتجاه الترجمة",
    to: "إلى",
    modes: {
      speechToSign: { from: "كلام", to: "إشارة" },
      signToText: { from: "إشارة", to: "نص" },
    },
    phrasesLabel: "عبارات نموذجية",
    phrases: {
      greeting: "مرحبًا، كيف حالك؟",
      help: "أحتاج إلى المساعدة من فضلك.",
      doctor: "أين الطبيب؟",
      water: "أريد بعض الماء من فضلك.",
    },
    inputLabel: { speechToSign: "تقول", signToText: "الإشارات المكتشفة" },
    outputLabel: { speechToSign: "بلغة الإشارة", signToText: "النص المترجم" },
    translating: "جارٍ الترجمة…",
    glossNote: "تُعرض الإشارات بترميز ASL المكتوب (Gloss)، وهو التمثيل النصي لكل إشارة.",
    offlineNote: "يعمل بالكامل على هذا الجهاز، دون الحاجة إلى اتصال بالإنترنت.",
  },
  pricing: {
    eyebrow: "الأسعار",
    title: "خطط للأفراد والعيادات والمؤسسات",
    lead: "ابدأ مجانًا، ثم انتقل إلى خطة أعلى عندما يحتاج فريقك إلى ترجمة فورية على أجهزة وأقسام أكثر.",
    perMonth: "شهريًا",
    custom: "حسب الطلب",
    customNote: "عقد سنوي مخصص",
    recommended: "موصى بها",
    includes: "تشمل",
    pricesNote: "جميع الأسعار بالدولار الأمريكي.",
    plans: {
      free: {
        name: "مجانية",
        audience: "للأفراد الصم وضعاف السمع وللاستعداد الشخصي لحالات الطوارئ",
        features: ["مركز إجراءات الطوارئ السريعة", "عبارات أساسية تعمل دون اتصال", "ترجمة النص إلى لغة الإشارة"],
        cta: "ابدأ الآن",
      },
      basic: {
        name: "الأساسية",
        audience: "للعيادات الصغيرة والممارسات الخاصة ومكاتب المجتمع المحلي",
        features: [
          "ترجمة فورية للغة الإشارة بالذكاء الاصطناعي",
          "بطاقات تواصل رقمية",
          "استخدام على جهاز واحد",
          "دعم عبر البريد الإلكتروني",
        ],
        cta: "اختر الخطة الأساسية",
      },
      premium: {
        name: "المميزة",
        audience: "للمستشفيات الإقليمية والمؤسسات التعليمية والشركات المتوسطة",
        features: [
          "ترجمة كاملة في الاتجاهين: من الإشارة إلى الكلام ومن الكلام إلى الإشارة",
          "دعم لهجات إشارية متعددة",
          "تنبيهات مرئية واهتزازية في غرف الانتظار",
          "دعم فني ذو أولوية على مدار الساعة",
        ],
        cta: "اختر الخطة المميزة",
      },
      enterprise: {
        name: "المؤسسات",
        audience: "لشبكات المستشفيات والجهات الحكومية والجامعات والمؤسسات متعددة الفروع",
        features: [
          "تكامل كامل مع أنظمة السجلات الطبية الإلكترونية وأنظمة المستشفيات",
          "تدريب مخصص على اللهجات الإشارية المحلية",
          "تقارير امتثال مخصصة لمعايير HIPAA وGDPR",
          "ضمانات مستوى الخدمة (SLA)",
          "تراخيص متعددة الأقسام",
        ],
        cta: "تواصل مع المبيعات",
      },
    },
  },
  contact: {
    eyebrow: "تواصل معنا",
    title: "لنتحدث عن احتياجات فريقك",
    lead: "أخبرنا عن فريقك أو حالة الاستخدام لديك. نرد عبر البريد الإلكتروني، أو عبر مكالمة فيديو بلغة الإشارة إن كنت تفضّل ذلك.",
    fields: {
      name: "الاسم الكامل",
      email: "البريد الإلكتروني للعمل",
      organization: "الجهة",
      topic: "كيف يمكننا مساعدتك؟",
      contactMethod: "كيف تفضّل أن نتواصل معك؟",
      message: "رسالتك",
    },
    optional: "(اختياري)",
    topicPlaceholder: "اختر موضوعًا",
    topics: {
      demo: "حجز عرض تجريبي",
      sales: "الأسعار والخطط",
      support: "الدعم الفني",
      partnership: "الشراكات",
      general: "أمر آخر",
    },
    methods: {
      email: "البريد الإلكتروني",
      video: "مكالمة فيديو بلغة الإشارة",
      text: "محادثة نصية",
    },
    messagePlaceholder: "أخبرنا قليلًا عن فريقك وما الذي تريد تحقيقه.",
    submit: "إرسال الرسالة",
    submitting: "جارٍ الإرسال…",
    successTitle: "شكرًا لك، تم إرسال رسالتك.",
    successBody: "سنرد عليك عبر البريد الإلكتروني الذي أدخلته.",
    sendAnother: "إرسال رسالة أخرى",
    errorGeneric: "تعذّر إرسال رسالتك. حاول مرة أخرى، أو راسلنا على",
    errorOffline: "يبدو أنك غير متصل بالإنترنت. أعد الاتصال وحاول مرة أخرى، أو راسلنا على",
    errors: {
      summary: "يُرجى تصحيح الحقول المحددة.",
      required: "هذا الحقل مطلوب.",
      email: "أدخل بريدًا إلكترونيًا صالحًا.",
      messageShort: "يُرجى كتابة 10 أحرف على الأقل.",
      tooLong: "النص طويل جدًا.",
    },
    channelsTitle: "أو راسلنا مباشرة",
    channels: {
      general: { title: "الاستفسارات العامة", description: "أسئلة حول المنتج أو طلب عرض تجريبي." },
      partners: {
        title: "الشراكات والمبيعات",
        description: "لتجربة Deafference في عيادة أو حرم جامعي أو جهة حكومية.",
      },
      support: { title: "الدعم الفني", description: "إذا كنت تستخدم التطبيق وتحتاج إلى مساعدة." },
    },
  },
  footer: {
    tagline: "ترجمة لغة الإشارة التي تعمل دون اتصال بالإنترنت، لقطاعات الرعاية الصحية والتعليم والخدمات العامة.",
    sitemap: "خريطة الموقع",
    groups: { product: "المنتج", company: "الشركة", resources: "الموارد" },
    connect: "تواصل معنا",
    accessibilityTitle: "بيان إمكانية الوصول",
    accessibilityBody:
      "صُمّم Deafference للأشخاص الصم وضعاف السمع. نسعى إلى استيفاء معايير WCAG 2.2 بالمستوى AA في هذا الموقع: يمكن استخدام كل صفحة بلوحة المفاتيح، ويدعم الموقع العربية من اليمين إلى اليسار، ويحترم إعدادات تقليل الحركة، ولا يعتمد أبدًا على الصوت وحده لنقل المعلومات.",
    accessibilityContactLead: "إذا واجهت صعوبة في استخدام أي جزء من الموقع، راسلنا على",
    accessibilityContactTail: "وسنعمل معك على إصلاحها.",
    rights: "جميع الحقوق محفوظة.",
    backToTop: "العودة إلى الأعلى",
  },
}

export const dictionaries: Record<Locale, Dictionary> = { en, ar }
