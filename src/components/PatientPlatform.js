'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { patientProfile } from '@/data/patientMockData';
import styles from './PatientPlatform.module.css';

const sectionButtons = [
  { key: 'notifs', label: 'Notifs' },
  { key: 'dossier', label: 'Dossier' },
  { key: 'ordonnances', label: 'Ordonnance' },
  { key: 'rdv', label: 'Rendez-vous' },
];

function detectLanguage(text) {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  if (hasArabic) return 'ar';
  const low = text.toLowerCase();
  if (low.includes('chno') || low.includes('wach') || low.includes('salam') || low.includes('kifach')) {
    return 'darija';
  }
  return 'fr';
}

function replyFromContext(text, lang) {
  const low = text.toLowerCase();
  const meds = patientProfile.medications.map((m) => `- ${m.name}: ${m.dosage} (${m.purpose})`).join('\n');
  const allergies = patientProfile.allergies.join(', ');
  const lastDiagnosedVisit = patientProfile.consultations.find((c) => !c.upcoming && c.diagnosis);

  const asksBloodPressureExplanation =
    /pression du sang|tension arterielle|ضغط الدم|pressure|blood pressure|tension/.test(low) ||
    /شنو هي|اشنو هي|chrah|explique/.test(low);

  if (asksBloodPressureExplanation) {
    if (lang === 'ar') {
      return 'ضغط الدم هو القوة التي يضخ بها القلب الدم داخل الشرايين. عندما يبقى مرتفعا لفترة طويلة، يمكن ان يؤثر على القلب والكلى والدماغ. لذلك المتابعة والدواء مهمان.';
    }
    if (lang === 'darija') {
      return 'La pression du sang hiya l9owa li kaydfe3 biha l9alb dam f chraiyen. Ila b9at tal3a muddo twila, t9dar t2atr 3la l9alb, lkliwa w dimagh. 3lach dawa w lmoutaba3a مهمين بزاف.';
    }
    return 'La pression du sang, c\'est la force exercee par le sang sur les arteres. Si elle reste elevee longtemps, elle peut fatiguer le coeur, les reins et le cerveau. C\'est pour cela que le suivi et le traitement sont importants.';
  }

  const diseaseKeywords = [
    'maladie',
    'malade',
    'diagnostic',
    '3ndi',
    'andi',
    'qali',
    'gali',
    'pas compris',
    'ma fhemtch',
    'mafhemtch',
    'expliquer',
    'expliq',
    'medecin',
    'doctor said',
  ];

  const asksDiseaseByKeyword = diseaseKeywords.some((k) => low.includes(k));
  const asksDiseaseArabic = /مريض|مرض|المرض|تشخيص|شنو|شنو عندي|ماذا عندي|الطبيب|قالي|قالي|عندي/.test(text);
  const asksAboutDisease = asksDiseaseByKeyword || asksDiseaseArabic;

  if (asksAboutDisease && lastDiagnosedVisit) {
    const diag = lastDiagnosedVisit.diagnosis;
    const diagSimple =
      patientProfile.diagnosisExplanations?.[diag] ||
      'Je peux te donner une explication simple selon ton dossier.';

    if (lang === 'ar') {
      return `حسب ملفك الطبي: في زيارة ${lastDiagnosedVisit.date} مع ${lastDiagnosedVisit.doctor} تم ذكر ${diag}.\nتفسير مبسط: ${diagSimple}\nاذا بغيت شرح اكثر، تواصل مع طبيبك.`;
    }
    if (lang === 'darija') {
      return `Men dossier dialk: f ziyarat ${lastDiagnosedVisit.date} m3a ${lastDiagnosedVisit.doctor}, tbib dkher ${diag}.\nB charh sahl: ${diagSimple}\nIla bghiti tafasil aktar, tsawl tabib dialk.`;
    }
    return `Selon ton dossier: pendant la consultation du ${lastDiagnosedVisit.date} avec ${lastDiagnosedVisit.doctor}, le diagnostic note est ${diag}.\nExplication simple: ${diagSimple}\nPour plus de details, contacte ton medecin.`;
  }

  if (low.includes('medicament') || low.includes('dwa') || low.includes('traitement')) {
    if (lang === 'ar') return `ادويتك الحالية هي:\n${meds}\nهذا فقط حسب ملفك الطبي.`;
    if (lang === 'darija') return `Hadchi li kayn f dossier dialk:\n${meds}\nGhir ma3lomat men dossier dialk.`;
    return `Voici tes medicaments actuels:\n${meds}\nReponse basee uniquement sur ton dossier.`;
  }

  if (low.includes('allerg') || low.includes('penic')) {
    if (lang === 'ar') return `حسب ملفك: لديك حساسية من ${allergies}.`;
    if (lang === 'darija') return `F dossier dialk kayna allergie men: ${allergies}.`;
    return `Selon ton dossier, tu es allergique a: ${allergies}.`;
  }

  if (low.includes('rdv') || low.includes('rendez') || low.includes('consult')) {
    const rdv = patientProfile.nextAppointment;
    if (lang === 'ar') return `موعدك القادم: ${rdv.date} مع ${rdv.doctor} (${rdv.specialty}) في ${rdv.location}.`;
    if (lang === 'darija') return `Rdv jay dialk: ${rdv.date} m3a ${rdv.doctor} (${rdv.specialty}) f ${rdv.location}.`;
    return `Ton prochain rendez-vous: ${rdv.date} avec ${rdv.doctor} (${rdv.specialty}) a ${rdv.location}.`;
  }

  if (lang === 'ar') return 'انا مساعد معلوماتي فقط حسب ملفك الطبي. لا اقدم تشخيصا. من فضلك تواصل مع طبيبك.';
  if (lang === 'darija') return 'Ana ghir assistant ma3loumati 3la dossier dialk. Ma kanchkhessch. 3afak tsawl tabib dialk.';
  return 'Je suis un assistant informatif base uniquement sur ton dossier. Je ne fais pas de diagnostic. Contacte ton medecin.';
}

export default function PatientPlatform() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [unreadNotifs] = useState(1);
  const [language, setLanguage] = useState('darija');
  const [input, setInput] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showDoctorContactModal, setShowDoctorContactModal] = useState(false);
  const [activeFollowup, setActiveFollowup] = useState('suivi');
  const [followupValues, setFollowupValues] = useState({ fasting: '1.05', postMeal: '' });
  const [expandedSections, setExpandedSections] = useState({ allergies: true, meds: true, conditions: true });
  const [dossierQuickFocus, setDossierQuickFocus] = useState(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(patientProfile.prescriptions[0].id);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Salam Youssef! Kifach n9dar n3awnek lyoum?' },
  ]);
  const chatScrollRef = useRef(null);

  const selectedPrescription = useMemo(
    () => patientProfile.prescriptions.find((p) => p.id === selectedPrescriptionId),
    [selectedPrescriptionId]
  );

  const doctorContacts = useMemo(() => {
    const byDoctor = new Map();
    const phonesByDoctor = {
      'Dr. Alaoui': '+212 6 12 34 56 78',
      'Dr. Tazi': '+212 6 98 76 54 32',
    };

    const addContact = (doctor, specialty, location) => {
      if (!doctor) return;
      if (byDoctor.has(doctor)) return;
      byDoctor.set(doctor, {
        doctor,
        specialty: specialty || 'Medecin traitant',
        location: location || patientProfile.lastVisit.location,
        phone: phonesByDoctor[doctor] || '+212 6 00 00 00 00',
      });
    };

    addContact(
      patientProfile.nextAppointment.doctor,
      patientProfile.nextAppointment.specialty,
      patientProfile.nextAppointment.location
    );

    patientProfile.consultations.forEach((c) => addContact(c.doctor, c.title, c.hospital));

    return Array.from(byDoctor.values());
  }, []);

  useEffect(() => {
    const available = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSpeechSupported(Boolean(available));
  }, []);

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isAskingAI, chatOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = chatOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [chatOpen]);

  useEffect(() => {
    if (!selectedPrescription) return;
    const payload = JSON.stringify({
      token: selectedPrescription.id,
      patient: patientProfile.id,
      expiresAt: selectedPrescription.expiresAt,
    });
    QRCode.toDataURL(payload, { margin: 1, width: 240, color: { dark: '#0f172a', light: '#ffffff' } })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [selectedPrescription]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (isAskingAI) return;

    const userText = input.trim();
    const detected = detectLanguage(input);
    const lang = language === 'auto' ? detected : language;

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsAskingAI(true);

    let answer = '';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('/api/patient-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, language: lang }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`API status ${response.status}`);
      }

      const data = await response.json();
      answer = data.reply;
    } catch {
      answer = replyFromContext(userText, lang);
    } finally {
      setIsAskingAI(false);
    }

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', text: answer },
    ]);

  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openChat = () => {
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    setShowDoctorContactModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'dossier') {
      setDossierQuickFocus(null);
    }
  };

  const handleQuickAccess = (focus) => {
    setDossierQuickFocus(focus);
    setActiveTab('dossier');

    if (focus === 'diabete') {
      setExpandedSections({ allergies: false, meds: false, conditions: true });
      return;
    }

    if (focus === 'meds') {
      setExpandedSections({ allergies: false, meds: true, conditions: false });
      return;
    }

    if (focus === 'allergies') {
      setExpandedSections({ allergies: true, meds: false, conditions: false });
    }
  };

  const clearQuickFocus = () => {
    setDossierQuickFocus(null);
    setExpandedSections({ allergies: true, meds: true, conditions: true });
  };

  const handleBack = () => {
    setActiveTab('home');
    setDossierQuickFocus(null);
    setExpandedSections({ allergies: true, meds: true, conditions: true });
  };

  const handleFollowupSubmit = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: 'Super, suivi enregistre. 5 jours de suivi consecutifs, bravo.',
      },
    ]);
  };

  const handleVoiceInput = () => {
    const Recognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!Recognition || isListening) return;

    const recognition = new Recognition();
    recognition.lang = language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'ar-MA';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const chatDir = language === 'ar' ? 'rtl' : 'ltr';
  const shellDir = language === 'ar' ? 'rtl' : 'ltr';
  const canGoBack = activeTab !== 'home';

  return (
    <div className={`${styles.shell} ${language === 'ar' ? styles.rtl : ''}`} dir={shellDir}>
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.logoMini}
          onClick={() => router.push('/role')}
          aria-label="Aller au choix Patient ou Medecin"
        >
          <Image src="/logo-official-nobg.png" alt="Alwarid" fill sizes="440px" className={styles.logoImage} />
        </button>
      </header>

      <div className={styles.greetingRow}>
        <div className={styles.greetingLine}>
          <p className={styles.greeting}>Bonjour, {patientProfile.firstName}</p>
        </div>
        <p className={styles.muted}>{patientProfile.id}</p>
      </div>

      <div className={styles.topActions}>
        {canGoBack ? (
          <button className={styles.backBtn} onClick={handleBack} aria-label="Accueil patient">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5.5 10.5V20h13V10.5" />
            </svg>
          </button>
        ) : null}
      </div>

      <nav className={styles.sectionNav}>
        {sectionButtons.map((section) => (
          <button
            key={section.key}
            className={activeTab === section.key ? styles.sectionBtnActive : styles.sectionBtn}
            onClick={() => handleTabChange(section.key)}
          >
            <span className={styles.sectionBtnInner}>
              <span>{section.label}</span>
              {section.key === 'notifs' && unreadNotifs > 0 ? <span className={styles.sectionBadge}>+{unreadNotifs}</span> : null}
            </span>
          </button>
        ))}
      </nav>

      <main className={styles.contentArea}>
        {activeTab === 'notifs' && (
          <section className={styles.stack}>
            <article className={styles.card}>
              <div className={styles.rowBetween}>
                <h3>Notifications</h3>
                <span className={styles.badgeOk}>1 nouvelle</span>
              </div>
              <div className={styles.accordionBody}>
                <div className={styles.medCard}>
                  <strong>Rappel rendez-vous</strong>
                  <p>Consultation cardiologie le 4 avril 2026 avec Dr. Alaoui.</p>
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === 'home' && (
          <section className={styles.stack}>
            <div className={styles.cardRow}>
              <article className={styles.card}>
                <h3>📅 Prochaine consultation</h3>
                <p className={styles.cardMain}>{patientProfile.nextAppointment.date}</p>
                <p>{patientProfile.nextAppointment.doctor} - {patientProfile.nextAppointment.specialty}</p>
                <p className={styles.okText}>🟢 Dans 3 jours</p>
              </article>
              <article className={styles.card}>
                <h3>📊 Derniere visite</h3>
                <p className={styles.cardMain}>{patientProfile.lastVisit.date}</p>
                <p>Tension: 12/8 ✅ Normale</p>
                <p className={styles.muted}>{patientProfile.lastVisit.department} - {patientProfile.lastVisit.location}</p>
              </article>
            </div>

            <article className={styles.card}>
              <h3>Mon dossier rapide</h3>
              <div className={styles.pills}>
                <button className={`${styles.quickPill} ${styles.stagger1}`} onClick={() => handleQuickAccess('diabete')}>🩺 Diabete</button>
                <button className={`${styles.quickPill} ${styles.stagger2}`} onClick={() => handleQuickAccess('meds')}>💊 Medicaments</button>
                <button className={`${styles.quickPill} ${styles.stagger3}`} onClick={() => handleQuickAccess('allergies')}>⚠️ Allergies</button>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.rowBetween}>
                <h3>Suivi glycemique</h3>
                <button className={styles.secondaryBtn} onClick={() => setActiveFollowup('suivi')}>Voir</button>
              </div>
              <p className={styles.muted}>Actif depuis 20 mars - module active par le medecin.</p>
              <button className={styles.primaryBtn} onClick={() => handleTabChange('rdv')}>Ouvrir mon suivi</button>
            </article>
          </section>
        )}

        {activeTab === 'dossier' && (
          <section className={styles.stack}>
            {dossierQuickFocus ? (
              <article className={styles.quickFocusBar}>
                <p>
                  Affichage rapide:{' '}
                  {dossierQuickFocus === 'diabete'
                    ? 'Diabete du patient'
                    : dossierQuickFocus === 'meds'
                      ? 'Medicaments du patient'
                      : 'Allergies du patient'}
                </p>
                <button className={styles.secondaryBtn} onClick={clearQuickFocus}>Voir tout</button>
              </article>
            ) : null}

            <article className={styles.card}>
              <button className={styles.accordionHeader} onClick={() => toggleSection('allergies')}>
                <span>🔴 ALLERGIES</span>
                <span className={expandedSections.allergies ? styles.arrowOpen : styles.arrow}>›</span>
              </button>
              {expandedSections.allergies && (
                <div className={styles.accordionBody}>
                  {patientProfile.allergies.map((a) => (
                    <div key={a} className={styles.medCard}>{a} • Allergie</div>
                  ))}
                </div>
              )}
            </article>

            <article className={styles.card}>
              <button className={styles.accordionHeader} onClick={() => toggleSection('meds')}>
                <span>💊 MES MEDICAMENTS</span>
                <span className={expandedSections.meds ? styles.arrowOpen : styles.arrow}>›</span>
              </button>
              {expandedSections.meds && (
                <div className={styles.accordionBody}>
                  {patientProfile.medications.map((m) => (
                    <div key={m.name} className={styles.medCard}>
                      <strong>{m.name}</strong>
                      <p>{m.dosage} - {m.purpose}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className={styles.card}>
              <button className={styles.accordionHeader} onClick={() => toggleSection('conditions')}>
                <span>🩺 MES PATHOLOGIES</span>
                <span className={expandedSections.conditions ? styles.arrowOpen : styles.arrow}>›</span>
              </button>
              {expandedSections.conditions && (
                <div className={styles.accordionBody}>
                  {patientProfile.conditions
                    .filter((c) => (dossierQuickFocus === 'diabete' ? c.name.toLowerCase().includes('diabet') : true))
                    .map((c) => (
                    <div key={c.name} className={styles.medCard}>
                      <strong>{c.name}</strong>
                      <p>Diagnostique en {c.since}</p>
                    </div>
                    ))}
                </div>
              )}
            </article>
          </section>
        )}

        {activeTab === 'ordonnances' && (
          <section className={styles.stack}>
            {patientProfile.prescriptions.map((p) => (
              <article key={p.id} className={`${styles.card} ${selectedPrescriptionId === p.id ? styles.cardActive : ''}`}>
                <div className={styles.rowBetween}>
                  <h3>Ordonnance du {p.date}</h3>
                  <span className={p.status.includes('Expiree') ? styles.badgeMuted : styles.badgeOk}>{p.status}</span>
                </div>
                <p>{p.doctor} - {p.specialty}</p>
                <ul className={styles.list}>
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button className={styles.primaryBtn} onClick={() => setSelectedPrescriptionId(p.id)}>Afficher QR code</button>
              </article>
            ))}

            {selectedPrescription && (
              <article className={styles.qrCard}>
                <h3>QR code pharmacie</h3>
                <p className={styles.muted}>Montrez ce code au pharmacien.</p>
                <div className={styles.qrBox}>
                  {qrDataUrl ? <img src={qrDataUrl} alt="QR ordonnance" width="160" height="160" className={styles.qrImage} /> : <p>Generation...</p>}
                </div>
                <p className={styles.muted}>Code: {selectedPrescription.id}</p>
                <p className={styles.muted}>Valide jusqu'au: {selectedPrescription.expiresAt}</p>
              </article>
            )}
          </section>
        )}

        {activeTab === 'rdv' && (
          <section className={styles.stack}>
            <article className={styles.card}>
              <h3>Mes consultations</h3>
              <ul className={styles.timeline}>
                {patientProfile.consultations.map((c) => (
                  <li key={`${c.date}-${c.title}`}>
                    <span className={c.upcoming ? styles.dotUpcoming : styles.dotPast}></span>
                    <div>
                      <p className={styles.cardMain}>{c.date} - {c.title}</p>
                      <p>{c.doctor}</p>
                      <p className={styles.muted}>{c.hospital}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.card}>
              <h3>Suivi glycemique</h3>
              <p className={styles.muted}>Actif depuis 20 mars - Frequence: matin + soir</p>

              <div className={styles.followupForm}>
                <label>
                  A jeun (g/L)
                  <input
                    className={styles.chatInput}
                    value={followupValues.fasting}
                    onChange={(e) => setFollowupValues((prev) => ({ ...prev, fasting: e.target.value }))}
                  />
                </label>
                <label>
                  Apres repas (g/L)
                  <input
                    className={styles.chatInput}
                    value={followupValues.postMeal}
                    onChange={(e) => setFollowupValues((prev) => ({ ...prev, postMeal: e.target.value }))}
                  />
                </label>
                <button className={styles.primaryBtn} onClick={handleFollowupSubmit}>Valider</button>
              </div>

              <div className={styles.followupWeek}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                  <div key={`${day}-${idx}`} className={styles.dayCell}>
                    <span>{day}</span>
                    <span>{idx < 4 ? '✅' : idx === 4 ? '❌' : '⭕'}</span>
                  </div>
                ))}
              </div>

              <p className={styles.okText}>💬 5 jours de suivi ! Bravo</p>
            </article>
          </section>
        )}
      </main>

      {!chatOpen && (
        <button className={styles.chatFab} onClick={openChat} aria-label="Ouvrir le chat">
          <span className={styles.robotAvatar}>
            <span className={styles.robotHead}>
              <span className={styles.robotEye}></span>
            </span>
            <span className={styles.robotBody}></span>
          </span>
        </button>
      )}

      <div className={`${styles.chatBackdrop} ${chatOpen ? styles.chatBackdropOpen : ''}`} onClick={closeChat}></div>

      <aside className={`${styles.chatPanel} ${chatOpen ? styles.chatPanelOpen : ''}`} dir={chatDir}>
        <div className={styles.chatPanelHeader}>
          <div>
            <h3>💬 Assistant Alwarid</h3>
            <p className={styles.muted}>En ligne - Darija / Francais / Arabe</p>
          </div>
          <button className={styles.closeBtn} onClick={closeChat}>✕</button>
        </div>

        <div className={styles.languageRow}>
          <button className={language === 'darija' ? styles.langActive : styles.langBtn} onClick={() => setLanguage('darija')}>Darija</button>
          <button className={language === 'fr' ? styles.langActive : styles.langBtn} onClick={() => setLanguage('fr')}>Francais</button>
          <button className={language === 'ar' ? styles.langActive : styles.langBtn} onClick={() => setLanguage('ar')}>العربية</button>
          <button className={language === 'auto' ? styles.langActive : styles.langBtn} onClick={() => setLanguage('auto')}>Auto</button>
        </div>

        <span className={styles.badge}>Je suis un assistant, pas un medecin</span>

        <div className={styles.chatBox} ref={chatScrollRef}>
          {messages.map((m, idx) => (
            <div key={`${m.role}-${idx}`} className={m.role === 'assistant' ? styles.msgAi : styles.msgUser}>
              {m.role === 'assistant' && <span className={styles.botAvatar}>🧑‍⚕️</span>}
              <span>{m.text}</span>
            </div>
          ))}
          {isAskingAI && (
            <div className={styles.msgAi}>
              <span className={styles.botAvatar}>🧑‍⚕️</span>
              <span className={styles.typingDots}><i></i><i></i><i></i></span>
            </div>
          )}
        </div>

        <div className={styles.chatInputRow}>
          <button
            className={`${styles.micBtn} ${isListening ? styles.micActive : ''}`}
            type="button"
            onClick={handleVoiceInput}
            disabled={!speechSupported || isListening}
          >
            🎤
          </button>
          <input
            className={styles.chatInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ecris ton message..."
          />
          <button className={styles.sendBtn} type="button" onClick={handleSend} disabled={isAskingAI}>
            Envoyer →
          </button>
        </div>

        <button className={styles.contactDoctorBtn} type="button" onClick={() => setShowDoctorContactModal(true)}>
          Contacter mon medecin
        </button>

        {showDoctorContactModal ? (
          <>
            <button
              className={styles.doctorModalBackdrop}
              aria-label="Fermer les contacts medecin"
              type="button"
              onClick={() => setShowDoctorContactModal(false)}
            ></button>
            <section className={styles.doctorModal} role="dialog" aria-modal="true" aria-label="Contacts medecins">
              <div className={styles.rowBetween}>
                <h3>Contacts medecins</h3>
                <button className={styles.closeBtn} type="button" onClick={() => setShowDoctorContactModal(false)}>✕</button>
              </div>
              <div className={styles.accordionBody}>
                {doctorContacts.map((contact) => (
                  <div key={contact.doctor} className={styles.medCard}>
                    <strong>{contact.doctor}</strong>
                    <p>{contact.specialty}</p>
                    <p>{contact.location}</p>
                    <p>{contact.phone}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </aside>

    </div>
  );
}
