/**
 * CivicVoice AI — Internationalization (i18n)
 * Supports: English (en), Hindi (hi), Marathi (mr)
 */

const translations = {
  en: {
    // Nav
    nav_home: 'Home',
    nav_submit: 'Report Issue',
    nav_track: 'Track Complaint',
    nav_admin: 'Admin',
    nav_analytics: 'Analytics',

    // Index — Hero
    hero_title: 'Smart Civic Complaint Platform',
    hero_sub: 'Submit, track, and resolve civic issues in your city. AI-powered classification routes your complaint to the right department instantly — in your language.',
    btn_report_issue: 'Report an Issue',
    btn_track_complaint: 'Track Complaint',

    // Index — Stats
    stat_resolved: 'Complaints Resolved',
    stat_departments: 'Departments Connected',
    stat_languages: 'Languages Supported',
    stat_satisfaction: 'Satisfaction Rate',

    // Index — Features section
    section_title: 'Everything You Need to Be Heard',
    section_sub: 'Modern tools that make civic engagement effortless and effective.',
    feat_ai_title: 'AI Classification',
    feat_ai_desc: 'NLP engine automatically categorizes your complaint and routes it to the correct municipal department.',
    feat_multi_title: 'Multilingual Support',
    feat_multi_desc: 'Submit complaints in 24+ languages. Google Translate integration ensures nothing gets lost in translation.',
    feat_voice_title: 'Voice Input',
    feat_voice_desc: 'Speak your complaint directly using the Web Speech API. Live transcription in your chosen language.',
    feat_track_title: 'Real-time Tracking',
    feat_track_desc: 'Monitor your complaint status from submission to resolution with a live timeline dashboard.',
    feat_image_title: 'Image Evidence',
    feat_image_desc: 'Attach up to 5 photos of the issue with drag-and-drop upload. Visual evidence speeds up resolution.',
    feat_dept_title: 'Department Routing',
    feat_dept_desc: 'Complaints are automatically assigned to Water, Roads, Electricity, Sanitation, and more departments.',

    // Index — Footer
    footer_rights: '© 2025 CivicVoice AI. All rights reserved.',
    footer_report: 'Report Issue',
    footer_track: 'Track',
    footer_admin: 'Admin',
    footer_analytics: 'Analytics',

    // Submit page
    submit_page_title: 'Report a Civic Issue',
    submit_page_sub: 'Describe the problem in your language. Our AI will classify and route it to the correct department.',
    label_comp_title: 'Complaint Title',
    label_optional: '(optional)',
    label_required: '*',
    placeholder_comp_title: 'e.g. Pothole on Main Street near Park',
    label_description: 'Description',
    voice_input: 'Voice Input',
    placeholder_description: 'Describe the civic issue in detail…',
    listening: 'Listening…',
    label_name: 'Your Name',
    placeholder_name: 'Full Name',
    label_email: 'Email',
    placeholder_email: 'you@example.com',
    label_phone: 'Phone',
    placeholder_phone: '+91 00000 00000',
    label_location: 'Location / Address',
    detect_location: 'Detect Location',
    placeholder_location: 'Enter full address or landmark',
    label_language: 'Language of Complaint',
    label_photos: 'Attach Photos',
    photos_hint: '(optional, max 5)',
    drop_zone_text: 'Drag & drop images here, or',
    drop_zone_link: 'click to browse',
    drop_zone_hint: 'PNG, JPG, WEBP up to 10MB each',
    btn_submit: 'Submit Complaint',
    submitting: 'Submitting your complaint…',
    success_title: 'Complaint Submitted Successfully',
    success_sub: 'Your tracking ID is:',
    copy_btn: 'Copy',
    btn_track_this: 'Track This Complaint',
    btn_submit_another: 'Submit Another',

    // Track page
    track_page_title: 'Track Your Complaint',
    track_page_sub: 'Enter your tracking ID to view the current status and history of your complaint.',
    btn_track: 'Track',
    tracking_id_placeholder: 'CV-20250312-XXXXXXXX',
    looking_up: 'Looking up your complaint…',
    not_found_title: 'Complaint Not Found',
    not_found_desc: "We couldn't find a complaint with that tracking ID. Please double-check the ID and try again.",
    btn_report_new: 'Report a New Issue',
    meta_tracking_id: 'Tracking ID',
    meta_category: 'Category',
    meta_department: 'Department',
    meta_submitted: 'Submitted',
    card_complaint_details: 'Complaint Details',
    card_attached_images: 'Attached Images',
    card_status_timeline: 'Status Timeline',

    // Admin page
    admin_title: 'Admin Dashboard',
    admin_sub: 'Manage and respond to civic complaints.',
    btn_refresh: 'Refresh',
    placeholder_search: 'Search by ID, title, category…',
    filter_all_statuses: 'All Statuses',
    filter_submitted: 'Submitted',
    filter_under_review: 'Under Review',
    filter_assigned: 'Assigned',
    filter_in_progress: 'In Progress',
    filter_escalated: 'Escalated',
    filter_resolved: 'Resolved',
    filter_closed: 'Closed',
    filter_rejected: 'Rejected',
    filter_all_categories: 'All Categories',
    filter_water: 'Water Supply',
    filter_garbage: 'Garbage',
    filter_road: 'Road Damage',
    filter_electricity: 'Electricity',
    filter_parking: 'Illegal Parking',
    filter_animals: 'Street Animals',
    filter_washroom: 'Public Washroom',
    filter_all_priorities: 'All Priorities',
    filter_critical: 'Critical',
    filter_high: 'High',
    filter_medium: 'Medium',
    filter_low: 'Low',
    th_id: 'ID',
    th_title: 'Title / Description',
    th_category: 'Category',
    th_department: 'Department',
    th_priority: 'Priority',
    th_status: 'Status',
    th_date: 'Date',
    th_image: 'Image',
    th_actions: 'Actions',
    loading_complaints: 'Loading complaints…',

    // Analytics page
    analytics_title: 'Analytics Dashboard',
    analytics_sub: 'Insights and trends for civic complaints.',
    chart_by_category: 'Complaints by Category',
    chart_by_priority: 'Complaints by Priority',
    chart_by_department: 'Complaints by Department',
    chart_monthly: 'Monthly Trends',
    chart_location: 'Location Hotspots',
  },

  hi: {
    // Nav
    nav_home: 'होम',
    nav_submit: 'शिकायत दर्ज करें',
    nav_track: 'शिकायत ट्रैक करें',
    nav_admin: 'एडमिन',
    nav_analytics: 'विश्लेषण',

    // Index — Hero
    hero_title: 'स्मार्ट नागरिक शिकायत मंच',
    hero_sub: 'अपने शहर की नागरिक समस्याओं को दर्ज करें, ट्रैक करें और समाधान पाएं। AI वर्गीकरण आपकी शिकायत को तुरंत सही विभाग तक पहुंचाता है — आपकी भाषा में।',
    btn_report_issue: 'शिकायत दर्ज करें',
    btn_track_complaint: 'शिकायत ट्रैक करें',

    // Index — Stats
    stat_resolved: 'शिकायतें हल हुईं',
    stat_departments: 'विभाग जुड़े',
    stat_languages: 'भाषाएं समर्थित',
    stat_satisfaction: 'संतुष्टि दर',

    // Index — Features section
    section_title: 'सुने जाने के लिए सब कुछ',
    section_sub: 'आधुनिक उपकरण जो नागरिक भागीदारी को सहज और प्रभावी बनाते हैं।',
    feat_ai_title: 'AI वर्गीकरण',
    feat_ai_desc: 'NLP इंजन स्वचालित रूप से आपकी शिकायत को वर्गीकृत करता है और सही नगर निगम विभाग तक पहुंचाता है।',
    feat_multi_title: 'बहुभाषी समर्थन',
    feat_multi_desc: '24+ भाषाओं में शिकायत दर्ज करें। Google Translate इंटीग्रेशन सुनिश्चित करता है कि कुछ भी खो न जाए।',
    feat_voice_title: 'वॉयस इनपुट',
    feat_voice_desc: 'Web Speech API का उपयोग करके सीधे अपनी शिकायत बोलें। आपकी चुनी हुई भाषा में लाइव ट्रांसक्रिप्शन।',
    feat_track_title: 'रियल-टाइम ट्रैकिंग',
    feat_track_desc: 'जमा करने से समाधान तक अपनी शिकायत की स्थिति की लाइव टाइमलाइन डैशबोर्ड से निगरानी करें।',
    feat_image_title: 'छवि साक्ष्य',
    feat_image_desc: 'ड्रैग-एंड-ड्रॉप अपलोड के साथ समस्या की 5 तक फ़ोटो संलग्न करें। दृश्य साक्ष्य समाधान को तेज करता है।',
    feat_dept_title: 'विभाग रूटिंग',
    feat_dept_desc: 'शिकायतें स्वचालित रूप से जल, सड़क, बिजली, स्वच्छता और अन्य विभागों को सौंपी जाती हैं।',

    // Index — Footer
    footer_rights: '© 2025 CivicVoice AI. सर्वाधिकार सुरक्षित।',
    footer_report: 'शिकायत दर्ज करें',
    footer_track: 'ट्रैक',
    footer_admin: 'एडमिन',
    footer_analytics: 'विश्लेषण',

    // Submit page
    submit_page_title: 'नागरिक समस्या दर्ज करें',
    submit_page_sub: 'समस्या को अपनी भाषा में बताएं। हमारा AI इसे वर्गीकृत करके सही विभाग तक पहुंचाएगा।',
    label_comp_title: 'शिकायत का शीर्षक',
    label_optional: '(वैकल्पिक)',
    label_required: '*',
    placeholder_comp_title: 'जैसे: पार्क के पास मुख्य सड़क पर गड्ढा',
    label_description: 'विवरण',
    voice_input: 'वॉयस इनपुट',
    placeholder_description: 'नागरिक समस्या का विस्तार से वर्णन करें…',
    listening: 'सुन रहा है…',
    label_name: 'आपका नाम',
    placeholder_name: 'पूरा नाम',
    label_email: 'ईमेल',
    placeholder_email: 'you@example.com',
    label_phone: 'फ़ोन',
    placeholder_phone: '+91 00000 00000',
    label_location: 'स्थान / पता',
    detect_location: 'स्थान पहचानें',
    placeholder_location: 'पूरा पता या लैंडमार्क दर्ज करें',
    label_language: 'शिकायत की भाषा',
    label_photos: 'फ़ोटो संलग्न करें',
    photos_hint: '(वैकल्पिक, अधिकतम 5)',
    drop_zone_text: 'यहाँ छवियां ड्रैग & ड्रॉप करें, या',
    drop_zone_link: 'ब्राउज़ करने के लिए क्लिक करें',
    drop_zone_hint: 'PNG, JPG, WEBP प्रत्येक 10MB तक',
    btn_submit: 'शिकायत दर्ज करें',
    submitting: 'आपकी शिकायत जमा हो रही है…',
    success_title: 'शिकायत सफलतापूर्वक दर्ज हुई',
    success_sub: 'आपकी ट्रैकिंग ID है:',
    copy_btn: 'कॉपी करें',
    btn_track_this: 'इस शिकायत को ट्रैक करें',
    btn_submit_another: 'और शिकायत दर्ज करें',

    // Track page
    track_page_title: 'अपनी शिकायत ट्रैक करें',
    track_page_sub: 'अपनी शिकायत की वर्तमान स्थिति और इतिहास देखने के लिए ट्रैकिंग ID दर्ज करें।',
    btn_track: 'ट्रैक करें',
    tracking_id_placeholder: 'CV-20250312-XXXXXXXX',
    looking_up: 'आपकी शिकायत खोजी जा रही है…',
    not_found_title: 'शिकायत नहीं मिली',
    not_found_desc: 'उस ट्रैकिंग ID से कोई शिकायत नहीं मिली। कृपया ID दोबारा जांचें और पुनः प्रयास करें।',
    btn_report_new: 'नई समस्या दर्ज करें',
    meta_tracking_id: 'ट्रैकिंग ID',
    meta_category: 'श्रेणी',
    meta_department: 'विभाग',
    meta_submitted: 'दर्ज तिथि',
    card_complaint_details: 'शिकायत विवरण',
    card_attached_images: 'संलग्न छवियां',
    card_status_timeline: 'स्थिति टाइमलाइन',

    // Admin page
    admin_title: 'एडमिन डैशबोर्ड',
    admin_sub: 'नागरिक शिकायतों का प्रबंधन और उत्तर दें।',
    btn_refresh: 'रीफ्रेश',
    placeholder_search: 'ID, शीर्षक, श्रेणी से खोजें…',
    filter_all_statuses: 'सभी स्थितियां',
    filter_submitted: 'दर्ज',
    filter_under_review: 'समीक्षाधीन',
    filter_assigned: 'आवंटित',
    filter_in_progress: 'प्रगति में',
    filter_escalated: 'एस्केलेटेड',
    filter_resolved: 'हल',
    filter_closed: 'बंद',
    filter_rejected: 'अस्वीकृत',
    filter_all_categories: 'सभी श्रेणियां',
    filter_water: 'जल आपूर्ति',
    filter_garbage: 'कचरा',
    filter_road: 'सड़क क्षति',
    filter_electricity: 'बिजली',
    filter_parking: 'अवैध पार्किंग',
    filter_animals: 'सड़क पर जानवर',
    filter_washroom: 'सार्वजनिक शौचालय',
    filter_all_priorities: 'सभी प्राथमिकताएं',
    filter_critical: 'अत्यावश्यक',
    filter_high: 'उच्च',
    filter_medium: 'मध्यम',
    filter_low: 'निम्न',
    th_id: 'ID',
    th_title: 'शीर्षक / विवरण',
    th_category: 'श्रेणी',
    th_department: 'विभाग',
    th_priority: 'प्राथमिकता',
    th_status: 'स्थिति',
    th_date: 'तिथि',
    th_image: 'छवि',
    th_actions: 'कार्रवाई',
    loading_complaints: 'शिकायतें लोड हो रही हैं…',

    // Analytics page
    analytics_title: 'विश्लेषण डैशबोर्ड',
    analytics_sub: 'नागरिक शिकायतों की अंतर्दृष्टि और रुझान।',
    chart_by_category: 'श्रेणी के अनुसार शिकायतें',
    chart_by_priority: 'प्राथमिकता के अनुसार शिकायतें',
    chart_by_department: 'विभाग के अनुसार शिकायतें',
    chart_monthly: 'मासिक रुझान',
    chart_location: 'स्थान हॉटस्पॉट',
  },

  mr: {
    // Nav
    nav_home: 'मुखपृष्ठ',
    nav_submit: 'तक्रार नोंदवा',
    nav_track: 'तक्रार ट्रॅक करा',
    nav_admin: 'प्रशासन',
    nav_analytics: 'विश्लेषण',

    // Index — Hero
    hero_title: 'स्मार्ट नागरी तक्रार व्यासपीठ',
    hero_sub: 'तुमच्या शहरातील नागरी समस्या नोंदवा, ट्रॅक करा आणि निराकरण मिळवा। AI वर्गीकरण तुमची तक्रार त्वरित योग्य विभागाकडे पाठवते — तुमच्या भाषेत।',
    btn_report_issue: 'तक्रार नोंदवा',
    btn_track_complaint: 'तक्रार ट्रॅक करा',

    // Index — Stats
    stat_resolved: 'तक्रारी सोडवल्या',
    stat_departments: 'विभाग जोडलेले',
    stat_languages: 'भाषा समर्थित',
    stat_satisfaction: 'समाधान दर',

    // Index — Features section
    section_title: 'ऐकले जाण्यासाठी सर्व काही',
    section_sub: 'आधुनिक साधने जी नागरी सहभाग सहज आणि प्रभावी बनवतात।',
    feat_ai_title: 'AI वर्गीकरण',
    feat_ai_desc: 'NLP इंजिन स्वयंचलितपणे तुमची तक्रार वर्गीकृत करते आणि योग्य महापालिका विभागाकडे पाठवते।',
    feat_multi_title: 'बहुभाषिक समर्थन',
    feat_multi_desc: '24+ भाषांमध्ये तक्रारी नोंदवा। Google Translate इंटिग्रेशन सुनिश्चित करते की काहीही गमावले जाणार नाही।',
    feat_voice_title: 'व्हॉइस इनपुट',
    feat_voice_desc: 'Web Speech API वापरून थेट तुमची तक्रार बोला। तुमच्या निवडलेल्या भाषेत लाइव्ह ट्रान्सक्रिप्शन।',
    feat_track_title: 'रिअल-टाइम ट्रॅकिंग',
    feat_track_desc: 'सादर केल्यापासून निराकरणापर्यंत लाइव्ह टाइमलाइन डॅशबोर्डसह तुमच्या तक्रारीची स्थिती पहा।',
    feat_image_title: 'छायाचित्र पुरावा',
    feat_image_desc: 'ड्रॅग-अँड-ड्रॉप अपलोडसह समस्येचे 5 पर्यंत फोटो जोडा। दृश्य पुरावा निराकरण जलद करतो।',
    feat_dept_title: 'विभाग रूटिंग',
    feat_dept_desc: 'तक्रारी स्वयंचलितपणे जल, रस्ते, वीज, स्वच्छता आणि इतर विभागांना नियुक्त केल्या जातात।',

    // Index — Footer
    footer_rights: '© 2025 CivicVoice AI. सर्व हक्क राखीव।',
    footer_report: 'तक्रार नोंदवा',
    footer_track: 'ट्रॅक',
    footer_admin: 'प्रशासन',
    footer_analytics: 'विश्लेषण',

    // Submit page
    submit_page_title: 'नागरी समस्या नोंदवा',
    submit_page_sub: 'समस्या तुमच्या भाषेत सांगा। आमचे AI ती वर्गीकृत करेल आणि योग्य विभागाकडे पाठवेल।',
    label_comp_title: 'तक्रारीचे शीर्षक',
    label_optional: '(पर्यायी)',
    label_required: '*',
    placeholder_comp_title: 'उदा. पार्कजवळ मुख्य रस्त्यावर खड्डा',
    label_description: 'तपशील',
    voice_input: 'व्हॉइस इनपुट',
    placeholder_description: 'नागरी समस्येचे सविस्तर वर्णन करा…',
    listening: 'ऐकत आहे…',
    label_name: 'तुमचे नाव',
    placeholder_name: 'पूर्ण नाव',
    label_email: 'ईमेल',
    placeholder_email: 'you@example.com',
    label_phone: 'फोन',
    placeholder_phone: '+91 00000 00000',
    label_location: 'स्थान / पत्ता',
    detect_location: 'स्थान शोधा',
    placeholder_location: 'पूर्ण पत्ता किंवा खूण प्रविष्ट करा',
    label_language: 'तक्रारीची भाषा',
    label_photos: 'छायाचित्रे जोडा',
    photos_hint: '(पर्यायी, जास्तीत जास्त 5)',
    drop_zone_text: 'येथे प्रतिमा ड्रॅग & ड्रॉप करा, किंवा',
    drop_zone_link: 'ब्राउझ करण्यासाठी क्लिक करा',
    drop_zone_hint: 'PNG, JPG, WEBP प्रत्येकी 10MB पर्यंत',
    btn_submit: 'तक्रार नोंदवा',
    submitting: 'तुमची तक्रार सादर होत आहे…',
    success_title: 'तक्रार यशस्वीरित्या नोंदवली',
    success_sub: 'तुमची ट्रॅकिंग ID आहे:',
    copy_btn: 'कॉपी करा',
    btn_track_this: 'ही तक्रार ट्रॅक करा',
    btn_submit_another: 'आणखी तक्रार नोंदवा',

    // Track page
    track_page_title: 'तुमची तक्रार ट्रॅक करा',
    track_page_sub: 'तुमच्या तक्रारीची सद्यस्थिती आणि इतिहास पाहण्यासाठी ट्रॅकिंग ID प्रविष्ट करा।',
    btn_track: 'ट्रॅक करा',
    tracking_id_placeholder: 'CV-20250312-XXXXXXXX',
    looking_up: 'तुमची तक्रार शोधली जात आहे…',
    not_found_title: 'तक्रार सापडली नाही',
    not_found_desc: 'त्या ट्रॅकिंग ID सह कोणतीही तक्रार सापडली नाही। कृपया ID पुन्हा तपासा आणि पुन्हा प्रयत्न करा।',
    btn_report_new: 'नवीन समस्या नोंदवा',
    meta_tracking_id: 'ट्रॅकिंग ID',
    meta_category: 'श्रेणी',
    meta_department: 'विभाग',
    meta_submitted: 'नोंदणी तारीख',
    card_complaint_details: 'तक्रार तपशील',
    card_attached_images: 'जोडलेली छायाचित्रे',
    card_status_timeline: 'स्थिती टाइमलाइन',

    // Admin page
    admin_title: 'प्रशासन डॅशबोर्ड',
    admin_sub: 'नागरी तक्रारींचे व्यवस्थापन आणि प्रतिसाद द्या।',
    btn_refresh: 'रिफ्रेश',
    placeholder_search: 'ID, शीर्षक, श्रेणीनुसार शोधा…',
    filter_all_statuses: 'सर्व स्थिती',
    filter_submitted: 'नोंदवलेल्या',
    filter_under_review: 'आढाव्याखाली',
    filter_assigned: 'नियुक्त',
    filter_in_progress: 'प्रगतीपथावर',
    filter_escalated: 'एस्केलेटेड',
    filter_resolved: 'सोडवलेल्या',
    filter_closed: 'बंद',
    filter_rejected: 'नाकारलेल्या',
    filter_all_categories: 'सर्व श्रेणी',
    filter_water: 'पाणी पुरवठा',
    filter_garbage: 'कचरा',
    filter_road: 'रस्ता नुकसान',
    filter_electricity: 'वीज',
    filter_parking: 'अनधिकृत पार्किंग',
    filter_animals: 'रस्त्यावरील प्राणी',
    filter_washroom: 'सार्वजनिक शौचालय',
    filter_all_priorities: 'सर्व प्राधान्यक्रम',
    filter_critical: 'अत्यावश्यक',
    filter_high: 'उच्च',
    filter_medium: 'मध्यम',
    filter_low: 'कमी',
    th_id: 'ID',
    th_title: 'शीर्षक / तपशील',
    th_category: 'श्रेणी',
    th_department: 'विभाग',
    th_priority: 'प्राधान्य',
    th_status: 'स्थिती',
    th_date: 'तारीख',
    th_image: 'छायाचित्र',
    th_actions: 'कृती',
    loading_complaints: 'तक्रारी लोड होत आहेत…',

    // Analytics page
    analytics_title: 'विश्लेषण डॅशबोर्ड',
    analytics_sub: 'नागरी तक्रारींचे अंतर्दृष्टी आणि ट्रेंड।',
    chart_by_category: 'श्रेणीनुसार तक्रारी',
    chart_by_priority: 'प्राधान्यानुसार तक्रारी',
    chart_by_department: 'विभागानुसार तक्रारी',
    chart_monthly: 'मासिक ट्रेंड',
    chart_location: 'स्थान हॉटस्पॉट',
  },
};

// Voice recognition language codes
const voiceLangMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

/**
 * Apply translations to all elements with [data-i18n] attributes.
 * Also updates placeholder attributes for inputs/textareas.
 * @param {string} lang - 'en' | 'hi' | 'mr'
 */
function setLanguage(lang) {
  if (!translations[lang]) return;

  localStorage.setItem('cv_lang', lang);

  const t = translations[lang];

  // Translate text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  // Update active state on lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update voice recognition language if voice module is loaded
  if (typeof window.setVoiceLang === 'function') {
    window.setVoiceLang(voiceLangMap[lang] || 'en-IN');
  }
}

// Auto-apply on page load
(function () {
  const saved = localStorage.getItem('cv_lang') || 'en';
  setLanguage(saved);
})();
