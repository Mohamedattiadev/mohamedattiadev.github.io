// Lightweight i18n: EN / TR / AR (RTL) — runtime DOM swap, persisted in localStorage.
// Usage in markup:
//   <el data-i18n="key">              → textContent = dict[key]
//   <el data-i18n-html="key">         → innerHTML  = dict[key]  (allow trusted markup like <em>)
//   <el data-i18n-attr="placeholder:key,aria-label:key2">
//   <html lang dir>                   → set per language
// Usage in JS: import { t } from "./i18n.js"; t("toast.signed_in")

const DICTS = {
  en: {
    "skip":                 "Skip to content",
    "nav.home":             "Home",
    "nav.work":             "Work",
    "nav.journal":          "Journal",
    "nav.contact":          "Contact",
    "nav.hire":             "Hire me",
    "nav.lang_label":       "Language",
    "menu":                 "Menu",

    "hero.meta":            "Open to work — part-time, full-time, internships. Summer 2026 onward.",
    "hero.h1.l1":           "Build, break,",
    "hero.h1.l2":           "ship, repeat.",
    "hero.h1.aria":         "Build, break, ship, repeat.",
    "hero.lede":            "Software engineering student at AYBU. I build things I'd actually use myself — then ship them on GitHub so other people can too. Looking for a real role where I can do more of this, with people smarter than me.",
    "hero.now_kbd":         "now",
    "hero.now":             "Sharpening full-stack skills the hard way — no AI handholding — to land real full-time work.",
    "hero.cta.work":        "Selected work",
    "hero.cta.contact":     "Contact me",
    "hero.scroll":          "SCROLL",
    "stack.aria":           "Tech stack",

    "about.kicker":         "02 — About",
    "about.h2":             "Software engineering student in Ankara. <em>I learn by building</em>, not by reading.",
    "about.c1.idx":         "/ 01",
    "about.c1.h":           "Now",
    "about.c1.p":           "Finishing my SE degree at AYBU. Spending most evenings building small tools — open source on GitHub, working in TypeScript and Go.",
    "about.c2.idx":         "/ 02",
    "about.c2.h":           "How I work",
    "about.c2.p":           "Ship first, polish second. Read source code before docs. Keep dependencies few. Write commit messages I'll understand next year.",
    "about.c3.idx":         "/ 03",
    "about.c3.h":           "Looking for",
    "about.c3.p":           "Full-time or part-time work as a frontend / full-stack engineer. Remote, or on the ground in Ankara or İstanbul. Starting Summer 2026.",

    "cta.h":                "Got an idea? <em>Let's build it.</em>",
    "cta.btn":              "Start a conversation →",

    "work.kicker":          "02 — Selected work",
    "work.h1":              "Things I've <em>shipped.</em>",
    "work.lede":            "Live from GitHub. Hover any card to see stats. Click to view source; if a live demo exists you'll see a \"Visit\" badge.",
    "work.search":          "Search projects…",
    "work.search_aria":     "Search projects",
    "work.filter.all":      "All",
    "work.preview.title":   "Hover a project",
    "work.preview.owner":   "— preview shows here —",
    "work.preview.desc":    "Move your cursor over any card on the left. README, stats, and links appear here.",
    "work.preview.close":   "Close preview",
    "work.source":          "Source ↗",
    "work.visit":           "Visit live ↗",
    "work.foot":            "More on",
    "work.card.source":     "Source",
    "work.card.visit":      "Visit",
    "work.card.private":    "Private",
    "work.card.private_t":  "Private repository",
    "work.card.no_desc":    "No description.",
    "work.pager.prev":      "‹ Prev",
    "work.pager.next":      "Next ›",
    "work.pager.aria":      "Pagination",

    "journal.kicker":       "03 — Journal",
    "journal.h1":           "Notes &amp; build <em>logs.</em>",
    "journal.lede":         "Drafts saved in your browser. Click <strong>New post</strong> to add one. Pick a template, write markdown, add images.",
    "journal.new":          "New post",
    "journal.info_prefix":  "Stored locally · ",
    "journal.export":       "Export",
    "journal.import":       "Import",
    "journal.signout":      "Sign out",
    "journal.filter":       "Filter posts…",
    "journal.filter_aria":  "Filter posts",
    "journal.select":       "Select a post →",
    "journal.empty":        "No posts yet.",
    "journal.empty_owner":  " Click <strong>New post</strong> to add one.",
    "journal.no_match":     "No posts match",
    "journal.not_found":    "Post not found.",
    "journal.loading":      "Loading…",

    "contact.kicker":       "04 — Contact",
    "contact.h":            "Let's <em>talk.</em>",
    "contact.lede":         "I read every message. Fastest reply over email — usually within a day.",
    "contact.status":       "Open to work · Summer 2026",
    "contact.meta":         "Ankara · English, Türkçe, العربية · email reply within a day.",
    "contact.email":        "Email",
    "contact.cv":           "CV",
    "contact.cv_btn":       "Preview PDF →",
    "contact.cv_meta":      "98 KB · updated Jun 2026",
    "contact.github":       "GitHub",
    "contact.linkedin":     "LinkedIn",
    "contact.x":            "X / Twitter",

    "404.title":            "Page not found.",
    "404.lede.before":      "The URL ",
    "404.lede.after":       " doesn't match anything here. Probably a typo, an old link, or a future page that hasn't shipped yet.",
    "404.back":             "← Back home",
    "404.browse":           "Browse work",
    "404.read":             "Read journal",

    "modal.post.new":       "New post",
    "modal.post.edit":      "Edit post",
    "modal.close":          "Close",
    "modal.field.title":    "Title",
    "modal.field.title_ph": "A great headline…",
    "modal.field.date":     "Date",
    "modal.field.tpl":      "Template",
    "modal.field.tpl_opt":  "— Use template —",
    "modal.field.body":     "Body (Markdown)",
    "modal.field.body_ph":  "# Heading\n\nWrite in markdown…",
    "modal.field.preview":  "Preview",
    "modal.cancel":         "Cancel",
    "modal.delete":         "Delete",
    "modal.save":           "Save post",
    "modal.iframe.title":   "Preview",
    "modal.iframe.open":    "Open in tab ↗",
    "modal.iframe.dl":      "Download",
    "modal.iframe.blocked": "Preview blocked by the site.",
    "modal.iframe.openlink":"Open it in a new tab →",

    "dlg.ok":               "OK",
    "dlg.cancel":           "Cancel",
    "dlg.confirm":          "Confirm",
    "dlg.notice":           "Notice",
    "dlg.input":            "Input",
  },

  tr: {
    "skip":                 "İçeriğe geç",
    "nav.home":             "Ana sayfa",
    "nav.work":             "Çalışmalar",
    "nav.journal":          "Günlük",
    "nav.contact":          "İletişim",
    "nav.hire":             "Beni işe al",
    "nav.lang_label":       "Dil",
    "menu":                 "Menü",

    "hero.meta":            "İşe açığım — yarı zamanlı, tam zamanlı, staj. 2026 yazından itibaren.",
    "hero.h1.l1":           "Yap, kır,",
    "hero.h1.l2":           "yayınla, tekrarla.",
    "hero.h1.aria":         "Yap, kır, yayınla, tekrarla.",
    "hero.lede":            "AYBU'da yazılım mühendisliği öğrencisi. Kendim kullanacağım şeyleri inşa ediyorum — sonra başkaları da kullanabilsin diye GitHub'da yayınlıyorum. Daha akıllı insanlarla bunu daha çok yapabileceğim gerçek bir iş arıyorum.",
    "hero.now_kbd":         "şimdi",
    "hero.now":             "Tam zamanlı bir iş bulmak için tam yığın becerilerini zor yoldan — yapay zeka desteği olmadan — geliştiriyorum.",
    "hero.cta.work":        "Seçilmiş işler",
    "hero.cta.contact":     "İletişime geç",
    "hero.scroll":          "KAYDIR",
    "stack.aria":           "Teknoloji yığını",

    "about.kicker":         "02 — Hakkında",
    "about.h2":             "Ankara'da yazılım mühendisliği öğrencisi. <em>Okuyarak değil</em>, yaparak öğreniyorum.",
    "about.c1.idx":         "/ 01",
    "about.c1.h":           "Şimdi",
    "about.c1.p":           "AYBU'da SE diplomamı bitiriyorum. Akşamlarımı küçük araçlar yaparak geçiriyorum — GitHub'da açık kaynak, TypeScript ve Go ile.",
    "about.c2.idx":         "/ 02",
    "about.c2.h":           "Nasıl çalışırım",
    "about.c2.p":           "Önce yayınla, sonra parlat. Dokümantasyondan önce kaynak kodu oku. Bağımlılıkları az tut. Gelecek yıl anlayacağım commit mesajları yaz.",
    "about.c3.idx":         "/ 03",
    "about.c3.h":           "Aranıyor",
    "about.c3.p":           "Frontend / full-stack mühendis olarak tam zamanlı veya yarı zamanlı iş. Uzaktan veya yerinde Ankara ya da İstanbul. 2026 yazından itibaren.",

    "cta.h":                "Fikrin mi var? <em>Birlikte yapalım.</em>",
    "cta.btn":              "Sohbet başlat →",

    "work.kicker":          "02 — Seçilmiş işler",
    "work.h1":              "Yayınladığım <em>şeyler.</em>",
    "work.lede":            "GitHub'dan canlı. İstatistikleri görmek için bir karta gel. Kaynağı görmek için tıkla; canlı demo varsa \"Ziyaret\" rozeti görürsün.",
    "work.search":          "Projelerde ara…",
    "work.search_aria":     "Projelerde ara",
    "work.filter.all":      "Hepsi",
    "work.preview.title":   "Bir projeye gel",
    "work.preview.owner":   "— önizleme burada görünür —",
    "work.preview.desc":    "İmleci soldaki herhangi bir karta götür. README, istatistikler ve bağlantılar burada görünür.",
    "work.preview.close":   "Önizlemeyi kapat",
    "work.source":          "Kaynak ↗",
    "work.visit":           "Canlıyı ziyaret et ↗",
    "work.foot":            "Daha fazlası",
    "work.card.source":     "Kaynak",
    "work.card.visit":      "Ziyaret",
    "work.card.private":    "Özel",
    "work.card.private_t":  "Özel depo",
    "work.card.no_desc":    "Açıklama yok.",
    "work.pager.prev":      "‹ Önceki",
    "work.pager.next":      "Sonraki ›",
    "work.pager.aria":      "Sayfalama",

    "journal.kicker":       "03 — Günlük",
    "journal.h1":           "Notlar ve <em>yapım logları.</em>",
    "journal.lede":         "Taslaklar tarayıcında saklanır. <strong>Yeni gönderi</strong>'ye tıklayıp ekle. Şablon seç, markdown yaz, resim ekle.",
    "journal.new":          "Yeni gönderi",
    "journal.info_prefix":  "Yerel olarak saklanır · ",
    "journal.export":       "Dışa aktar",
    "journal.import":       "İçe aktar",
    "journal.signout":      "Çıkış yap",
    "journal.filter":       "Gönderileri filtrele…",
    "journal.filter_aria":  "Gönderileri filtrele",
    "journal.select":       "Bir gönderi seç →",
    "journal.empty":        "Henüz gönderi yok.",
    "journal.empty_owner":  " <strong>Yeni gönderi</strong>'ye tıklayıp ekle.",
    "journal.no_match":     "Eşleşen gönderi yok",
    "journal.not_found":    "Gönderi bulunamadı.",
    "journal.loading":      "Yükleniyor…",

    "contact.kicker":       "04 — İletişim",
    "contact.h":            "<em>Konuşalım.</em>",
    "contact.lede":         "Her mesajı okuyorum. En hızlı yanıt e-posta üzerinden — genellikle bir gün içinde.",
    "contact.status":       "İşe açık · 2026 Yazı",
    "contact.meta":         "Ankara · English, Türkçe, العربية · e-posta yanıtı bir gün içinde.",
    "contact.email":        "E-posta",
    "contact.cv":           "CV",
    "contact.cv_btn":       "PDF önizle →",
    "contact.cv_meta":      "98 KB · Haz 2026 güncellendi",
    "contact.github":       "GitHub",
    "contact.linkedin":     "LinkedIn",
    "contact.x":            "X / Twitter",

    "404.title":            "Sayfa bulunamadı.",
    "404.lede.before":      "URL ",
    "404.lede.after":       " burada hiçbir şeyle eşleşmiyor. Muhtemelen bir yazım hatası, eski bir bağlantı veya henüz yayınlanmamış bir sayfa.",
    "404.back":             "← Ana sayfaya dön",
    "404.browse":           "İşlere göz at",
    "404.read":             "Günlüğü oku",

    "modal.post.new":       "Yeni gönderi",
    "modal.post.edit":      "Gönderiyi düzenle",
    "modal.close":          "Kapat",
    "modal.field.title":    "Başlık",
    "modal.field.title_ph": "Harika bir başlık…",
    "modal.field.date":     "Tarih",
    "modal.field.tpl":      "Şablon",
    "modal.field.tpl_opt":  "— Şablon kullan —",
    "modal.field.body":     "İçerik (Markdown)",
    "modal.field.body_ph":  "# Başlık\n\nMarkdown'da yaz…",
    "modal.field.preview":  "Önizleme",
    "modal.cancel":         "İptal",
    "modal.delete":         "Sil",
    "modal.save":           "Gönderiyi kaydet",
    "modal.iframe.title":   "Önizleme",
    "modal.iframe.open":    "Sekmede aç ↗",
    "modal.iframe.dl":      "İndir",
    "modal.iframe.blocked": "Önizleme site tarafından engellendi.",
    "modal.iframe.openlink":"Yeni sekmede aç →",

    "dlg.ok":               "Tamam",
    "dlg.cancel":           "İptal",
    "dlg.confirm":          "Onayla",
    "dlg.notice":           "Bildirim",
    "dlg.input":            "Giriş",
  },

  ar: {
    "skip":                 "تخطَّ إلى المحتوى",
    "nav.home":             "الرئيسية",
    "nav.work":             "الأعمال",
    "nav.journal":          "المدوّنة",
    "nav.contact":          "تواصل",
    "nav.hire":             "وظّفني",
    "nav.lang_label":       "اللغة",
    "menu":                 "القائمة",

    "hero.meta":            "متاح للعمل — جزئي، كامل، تدريب. ابتداءً من صيف 2026.",
    "hero.h1.l1":           "ابنِ، اكسر،",
    "hero.h1.l2":           "اطلق، كرّر.",
    "hero.h1.aria":         "ابنِ، اكسر، اطلق، كرّر.",
    "hero.lede":            "طالب هندسة برمجيات في جامعة AYBU. أبني أشياء أستخدمها فعلاً — ثم أنشرها على GitHub ليستفيد منها غيري. أبحث عن دور حقيقي أعمل فيه أكثر مع أشخاص أذكى مني.",
    "hero.now_kbd":         "الآن",
    "hero.now":             "أصقل مهارات الـ full-stack بالطريق الصعب — بدون مساعدة الذكاء الاصطناعي — للحصول على عمل بدوام كامل.",
    "hero.cta.work":        "أعمال مختارة",
    "hero.cta.contact":     "تواصل معي",
    "hero.scroll":          "مرّر",
    "stack.aria":           "حزمة التقنيات",

    "about.kicker":         "02 — عنّي",
    "about.h2":             "طالب هندسة برمجيات في أنقرة. <em>أتعلّم بالبناء</em>، لا بالقراءة.",
    "about.c1.idx":         "/ 01",
    "about.c1.h":           "الآن",
    "about.c1.p":           "أُنهي شهادتي في AYBU. أقضي معظم أمسياتي ببناء أدوات صغيرة — مفتوحة المصدر على GitHub بـ TypeScript و Go.",
    "about.c2.idx":         "/ 02",
    "about.c2.h":           "أسلوب عملي",
    "about.c2.p":           "أُطلق أولاً، أُلمّع لاحقاً. أقرأ الكود قبل التوثيق. أُقلّل التبعيات. أكتب رسائل commit أفهمها العام القادم.",
    "about.c3.idx":         "/ 03",
    "about.c3.h":           "أبحث عن",
    "about.c3.p":           "عمل دوام كامل أو جزئي كمهندس واجهات أو full-stack. عن بُعد أو في أنقرة أو إسطنبول. ابتداءً من صيف 2026.",

    "cta.h":                "لديك فكرة؟ <em>لنبنِها معاً.</em>",
    "cta.btn":              "ابدأ محادثة →",

    "work.kicker":          "02 — أعمال مختارة",
    "work.h1":              "أشياء <em>أطلقتُها.</em>",
    "work.lede":            "مباشرة من GitHub. مرّر فوق أي بطاقة لرؤية الإحصاءات. اضغط لعرض الكود؛ إن وُجد عرض حي ستظهر شارة \"زيارة\".",
    "work.search":          "ابحث في المشاريع…",
    "work.search_aria":     "ابحث في المشاريع",
    "work.filter.all":      "الكل",
    "work.preview.title":   "مرّر فوق مشروع",
    "work.preview.owner":   "— ستظهر المعاينة هنا —",
    "work.preview.desc":    "حرّك المؤشر فوق أي بطاقة على الجانب. ستظهر README والإحصاءات والروابط هنا.",
    "work.preview.close":   "إغلاق المعاينة",
    "work.source":          "الكود ↗",
    "work.visit":           "زيارة العرض الحي ↗",
    "work.foot":            "المزيد على",
    "work.card.source":     "الكود",
    "work.card.visit":      "زيارة",
    "work.card.private":    "خاص",
    "work.card.private_t":  "مستودع خاص",
    "work.card.no_desc":    "لا يوجد وصف.",
    "work.pager.prev":      "‹ السابق",
    "work.pager.next":      "التالي ›",
    "work.pager.aria":      "ترقيم الصفحات",

    "journal.kicker":       "03 — المدوّنة",
    "journal.h1":           "ملاحظات و<em>سجلات بناء.</em>",
    "journal.lede":         "تُحفظ المسودات في متصفحك. اضغط <strong>منشور جديد</strong> للإضافة. اختر قالباً، اكتب بـ markdown، أضف صوراً.",
    "journal.new":          "منشور جديد",
    "journal.info_prefix":  "مخزّن محلياً · ",
    "journal.export":       "تصدير",
    "journal.import":       "استيراد",
    "journal.signout":      "تسجيل خروج",
    "journal.filter":       "صفِّ المنشورات…",
    "journal.filter_aria":  "صفِّ المنشورات",
    "journal.select":       "اختر منشوراً ←",
    "journal.empty":        "لا منشورات بعد.",
    "journal.empty_owner":  " اضغط <strong>منشور جديد</strong> للإضافة.",
    "journal.no_match":     "لا منشورات تطابق",
    "journal.not_found":    "المنشور غير موجود.",
    "journal.loading":      "جارٍ التحميل…",

    "contact.kicker":       "04 — تواصل",
    "contact.h":            "<em>لنتحدّث.</em>",
    "contact.lede":         "أقرأ كل رسالة. أسرع رد عبر البريد — عادةً خلال يوم.",
    "contact.status":       "متاح للعمل · صيف 2026",
    "contact.meta":         "أنقرة · English, Türkçe, العربية · رد بالبريد خلال يوم.",
    "contact.email":        "البريد",
    "contact.cv":           "السيرة الذاتية",
    "contact.cv_btn":       "معاينة PDF ←",
    "contact.cv_meta":      "98 ك.ب · حُدِّثت يونيو 2026",
    "contact.github":       "GitHub",
    "contact.linkedin":     "LinkedIn",
    "contact.x":            "X / Twitter",

    "404.title":            "الصفحة غير موجودة.",
    "404.lede.before":      "الرابط ",
    "404.lede.after":       " لا يطابق شيئاً هنا. ربما خطأ مطبعي أو رابط قديم أو صفحة قادمة.",
    "404.back":             "← العودة للرئيسية",
    "404.browse":           "تصفّح الأعمال",
    "404.read":             "اقرأ المدوّنة",

    "modal.post.new":       "منشور جديد",
    "modal.post.edit":      "تحرير المنشور",
    "modal.close":          "إغلاق",
    "modal.field.title":    "العنوان",
    "modal.field.title_ph": "عنوان رائع…",
    "modal.field.date":     "التاريخ",
    "modal.field.tpl":      "القالب",
    "modal.field.tpl_opt":  "— استخدم قالباً —",
    "modal.field.body":     "المحتوى (Markdown)",
    "modal.field.body_ph":  "# عنوان\n\nاكتب بـ markdown…",
    "modal.field.preview":  "المعاينة",
    "modal.cancel":         "إلغاء",
    "modal.delete":         "حذف",
    "modal.save":           "حفظ المنشور",
    "modal.iframe.title":   "معاينة",
    "modal.iframe.open":    "افتح في تبويب ↗",
    "modal.iframe.dl":      "تنزيل",
    "modal.iframe.blocked": "تم حجب المعاينة من الموقع.",
    "modal.iframe.openlink":"افتحه في تبويب جديد ←",

    "dlg.ok":               "موافق",
    "dlg.cancel":           "إلغاء",
    "dlg.confirm":          "تأكيد",
    "dlg.notice":           "تنبيه",
    "dlg.input":            "إدخال",
  },
};

const SUPPORTED = ["en", "tr", "ar"];
const STORAGE_KEY = "pf:lang";
let current = "en";

export function getLang() { return current; }

export function t(key, fallback) {
  const d = DICTS[current] || DICTS.en;
  return d[key] ?? DICTS.en[key] ?? fallback ?? key;
}

function setHtmlAttrs(lang) {
  const root = document.documentElement;
  root.setAttribute("lang", lang);
  root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
}

export function applyI18n(root = document) {
  setHtmlAttrs(current);
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const spec = el.getAttribute("data-i18n-attr");
    spec.split(",").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
  // notify listeners (main.js re-renders dynamic content)
  window.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: current } }));
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) lang = "en";
  current = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  applyI18n();
}

export function initI18n() {
  let stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch {}
  let lang = stored;
  if (!lang) {
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    lang = SUPPORTED.includes(nav) ? nav : "en";
  }
  current = SUPPORTED.includes(lang) ? lang : "en";
  applyI18n();
}

export { SUPPORTED };
