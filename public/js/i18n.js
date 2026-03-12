/* ============================================================
   CivicVoice AI — Internationalisation (i18n)
   Supported languages: en (English), hi (Hindi), mr (Marathi)
   ============================================================ */

const TRANSLATIONS = {
  en: {
    /* --- Shared nav --- */
    'nav.home':      'Home',
    'nav.submit':    'Submit',
    'nav.track':     'Track',
    'nav.admin':     'Admin',
    'nav.analytics': 'Analytics',
    'nav.report':    'Report Issue',
    'nav.trackComplaint': 'Track Complaint',

    /* --- Shared footer --- */
    'footer.report':    'Report Issue',
    'footer.track':     'Track',
    'footer.admin':     'Admin',
    'footer.analytics': 'Analytics',

    /* --- Shared badge --- */
    'badge.tagline': 'For Independent Citizens',

    /* --- index.html --- */
    'index.heroTitle':   'Smart Civic Complaint Platform',
    'index.heroSub':     'Submit, track, and resolve civic issues in your city. AI-powered classification routes your complaint to the right department instantly — in your language.',
    'index.btnReport':   'Report an Issue',
    'index.btnTrack':    'Track Complaint',
    'index.stat1Label':  'Complaints Resolved',
    'index.stat2Label':  'Departments Connected',
    'index.stat3Label':  'Languages Supported',
    'index.stat4Label':  'Satisfaction Rate',
    'index.featTitle':   'Everything You Need to Be Heard',
    'index.featSub':     'Modern tools that make civic engagement effortless and effective.',
    'index.feat1Title':  'AI Classification',
    'index.feat1Desc':   'NLP engine automatically categorizes your complaint and routes it to the correct municipal department.',
    'index.feat2Title':  'Multilingual Support',
    'index.feat2Desc':   'Submit complaints in 24+ languages. Google Translate integration ensures nothing gets lost in translation.',
    'index.feat3Title':  'Voice Input',
    'index.feat3Desc':   'Speak your complaint directly using the Web Speech API. Live transcription in your chosen language.',
    'index.feat4Title':  'Real-time Tracking',
    'index.feat4Desc':   'Monitor your complaint status from submission to resolution with a live timeline dashboard.',
    'index.feat5Title':  'Image Evidence',
    'index.feat5Desc':   'Attach up to 5 photos of the issue with drag-and-drop upload. Visual evidence speeds up resolution.',
    'index.feat6Title':  'Department Routing',
    'index.feat6Desc':   'Complaints are automatically assigned to Water, Roads, Electricity, Sanitation, and more departments.',

    /* --- submit.html --- */
    'submit.pageTitle':     'Report a Civic Issue',
    'submit.pageSub':       'Describe the problem in your language. Our AI will classify and route it to the correct department.',
    'submit.submitting':    'Submitting your complaint…',
    'submit.successTitle':  'Complaint Submitted Successfully',
    'submit.successSub':    'Your tracking ID is:',
    'submit.copyBtn':       'Copy',
    'submit.trackBtn':      'Track This Complaint',
    'submit.anotherBtn':    'Submit Another',
    'submit.labelTitle':    'Complaint Title',
    'submit.optTitle':      '(optional)',
    'submit.labelDesc':     'Description',
    'submit.req':           '*',
    'submit.voiceBtn':      'Voice Input',
    'submit.listening':     'Listening…',
    'submit.labelName':     'Your Name',
    'submit.optName':       '(optional)',
    'submit.labelEmail':    'Email',
    'submit.optEmail':      '(optional)',
    'submit.labelPhone':    'Phone',
    'submit.optPhone':      '(optional)',
    'submit.labelLocation': 'Location / Address',
    'submit.detectBtn':     'Detect Location',
    'submit.labelLang':     'Language of Complaint',
    'submit.labelPhotos':   'Attach Photos',
    'submit.optPhotos':     '(optional, max 5)',
    'submit.dropText':      'Drag & drop images here, or',
    'submit.dropLink':      'click to browse',
    'submit.dropHint':      'PNG, JPG, WEBP up to 10MB each',
    'submit.submitBtn':     'Submit Complaint',

    /* Placeholders */
    'ph.title':       'e.g. Pothole on Main Street near Park',
    'ph.description': 'Describe the civic issue in detail…',
    'ph.name':        'Full Name',
    'ph.email':       'you@example.com',
    'ph.phone':       '+91 00000 00000',
    'ph.location':    'Enter full address or landmark',

    /* --- track.html --- */
    'track.pageTitle':    'Track Your Complaint',
    'track.pageSub':      'Enter your tracking ID to view the current status and history of your complaint.',
    'track.placeholder':  'CV-20250312-XXXXXXXX',
    'track.trackBtn':     'Track',
    'track.looking':      'Looking up your complaint…',
    'track.notFoundTitle':'Complaint Not Found',
    'track.notFoundDesc': "We couldn't find a complaint with that tracking ID. Please double-check the ID and try again.",
    'track.reportNew':    'Report a New Issue',
    'track.metaId':       'Tracking ID',
    'track.metaCategory': 'Category',
    'track.metaDept':     'Department',
    'track.metaDate':     'Submitted',
    'track.detailTitle':  'Complaint Details',
    'track.imagesTitle':  'Attached Images',
    'track.timelineTitle':'Status Timeline',

    /* --- admin.html --- */
    'admin.title':        'Admin Dashboard',
    'admin.sub':          'Manage and respond to civic complaints.',
    'admin.refreshBtn':   'Refresh',
    'admin.searchPh':     'Search by ID, title, category…',
    'admin.allStatuses':  'All Statuses',
    'admin.allCategories':'All Categories',
    'admin.allPriorities':'All Priorities',
    'admin.colId':        'ID',
    'admin.colTitle':     'Title / Description',
    'admin.colCategory':  'Category',
    'admin.colDept':      'Department',
    'admin.colPriority':  'Priority',
    'admin.colStatus':    'Status',
    'admin.colDate':      'Date',
    'admin.colImage':     'Image',
    'admin.colActions':   'Actions',
    'admin.loading':      'Loading complaints…',

    /* --- analytics.html --- */
    'analytics.title':     'Analytics Dashboard',
    'analytics.sub':       'Insights and trends for civic complaints.',
    'analytics.refreshBtn':'Refresh',
    'analytics.catChart':  'Complaints by Category',
    'analytics.priChart':  'Complaints by Priority',
    'analytics.deptChart': 'Complaints by Department',
    'analytics.monthChart':'Monthly Trends',
    'analytics.locTitle':  'Location Hotspots',
  },

  hi: {
    /* --- Shared nav --- */
    'nav.home':      'होम',
    'nav.submit':    'शिकायत',
    'nav.track':     'ट्रैक',
    'nav.admin':     'प्रशासन',
    'nav.analytics': 'विश्लेषण',
    'nav.report':    'शिकायत दर्ज करें',
    'nav.trackComplaint': 'शिकायत ट्रैक करें',

    /* --- Shared footer --- */
    'footer.report':    'शिकायत दर्ज करें',
    'footer.track':     'ट्रैक',
    'footer.admin':     'प्रशासन',
    'footer.analytics': 'विश्लेषण',

    /* --- Shared badge --- */
    'badge.tagline': 'स्वतंत्र नागरिकों के लिए',

    /* --- index.html --- */
    'index.heroTitle':   'स्मार्ट नागरिक शिकायत मंच',
    'index.heroSub':     'अपने शहर की नागरिक समस्याएं दर्ज करें, ट्रैक करें और हल पाएं। AI-आधारित वर्गीकरण तुरंत आपकी शिकायत सही विभाग तक पहुंचाता है — आपकी भाषा में।',
    'index.btnReport':   'शिकायत दर्ज करें',
    'index.btnTrack':    'शिकायत ट्रैक करें',
    'index.stat1Label':  'शिकायतें हल हुईं',
    'index.stat2Label':  'विभाग जुड़े',
    'index.stat3Label':  'समर्थित भाषाएं',
    'index.stat4Label':  'संतुष्टि दर',
    'index.featTitle':   'सुने जाने के लिए सब कुछ',
    'index.featSub':     'आधुनिक उपकरण जो नागरिक भागीदारी को सरल और प्रभावी बनाते हैं।',
    'index.feat1Title':  'AI वर्गीकरण',
    'index.feat1Desc':   'NLP इंजन स्वचालित रूप से आपकी शिकायत को वर्गीकृत करता है और उसे सही नगर विभाग को भेजता है।',
    'index.feat2Title':  'बहुभाषी समर्थन',
    'index.feat2Desc':   '24+ भाषाओं में शिकायतें दर्ज करें। Google Translate एकीकरण सुनिश्चित करता है कि कुछ भी गुम न हो।',
    'index.feat3Title':  'वॉयस इनपुट',
    'index.feat3Desc':   'Web Speech API का उपयोग कर सीधे बोलकर शिकायत दर्ज करें। अपनी चुनी हुई भाषा में लाइव ट्रांसक्रिप्शन।',
    'index.feat4Title':  'रियल-टाइम ट्रैकिंग',
    'index.feat4Desc':   'लाइव टाइमलाइन डैशबोर्ड के साथ सबमिशन से समाधान तक अपनी शिकायत की स्थिति देखें।',
    'index.feat5Title':  'फोटो साक्ष्य',
    'index.feat5Desc':   'ड्रैग-एंड-ड्रॉप अपलोड के साथ 5 फोटो तक संलग्न करें। दृश्य साक्ष्य समाधान तेज करता है।',
    'index.feat6Title':  'विभाग रूटिंग',
    'index.feat6Desc':   'शिकायतें स्वचालित रूप से जल, सड़क, बिजली, सफाई और अन्य विभागों को सौंपी जाती हैं।',

    /* --- submit.html --- */
    'submit.pageTitle':     'नागरिक समस्या दर्ज करें',
    'submit.pageSub':       'समस्या को अपनी भाषा में बताएं। हमारा AI इसे वर्गीकृत करके सही विभाग को भेजेगा।',
    'submit.submitting':    'आपकी शिकायत सबमिट हो रही है…',
    'submit.successTitle':  'शिकायत सफलतापूर्वक सबमिट हुई',
    'submit.successSub':    'आपका ट्रैकिंग ID है:',
    'submit.copyBtn':       'कॉपी करें',
    'submit.trackBtn':      'इस शिकायत को ट्रैक करें',
    'submit.anotherBtn':    'एक और सबमिट करें',
    'submit.labelTitle':    'शिकायत का शीर्षक',
    'submit.optTitle':      '(वैकल्पिक)',
    'submit.labelDesc':     'विवरण',
    'submit.req':           '*',
    'submit.voiceBtn':      'आवाज रिकॉर्ड करें',
    'submit.listening':     'सुन रहे हैं…',
    'submit.labelName':     'आपका नाम',
    'submit.optName':       '(वैकल्पिक)',
    'submit.labelEmail':    'ईमेल',
    'submit.optEmail':      '(वैकल्पिक)',
    'submit.labelPhone':    'फोन',
    'submit.optPhone':      '(वैकल्पिक)',
    'submit.labelLocation': 'स्थान / पता',
    'submit.detectBtn':     'स्थान पता करें',
    'submit.labelLang':     'शिकायत की भाषा',
    'submit.labelPhotos':   'फोटो संलग्न करें',
    'submit.optPhotos':     '(वैकल्पिक, अधिकतम 5)',
    'submit.dropText':      'यहाँ इमेज ड्रैग करें, या',
    'submit.dropLink':      'ब्राउज़ करने के लिए क्लिक करें',
    'submit.dropHint':      'PNG, JPG, WEBP प्रत्येक 10MB तक',
    'submit.submitBtn':     'जमा करें',

    /* Placeholders */
    'ph.title':       'जैसे: मुख्य सड़क पर गड्ढा',
    'ph.description': 'नागरिक समस्या का विस्तार से वर्णन करें…',
    'ph.name':        'पूरा नाम',
    'ph.email':       'you@example.com',
    'ph.phone':       '+91 00000 00000',
    'ph.location':    'पूरा पता या लैंडमार्क दर्ज करें',

    /* --- track.html --- */
    'track.pageTitle':    'अपनी शिकायत ट्रैक करें',
    'track.pageSub':      'अपनी शिकायत की वर्तमान स्थिति और इतिहास देखने के लिए ट्रैकिंग ID दर्ज करें।',
    'track.placeholder':  'CV-20250312-XXXXXXXX',
    'track.trackBtn':     'ट्रैक करें',
    'track.looking':      'आपकी शिकायत खोजी जा रही है…',
    'track.notFoundTitle':'शिकायत नहीं मिली',
    'track.notFoundDesc': 'उस ट्रैकिंग ID से कोई शिकायत नहीं मिली। कृपया ID जांचें और पुनः प्रयास करें।',
    'track.reportNew':    'नई शिकायत दर्ज करें',
    'track.metaId':       'ट्रैकिंग ID',
    'track.metaCategory': 'श्रेणी',
    'track.metaDept':     'विभाग',
    'track.metaDate':     'सबमिट किया',
    'track.detailTitle':  'शिकायत का विवरण',
    'track.imagesTitle':  'संलग्न तस्वीरें',
    'track.timelineTitle':'स्थिति टाइमलाइन',

    /* --- admin.html --- */
    'admin.title':        'प्रशासन डैशबोर्ड',
    'admin.sub':          'नागरिक शिकायतों को प्रबंधित करें और जवाब दें।',
    'admin.refreshBtn':   'रिफ्रेश करें',
    'admin.searchPh':     'ID, शीर्षक, श्रेणी से खोजें…',
    'admin.allStatuses':  'सभी स्थितियाँ',
    'admin.allCategories':'सभी श्रेणियाँ',
    'admin.allPriorities':'सभी प्राथमिकताएं',
    'admin.colId':        'ID',
    'admin.colTitle':     'शीर्षक / विवरण',
    'admin.colCategory':  'श्रेणी',
    'admin.colDept':      'विभाग',
    'admin.colPriority':  'प्राथमिकता',
    'admin.colStatus':    'स्थिति',
    'admin.colDate':      'तारीख',
    'admin.colImage':     'तस्वीर',
    'admin.colActions':   'कार्रवाई',
    'admin.loading':      'शिकायतें लोड हो रही हैं…',

    /* --- analytics.html --- */
    'analytics.title':     'विश्लेषण डैशबोर्ड',
    'analytics.sub':       'नागरिक शिकायतों की जानकारी और रुझान।',
    'analytics.refreshBtn':'रिफ्रेश करें',
    'analytics.catChart':  'श्रेणी के अनुसार शिकायतें',
    'analytics.priChart':  'प्राथमिकता के अनुसार शिकायतें',
    'analytics.deptChart': 'विभाग के अनुसार शिकायतें',
    'analytics.monthChart':'मासिक रुझान',
    'analytics.locTitle':  'स्थान हॉटस्पॉट',
  },

  mr: {
    /* --- Shared nav --- */
    'nav.home':      'मुखपृष्ठ',
    'nav.submit':    'तक्रार',
    'nav.track':     'ट्रॅक',
    'nav.admin':     'प्रशासन',
    'nav.analytics': 'विश्लेषण',
    'nav.report':    'तक्रार नोंदवा',
    'nav.trackComplaint': 'तक्रार ट्रॅक करा',

    /* --- Shared footer --- */
    'footer.report':    'तक्रार नोंदवा',
    'footer.track':     'ट्रॅक',
    'footer.admin':     'प्रशासन',
    'footer.analytics': 'विश्लेषण',

    /* --- Shared badge --- */
    'badge.tagline': 'स्वतंत्र नागरिकांसाठी',

    /* --- index.html --- */
    'index.heroTitle':   'स्मार्ट नागरी तक्रार व्यासपीठ',
    'index.heroSub':     'तुमच्या शहरातील नागरी समस्या नोंदवा, ट्रॅक करा आणि सोडवा. AI-आधारित वर्गीकरण तुमची तक्रार लगेच योग्य विभागाकडे पाठवते — तुमच्या भाषेत.',
    'index.btnReport':   'तक्रार नोंदवा',
    'index.btnTrack':    'तक्रार ट्रॅक करा',
    'index.stat1Label':  'तक्रारी सोडवल्या',
    'index.stat2Label':  'विभाग जोडले',
    'index.stat3Label':  'समर्थित भाषा',
    'index.stat4Label':  'समाधान दर',
    'index.featTitle':   'ऐकले जाण्यासाठी सर्वकाही',
    'index.featSub':     'आधुनिक साधने जी नागरी सहभाग सहज आणि प्रभावी बनवतात.',
    'index.feat1Title':  'AI वर्गीकरण',
    'index.feat1Desc':   'NLP इंजन आपोआप तुमची तक्रार वर्गीकृत करते आणि योग्य महानगर विभागाकडे पाठवते.',
    'index.feat2Title':  'बहुभाषिक समर्थन',
    'index.feat2Desc':   '24+ भाषांमध्ये तक्रारी नोंदवा. Google Translate एकत्रीकरण काहीही हरवणार नाही याची खात्री करते.',
    'index.feat3Title':  'व्हॉइस इनपुट',
    'index.feat3Desc':   'Web Speech API वापरून थेट बोलून तक्रार नोंदवा. तुमच्या निवडलेल्या भाषेत थेट लिप्यंतरण.',
    'index.feat4Title':  'रिअल-टाइम ट्रॅकिंग',
    'index.feat4Desc':   'लाइव्ह टाइमलाइन डॅशबोर्डसह सबमिशनपासून निराकरणापर्यंत तुमच्या तक्रारीची स्थिती पाहा.',
    'index.feat5Title':  'फोटो पुरावा',
    'index.feat5Desc':   'ड्रॅग-अँड-ड्रॉप अपलोडसह 5 फोटोपर्यंत जोडा. दृश्य पुरावा निराकरण जलद करतो.',
    'index.feat6Title':  'विभाग रूटिंग',
    'index.feat6Desc':   'तक्रारी आपोआप पाणी, रस्ते, वीज, स्वच्छता आणि इतर विभागांना नियुक्त केल्या जातात.',

    /* --- submit.html --- */
    'submit.pageTitle':     'नागरी समस्या नोंदवा',
    'submit.pageSub':       'समस्या तुमच्या भाषेत सांगा. आमचे AI ते वर्गीकृत करून योग्य विभागाकडे पाठवेल.',
    'submit.submitting':    'तुमची तक्रार सबमिट होत आहे…',
    'submit.successTitle':  'तक्रार यशस्वीरित्या सबमिट झाली',
    'submit.successSub':    'तुमचा ट्रॅकिंग ID आहे:',
    'submit.copyBtn':       'कॉपी करा',
    'submit.trackBtn':      'ही तक्रार ट्रॅक करा',
    'submit.anotherBtn':    'आणखी एक सबमिट करा',
    'submit.labelTitle':    'तक्रारीचे शीर्षक',
    'submit.optTitle':      '(पर्यायी)',
    'submit.labelDesc':     'वर्णन',
    'submit.req':           '*',
    'submit.voiceBtn':      'आवाज रेकॉर्ड करा',
    'submit.listening':     'ऐकत आहे…',
    'submit.labelName':     'तुमचे नाव',
    'submit.optName':       '(पर्यायी)',
    'submit.labelEmail':    'ईमेल',
    'submit.optEmail':      '(पर्यायी)',
    'submit.labelPhone':    'फोन',
    'submit.optPhone':      '(पर्यायी)',
    'submit.labelLocation': 'ठिकाण / पत्ता',
    'submit.detectBtn':     'ठिकाण शोधा',
    'submit.labelLang':     'तक्रारीची भाषा',
    'submit.labelPhotos':   'फोटो जोडा',
    'submit.optPhotos':     '(पर्यायी, जास्तीत जास्त 5)',
    'submit.dropText':      'येथे इमेज ड्रॅग करा, किंवा',
    'submit.dropLink':      'ब्राउझ करण्यासाठी क्लिक करा',
    'submit.dropHint':      'PNG, JPG, WEBP प्रत्येकी 10MB पर्यंत',
    'submit.submitBtn':     'सबमिट करा',

    /* Placeholders */
    'ph.title':       'उदा. मुख्य रस्त्यावर खड्डा',
    'ph.description': 'नागरी समस्येचे सविस्तर वर्णन करा…',
    'ph.name':        'पूर्ण नाव',
    'ph.email':       'you@example.com',
    'ph.phone':       '+91 00000 00000',
    'ph.location':    'पूर्ण पत्ता किंवा खूण प्रविष्ट करा',

    /* --- track.html --- */
    'track.pageTitle':    'तुमची तक्रार ट्रॅक करा',
    'track.pageSub':      'तुमच्या तक्रारीची सद्यस्थिती आणि इतिहास पाहण्यासाठी ट्रॅकिंग ID प्रविष्ट करा.',
    'track.placeholder':  'CV-20250312-XXXXXXXX',
    'track.trackBtn':     'ट्रॅक करा',
    'track.looking':      'तुमची तक्रार शोधत आहे…',
    'track.notFoundTitle':'तक्रार सापडली नाही',
    'track.notFoundDesc': 'त्या ट्रॅकिंग ID सह कोणतीही तक्रार सापडली नाही. कृपया ID तपासा आणि पुन्हा प्रयत्न करा.',
    'track.reportNew':    'नवीन तक्रार नोंदवा',
    'track.metaId':       'ट्रॅकिंग ID',
    'track.metaCategory': 'श्रेणी',
    'track.metaDept':     'विभाग',
    'track.metaDate':     'सबमिट केले',
    'track.detailTitle':  'तक्रारीचे तपशील',
    'track.imagesTitle':  'जोडलेले फोटो',
    'track.timelineTitle':'स्थिती टाइमलाइन',

    /* --- admin.html --- */
    'admin.title':        'प्रशासन डॅशबोर्ड',
    'admin.sub':          'नागरी तक्रारी व्यवस्थापित करा आणि उत्तर द्या.',
    'admin.refreshBtn':   'रिफ्रेश करा',
    'admin.searchPh':     'ID, शीर्षक, श्रेणीनुसार शोधा…',
    'admin.allStatuses':  'सर्व स्थिती',
    'admin.allCategories':'सर्व श्रेणी',
    'admin.allPriorities':'सर्व प्राधान्यक्रम',
    'admin.colId':        'ID',
    'admin.colTitle':     'शीर्षक / वर्णन',
    'admin.colCategory':  'श्रेणी',
    'admin.colDept':      'विभाग',
    'admin.colPriority':  'प्राधान्यक्रम',
    'admin.colStatus':    'स्थिती',
    'admin.colDate':      'तारीख',
    'admin.colImage':     'फोटो',
    'admin.colActions':   'कृती',
    'admin.loading':      'तक्रारी लोड होत आहेत…',

    /* --- analytics.html --- */
    'analytics.title':     'विश्लेषण डॅशबोर्ड',
    'analytics.sub':       'नागरी तक्रारींसाठी अंतर्दृष्टी आणि ट्रेंड.',
    'analytics.refreshBtn':'रिफ्रेश करा',
    'analytics.catChart':  'श्रेणीनुसार तक्रारी',
    'analytics.priChart':  'प्राधान्यक्रमानुसार तक्रारी',
    'analytics.deptChart': 'विभागानुसार तक्रारी',
    'analytics.monthChart':'मासिक ट्रेंड',
    'analytics.locTitle':  'स्थान हॉटस्पॉट',
  }
};

/* Voice recognition language map */
var VOICE_LANG_MAP = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

/**
 * Apply the given language to the page.
 * @param {string} lang - 'en' | 'hi' | 'mr'
 */
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;

  /* 1. Persist selection */
  localStorage.setItem('cv_lang', lang);

  /* 2. Translate text nodes */
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var val = TRANSLATIONS[lang][key];
    if (val !== undefined) {
      el.textContent = val;
    }
  });

  /* 3. Translate placeholder attributes */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    var val = TRANSLATIONS[lang][key];
    if (val !== undefined) el.setAttribute('placeholder', val);
  });

  /* 4. Update active button styling */
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  /* 5. Update voice recognition language if VoiceRecorder is active */
  if (window.voiceRecorder && typeof window.voiceRecorder.setLang === 'function') {
    window.voiceRecorder.setLang(VOICE_LANG_MAP[lang] || 'en-IN');
  }
}

/* Auto-apply on page load and wire up buttons */
(function() {
  var saved = localStorage.getItem('cv_lang') || 'en';

  /* Attach event listeners once DOM is ready (this script runs at end of body) */
  function init() {
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        setLanguage(btn.getAttribute('data-lang'));
      });
    });
    setLanguage(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

