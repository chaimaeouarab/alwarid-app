'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_PATIENTS } from '@/data/mockData';
import { SYSTEM_PROMPTS, buildPatientContext } from '@/data/prompts';

const patient = MOCK_PATIENTS[0];

const CHAT_CONFIG = {
    urgence: {
        label: 'Urgence',
        title: 'Assistant IA - Urgence',
        promptKey: 'URGENCE_CHATBOT',
        instruction: 'Contexte urgence: prioriser allergies, interactions critiques et securite immediate.',
        placeholder: 'Question urgente sur le patient...',
        quickActions: [
            'Resume critique du patient',
            'Allergies et contre-indications',
            'Interactions medicamenteuses critiques',
            'Protocole HTA urgente'
        ],
        system: `Assistant IA - Mode Urgence. Patient: ${patient.firstName} ${patient.lastName}, ${patient.age} ans. Je reponds uniquement a partir du dossier patient.`
    },
    consultation: {
        label: 'Consultation',
        title: 'Analyse IA - Dossier',
        promptKey: 'AI_ANALYSIS',
        instruction: 'Contexte consultation: fournir une analyse structuree et les risques de prescription.',
        placeholder: 'Posez une question sur le dossier medical...',
        quickActions: [
            'Resume complet du dossier patient',
            'Contre-indications pour ce patient?',
            'Interactions medicamenteuses a surveiller',
            'Quels examens sont dus?'
        ],
        system: `Assistant IA - Consultation. Patient: ${patient.firstName} ${patient.lastName}. Je fournis une aide a la decision basee sur le dossier.`
    }
};

function getInitialThreads() {
    return Object.keys(CHAT_CONFIG).reduce((acc, modeKey) => {
        acc[modeKey] = [{ role: 'system', text: CHAT_CONFIG[modeKey].system }];
        return acc;
    }, {});
}

function getFallbackResponse(mode, query) {
    const q = query.toLowerCase();

    if (mode === 'urgence') {
        if (q.includes('allerg')) {
            return `ALLERGIES ET CONTRE-INDICATIONS\n\n- Allergies connues: ${patient.allergies.join(', ')}\n- Vigilance elevee sur molecules de la famille penicilline/sulfamides\n- Verification des interactions critiques avant toute prescription\n\n[Aide a la decision - La decision finale revient au medecin traitant]`;
        }
        return `RESUME CRITIQUE URGENCE\n\n- Patient: ${patient.firstName} ${patient.lastName}, ${patient.age} ans\n- Allergies majeures: ${patient.allergies.join(', ')}\n- Pathologies actives: ${patient.conditions.map((c) => c.name).join(', ')}\n- Interactions critiques: ${patient.interactions.map((i) => i.drugs.join(' + ')).join(' | ')}\n\n[Aide a la decision - La decision finale revient au medecin traitant]`;
    }

    if (q.includes('examen')) {
        return `EXAMENS DUS\n\n- Verifier HbA1c trimestriel\n- Revoir ECG de controle\n- Mettre a jour bilan lipidique\n- Evaluer prochain controle renale\n\n[Aide a la decision - La decision finale revient au medecin traitant]`;
    }

    return `ANALYSE IA DU DOSSIER\n\n- Synthese des pathologies: ${patient.conditions.map((c) => c.name).join(', ')}\n- Medicaments en cours: ${patient.medications.map((m) => `${m.name} (${m.dosage})`).join(', ')}\n- Interactions critiques a surveiller: ${patient.interactions.length}\n\n[Aide a la decision - La decision finale revient au medecin traitant]`;
}

function ChatCircleIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 9.5h8M8 13.5h5" />
            <path d="M7.6 20 3 21l1.1-4.2A8 8 0 1 1 20 12" />
        </svg>
    );
}

function XCloseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m18 6-12 12" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function Send01Icon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m22 2-10 10" />
            <path d="m22 2-6 20-4-10-10-4 20-6Z" />
        </svg>
    );
}

export default function PopupAIChat({ mode }) {
    const config = CHAT_CONFIG[mode];
    const isEnabled = Boolean(config);

    const [isOpen, setIsOpen] = useState(false);
    const [threads, setThreads] = useState(getInitialThreads);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingMode, setTypingMode] = useState(null);
    const [streamingText, setStreamingText] = useState('');
    const bottomRef = useRef(null);

    const messages = useMemo(() => (mode && threads[mode] ? threads[mode] : []), [mode, threads]);

    useEffect(() => {
        if (!isEnabled) {
            setIsOpen(false);
        }
        setInput('');
    }, [mode, isEnabled]);

    useEffect(() => {
        if (!isOpen) return;
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingText, isOpen]);

    const pushMessage = (chatMode, message) => {
        setThreads((prev) => ({
            ...prev,
            [chatMode]: [...(prev[chatMode] || []), message]
        }));
    };

    const handleSend = async (text) => {
        const query = (text || input).trim();
        if (!query || isTyping || !config) return;

        const systemPrompt = `${SYSTEM_PROMPTS[config.promptKey] || SYSTEM_PROMPTS.AI_ANALYSIS}\n\n${config.instruction}`;

        pushMessage(mode, { role: 'user', text: query });
        setInput('');
        setIsTyping(true);
        setTypingMode(mode);
        setStreamingText('');

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemPrompt,
                    userMessage: query,
                    patientContext: buildPatientContext(patient)
                })
            });

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                throw new Error('fallback');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const payload = line.slice(6).trim();
                    if (payload === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(payload);
                        if (parsed.content) {
                            fullText += parsed.content;
                            setStreamingText(fullText);
                        }
                    } catch {
                        // Ignore malformed chunks and continue stream parsing.
                    }
                }
            }

            pushMessage(mode, { role: 'ai', text: fullText || 'Aucune reponse disponible.' });
        } catch {
            const fallback = getFallbackResponse(mode, query);
            setStreamingText(fallback);
            pushMessage(mode, { role: 'ai', text: fallback });
        }

        setStreamingText('');
        setIsTyping(false);
        setTypingMode(null);
    };

    if (!isEnabled) {
        return null;
    }

    return (
        <div className="ai-popup-root">
            {!isOpen && (
                <button
                    className="ai-popup-trigger"
                    onClick={() => setIsOpen(true)}
                    title={`Ouvrir ${config.title}`}
                    aria-label={`Ouvrir ${config.title}`}
                >
                    <ChatCircleIcon />
                    <span>Assistant IA</span>
                </button>
            )}

            {isOpen && (
                <section className="ai-popup-panel card fade-in">
                    <div className="ai-popup-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="ai-popup-header-icon">
                                <ChatCircleIcon />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>{config.title}</div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{config.label}</div>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-icon" onClick={() => setIsOpen(false)} aria-label="Fermer la fenetre IA">
                            <XCloseIcon />
                        </button>
                    </div>

                    <div className="ai-popup-messages">
                        {messages.map((msg, i) => (
                            <div key={`${msg.role}-${i}`} className={`ai-popup-bubble ${msg.role}`}>
                                {msg.text}
                            </div>
                        ))}

                        {isTyping && typingMode === mode && (
                            <div className="ai-popup-bubble ai">{streamingText || 'Analyse en cours...'}</div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="ai-popup-quick-actions">
                        {config.quickActions.map((quick) => (
                            <button
                                key={quick}
                                className="pill"
                                onClick={() => handleSend(quick)}
                                disabled={isTyping}
                                style={{ fontSize: 10, padding: '4px 8px' }}
                            >
                                {quick}
                            </button>
                        ))}
                    </div>

                    <div className="ai-popup-input-row">
                        <input
                            type="text"
                            className="form-input"
                            placeholder={config.placeholder}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={isTyping}
                        />
                        <button className="btn btn-primary ai-popup-send" onClick={() => handleSend()} disabled={isTyping} aria-label="Envoyer message IA">
                            <Send01Icon />
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
