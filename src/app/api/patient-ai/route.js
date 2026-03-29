import { NextResponse } from 'next/server';
import { patientProfile } from '@/data/patientMockData';

function buildPatientContext(profile) {
  return {
    nom: profile.fullName,
    id: profile.id,
    conditions: profile.conditions.map((c) => ({ nom: c.name, depuis: c.since })),
    medicaments: profile.medications.map((m) => ({ nom: m.name, dosage: m.dosage, pour: m.purpose })),
    allergies: profile.allergies,
    prochainRdv: profile.nextAppointment,
    diagnostics: profile.consultations
      .filter((c) => !c.upcoming && c.diagnosis)
      .map((c) => ({ date: c.date, medecin: c.doctor, diagnostic: c.diagnosis, noteSimple: c.noteSimple || null })),
  };
}

function targetLanguageLabel(lang) {
  if (lang === 'ar') return 'Arabe';
  if (lang === 'fr') return 'Francais';
  if (lang === 'darija') return 'Darija marocaine';
  return 'la langue du patient';
}

function hasCjk(text = '') {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);
}

function looksLikeDarija(text = '') {
  const low = text.toLowerCase();
  return /(dialk|kayn|m3a|bghiti|3la|hiya|ghir|tabib|rdv|ila|wach|chno|kifach)/.test(low);
}

function fallbackReplyFromContext(message, language, profile) {
  const text = String(message || '').toLowerCase();
  const allergies = profile.allergies.join(', ');
  const meds = profile.medications.map((m) => `- ${m.name}: ${m.dosage} (${m.purpose})`).join('\n');
  const lastDiagnosedVisit = profile.consultations.find((c) => !c.upcoming && c.diagnosis);

  if (/pression du sang|tension arterielle|blood pressure|ضغط الدم|tension/.test(text)) {
    if (language === 'ar') {
      return 'ضغط الدم هو القوة التي يضخ بها القلب الدم داخل الشرايين. اذا ظل مرتفعا لفترة طويلة فقد يؤثر على القلب والكلى والدماغ، لذلك الالتزام بالعلاج والمتابعة مهم.';
    }
    if (language === 'darija') {
      return 'La pression du sang hiya l9owa li kaydfe3 biha l9alb dam f chraiyen. Ila b9at tal3a muddo twila, t9dar t2atr 3la l9alb, lkliwa w dimagh. 3lach dawa w lmoutaba3a مهمين بزاف.';
    }
    return 'La pression du sang est la force du sang dans les arteres. Si elle reste elevee longtemps, elle peut fatiguer le coeur, les reins et le cerveau.';
  }

  if ((/maladie|diagnostic|مرض|تشخيص|chno|3ndi|andi|qali|gali/.test(text)) && lastDiagnosedVisit) {
    const diag = lastDiagnosedVisit.diagnosis;
    const note = lastDiagnosedVisit.noteSimple || 'Explication simple disponible selon le dossier.';

    if (language === 'ar') {
      return `حسب ملفك: في زيارة ${lastDiagnosedVisit.date} مع ${lastDiagnosedVisit.doctor} تم ذكر ${diag}. تفسير مبسط: ${note}.`;
    }
    if (language === 'darija') {
      return `Men dossier dialk: f ziyarat ${lastDiagnosedVisit.date} m3a ${lastDiagnosedVisit.doctor}, tbib dkher ${diag}. B charh sahl: ${note}.`;
    }
    return `Selon ton dossier: visite du ${lastDiagnosedVisit.date} avec ${lastDiagnosedVisit.doctor}, diagnostic: ${diag}. Explication simple: ${note}.`;
  }

  if (/medicament|dwa|traitement|دواء/.test(text)) {
    if (language === 'ar') return `ادويتك الحالية:\n${meds}`;
    if (language === 'darija') return `Hadchi li kayn f dossier dialk:\n${meds}`;
    return `Voici tes medicaments actuels:\n${meds}`;
  }

  if (/allerg|allergie|حساسية/.test(text)) {
    if (language === 'ar') return `حسب ملفك: لديك حساسية من ${allergies}.`;
    if (language === 'darija') return `F dossier dialk kayna allergie men: ${allergies}.`;
    return `Selon ton dossier, tu es allergique a: ${allergies}.`;
  }

  if (language === 'ar') return 'انا مساعد معلوماتي حسب ملفك الطبي فقط. من فضلك تواصل مع طبيبك.';
  if (language === 'darija') return 'Ana ghir assistant ma3loumati 3la dossier dialk. Ila bghiti tafasil aktar, tsawl tabib dialk.';
  return 'Je suis un assistant informatif base sur ton dossier. Consulte ton medecin pour plus de details.';
}

export async function POST(request) {
  const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '';
  const hfModel = process.env.ATLAS_CHAT_MODEL || 'MBZUAI-Paris/Atlas-Chat-9B';
  const hfBaseUrl =
    process.env.ATLAS_CHAT_BASE_URL ||
    process.env.HF_CHAT_BASE_URL ||
    'https://router.huggingface.co/v1/chat/completions';
  const mistralApiKey = process.env.MISTRAL_API_KEY || '';
  const mistralModel = process.env.MISTRAL_MODEL || 'mistral-small-latest';

  if (!hfToken && !mistralApiKey) {
    return NextResponse.json(
      { error: 'Aucune cle IA configuree. Ajoutez HF_TOKEN (recommande) ou MISTRAL_API_KEY.' },
      { status: 503 }
    );
  }

  try {
    const { message, language } = await request.json();
    const normalizedLanguage = ['darija', 'fr', 'ar'].includes(language) ? language : 'darija';

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message invalide.' }, { status: 400 });
    }

    const context = buildPatientContext(patientProfile);
    const systemPrompt = [
      `Tu es un assistant sante personnel pour ${patientProfile.fullName}.`,
      'Tu reponds UNIQUEMENT en te basant sur le dossier patient fourni.',
      'Tu ne consultes pas internet et tu ne fais pas de diagnostic nouveau.',
      'Tu ne recommandes pas de nouveaux medicaments.',
      'Si la question depasse le dossier, dis de consulter le medecin.',
      `Reponds en ${targetLanguageLabel(normalizedLanguage)} avec un ton simple, bienveillant et clair.`,
      'Si le patient demande sa maladie, cite explicitement le medecin, la date, la maladie dans le dossier, puis une explication simple.',
      `Dossier patient filtre: ${JSON.stringify(context)}`,
    ].join('\n');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 14000);

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ];

    const callAtlas = () =>
      fetch(hfBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hfToken}`,
        },
        body: JSON.stringify({
          model: hfModel,
          temperature: 0.2,
          max_tokens: 500,
          messages,
        }),
        signal: controller.signal,
      });

    const callMistral = () =>
      fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mistralApiKey}`,
        },
        body: JSON.stringify({
          model: mistralModel,
          temperature: 0.3,
          max_tokens: 500,
          messages,
        }),
        signal: controller.signal,
      });

    let response;
    let provider = '';
    let hfErrorDetails = '';
    let usedModel = '';

    if (hfToken) {
      provider = 'atlas-huggingface';
      usedModel = hfModel;
      response = await callAtlas();
      if (!response.ok) {
        hfErrorDetails = await response.text();
      }

      // If Atlas call fails and Mistral key exists, fallback to Mistral provider.
      if ((!response || !response.ok) && mistralApiKey) {
        provider = 'mistral';
        response = await callMistral();
      }
    } else {
      provider = 'mistral';
      response = await callMistral();
    }

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = hfErrorDetails || await response.text();
      const fallbackReply = fallbackReplyFromContext(message, normalizedLanguage, patientProfile);
      return NextResponse.json({
        reply: fallbackReply,
        fallback: true,
        fallbackReason: `Erreur ${provider} (${response.status})`,
        usedModel: usedModel || undefined,
        details: errText.slice(0, 300),
        hfFallbackDetails: hfErrorDetails ? hfErrorDetails.slice(0, 300) : undefined,
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: 'Reponse vide du modele.' }, { status: 502 });
    }

    // Some providers may ignore dialect instruction; enforce safe local fallback for Darija requests.
    if (normalizedLanguage === 'darija' && (hasCjk(reply) || !looksLikeDarija(reply))) {
      return NextResponse.json({ reply: fallbackReplyFromContext(message, normalizedLanguage, patientProfile) });
    }

    return NextResponse.json({ reply, usedModel: usedModel || undefined });
  } catch (error) {
    if (error.name === 'AbortError') {
      const fallbackReply = fallbackReplyFromContext('timeout', 'darija', patientProfile);
      return NextResponse.json({ reply: fallbackReply, fallback: true, fallbackReason: 'Timeout fournisseur IA' });
    }
    const fallbackReply = fallbackReplyFromContext('erreur', 'darija', patientProfile);
    return NextResponse.json({ reply: fallbackReply, fallback: true, fallbackReason: `Erreur serveur: ${error.message}` });
  }
}
