import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  Scale,
  GraduationCap,
  Stethoscope,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import collegeLogo from '../assets/images/college_logo.svg';
import { generateInstitutionalAdvisorReply } from '../services/institutionalAdvisor';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  roleId?: string;
}

export type ChatRole = 'admissions_counselor' | 'clinical_tutor' | 'student_advisor';
export type TaskComplexity = 'fast' | 'general' | 'complex';

interface BridgeAiChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
  initialRole?: ChatRole;
}

const ROLES: { id: ChatRole; title: string; subtitle: string; icon: any; color: string }[] = [
  {
    id: 'admissions_counselor',
    title: 'Admissions Counselor',
    subtitle: 'Entry criteria, WAEC requirements & enrolment',
    icon: GraduationCap,
    color: 'from-amber-600 to-amber-700'
  },
  {
    id: 'clinical_tutor',
    title: 'Clinical & Nursing Tutor',
    subtitle: 'Anatomy, pharmacology, ADPIE & NMCN review',
    icon: Stethoscope,
    color: 'from-teal-600 to-teal-800'
  },
  {
    id: 'student_advisor',
    title: 'Student Affairs Advisor',
    subtitle: 'Campus life, portal guide & study welfare',
    icon: BookOpen,
    color: 'from-blue-600 to-indigo-800'
  }
];

const COMPLEXITY_MODES: { id: TaskComplexity; label: string; modelName: string; desc: string; icon: any }[] = [
  {
    id: 'fast',
    label: 'Fast',
    modelName: 'gemini-flash-lite-latest',
    desc: 'Instant replies for quick lookups',
    icon: Zap
  },
  {
    id: 'general',
    label: 'Balanced',
    modelName: 'gemini-3-flash-preview',
    desc: 'Comprehensive guidance & standard Q&A',
    icon: Scale
  },
  {
    id: 'complex',
    label: 'In-Depth',
    modelName: 'gemini-3-flash-preview',
    desc: 'Deep clinical reasoning & exam cases',
    icon: Brain
  }
];

const SUGGESTED_PROMPTS: Record<ChatRole, string[]> = {
  admissions_counselor: [
    'What are the minimum WAEC/NECO requirements for Basic Nursing?',
    'How long does the Basic Midwifery programme take?',
    'What documents do I need to bring for the entrance screening?',
    'Can I combine WAEC and NECO results for admission?'
  ],
  clinical_tutor: [
    'Explain the 5 steps of the Nursing Process (ADPIE) with a clinical example.',
    'What are the 6 rights of medication administration?',
    'Describe the clinical signs and management of severe pre-eclampsia.',
    'What is the difference between isotonic and hypotonic IV fluids?'
  ],
  student_advisor: [
    'How do I view my semester timetable and lecture hall on the portal?',
    'Tips for coping with night shift duties during hospital clinical postings.',
    'Where is the clinical skills simulation lab located on campus?',
    'How do I access electronic lecture slides for PHM 222?'
  ]
};

const STORAGE_KEY = 'bridge_college_ai_conversation_history';

export default function BridgeAiChat({
  isOpen = true,
  onClose,
  isFloating = false,
  initialRole = 'admissions_counselor'
}: BridgeAiChatProps) {
  const [selectedRole, setSelectedRole] = useState<ChatRole>(initialRole);
  const [complexity, setComplexity] = useState<TaskComplexity>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize conversation with welcoming intro
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse chat storage:', e);
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Welcome to **Bridge College of Nursing & Health Sciences AI Portal**!\n\nI am your dedicated academic and institutional assistant. You can choose a specific specialist role above:\n• **Admissions Counselor**: Entry requirements, program credentials, and screening.\n• **Clinical Tutor**: Nursing sciences, pharmacology, pathophysiology, and NMCN licensing prep.\n• **Student Advisor**: Timetables, portal assistance, and clinical rotation guidance.\n\nHow may I assist your educational journey today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
        roleId: 'admissions_counselor'
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  }, [messages]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation payload for the backend
      const apiMessages = newMessages
        .filter(m => m.id !== 'welcome-msg') // exclude default welcome if preferred
        .slice(-10) // send last 10 messages for rich multi-turn context
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      // If user only sent this one, ensure it has at least the current message
      if (apiMessages.length === 0) {
        apiMessages.push({ role: 'user', content: text });
      }

      let replyContent = '';
      let replyModel = 'gemini-3-flash-preview';

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: apiMessages,
            roleId: selectedRole,
            taskComplexity: complexity
          })
        });

        const contentType = res.headers.get('content-type') || '';

        // On static hosting (like Namecheap cPanel/Apache), .htaccess rewrites non-existent /api/chat
        // to index.html, which returns HTTP 200 with text/html. Checking contentType prevents JSON parse crash.
        if (contentType.includes('application/json')) {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Server responded with status ${res.status}`);
          }
          const data = await res.json();
          replyContent = data.reply || '';
          replyModel = data.modelUsed || 'gemini-3-flash-preview';
        } else {
          // Response is HTML or non-JSON (typical on static cPanel/Namecheap hosting)
          console.info('Backend /api/chat returned non-JSON. Seamlessly activating built-in institutional advisor engine.');
          const fallback = generateInstitutionalAdvisorReply(text, selectedRole, apiMessages);
          replyContent = fallback.reply;
          replyModel = fallback.modelUsed;
        }
      } catch (networkOrApiErr) {
        console.warn('Network or endpoint failure. Falling back to institutional advisor engine:', networkOrApiErr);
        const fallback = generateInstitutionalAdvisorReply(text, selectedRole, apiMessages);
        replyContent = fallback.reply;
        replyModel = fallback.modelUsed;
      }

      if (!replyContent) {
        const fallback = generateInstitutionalAdvisorReply(text, selectedRole, apiMessages);
        replyContent = fallback.reply;
        replyModel = fallback.modelUsed;
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: replyModel,
        roleId: selectedRole
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Unhandled error in chat handler:', err);
      const fallback = generateInstitutionalAdvisorReply(text, selectedRole, []);
      const fallbackMessage: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: fallback.modelUsed,
        roleId: selectedRole
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation history?')) {
      const resetMessages: ChatMessage[] = [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `Conversation restarted. I am ready to assist you as your **${ROLES.find(r => r.id === selectedRole)?.title}**. Ask any question to begin.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: COMPLEXITY_MODES.find(c => c.id === complexity)?.modelName,
          roleId: selectedRole
        }
      ];
      setMessages(resetMessages);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format markdown-like text (bold, bullet points) cleanly without extra dependencies
  const formatMessageText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bullet items
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('* ')) {
        const itemText = line.replace(/^[\s•\-\*]+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-gray-800 leading-relaxed my-1">
            {renderBoldText(itemText)}
          </li>
        );
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Standard line
      return (
        <p key={idx} className="leading-relaxed my-1">
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-teal-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  const currentRoleObj = ROLES.find(r => r.id === selectedRole) || ROLES[0];
  const CurrentRoleIcon = currentRoleObj.icon;

  return (
    <div
      className={`flex flex-col bg-white overflow-hidden transition-all duration-200 z-50 ${
        isFloating
          ? isExpanded
            ? 'fixed inset-4 md:inset-8 rounded-2xl shadow-2xl border-2 border-teal-600'
            : 'fixed bottom-5 right-5 w-[92vw] sm:w-[480px] h-[640px] max-h-[85vh] rounded-2xl shadow-2xl border border-teal-700/30'
          : 'w-full h-[700px] rounded-3xl border border-teal-100 shadow-xl'
      }`}
      id="bridge_college_ai_chatbot"
    >
      {/* CHAT HEADER */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-850 to-teal-950 text-white p-4 sm:px-5 sm:py-3.5 border-b border-amber-500/80 flex items-center justify-between select-none shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-amber-400 overflow-hidden flex items-center justify-center shrink-0 shadow">
            <img src={collegeLogo} alt="College Seal" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-wide text-white flex items-center gap-1.5">
                Bridge College AI
                <span className="inline-flex items-center gap-1 px-2 py-0.2 bg-amber-500 text-teal-950 text-[10px] font-mono font-black uppercase rounded-full">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini
                </span>
              </h3>
            </div>
            <p className="text-xxs sm:text-xs text-teal-200 font-sans flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Active Institutional Advisor • Multi-Turn
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-1.5 text-teal-300 hover:text-white hover:bg-teal-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {isFloating && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimize' : 'Maximize'}
              className="p-1.5 text-teal-300 hover:text-white hover:bg-teal-800 rounded-lg transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              title="Close Chat"
              className="p-1.5 text-teal-300 hover:text-white hover:bg-red-700 rounded-lg transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SPECIALIST ROLE SELECTOR PILLS */}
      <div className="bg-slate-50 border-b border-teal-100 p-2.5 sm:px-4 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-900 font-bold flex items-center gap-1">
            <CurrentRoleIcon className="w-3 h-3 text-teal-700" />
            Specialist Persona:
          </span>
          {/* SPEED / COMPLEXITY TOGGLE */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-teal-200 text-[10px] font-mono">
            {COMPLEXITY_MODES.map(mode => {
              const ModeIcon = mode.icon;
              const isActive = complexity === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setComplexity(mode.id)}
                  title={`${mode.modelName} — ${mode.desc}`}
                  className={`px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-all ${
                    isActive
                      ? 'bg-teal-750 text-white shadow-xs'
                      : 'text-gray-500 hover:text-teal-800'
                  }`}
                >
                  <ModeIcon className="w-2.5 h-2.5" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROLE BUTTONS */}
        <div className="grid grid-cols-3 gap-1.5">
          {ROLES.map(role => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`py-1.5 px-2 rounded-xl text-left border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white border-teal-600 shadow-xs ring-1 ring-teal-500/30'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-gray-600 hover:border-teal-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-gray-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className={`block text-xs font-bold truncate leading-tight ${isSelected ? 'text-teal-900' : 'text-gray-700'}`}>
                    {role.title}
                  </span>
                  <span className="block text-[9px] text-gray-400 font-sans truncate leading-none">
                    {role.id === 'admissions_counselor' ? 'Requirements' : role.id === 'clinical_tutor' ? 'Nursing Tutor' : 'Student Life'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SCROLLABLE MESSAGE THREAD */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* AVATAR */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-teal-700 text-white'
                    : 'bg-amber-100 border border-amber-300 text-teal-900'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-teal-800" />
                )}
              </div>

              {/* MESSAGE BUBBLE */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs ${
                  isUser
                    ? 'bg-teal-750 text-white rounded-tr-none'
                    : 'bg-white border border-teal-100 text-gray-800 rounded-tl-none shadow-xs'
                }`}
              >
                {/* ASSISTANT META BADGE */}
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 text-[10px] text-gray-400 font-mono">
                    <span className="font-bold text-teal-800 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      {ROLES.find(r => r.id === (msg.roleId || selectedRole))?.title}
                    </span>
                    <span className="text-gray-400">
                      {msg.modelUsed ? `via ${msg.modelUsed}` : ''}
                    </span>
                  </div>
                )}

                {/* CONTENT */}
                <div className="break-words font-sans">
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div>{formatMessageText(msg.content)}</div>
                  )}
                </div>

                {/* FOOTER: TIMESTAMP & COPY BUTTON */}
                <div
                  className={`flex items-center justify-between mt-2 pt-1.5 text-[9px] ${
                    isUser ? 'text-teal-200 border-t border-teal-600/40' : 'text-gray-400 border-t border-slate-100'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="flex items-center gap-1 hover:text-teal-700 transition-colors font-mono"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-teal-900 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-teal-800 animate-spin" />
            </div>
            <div className="bg-white border border-teal-100 rounded-2xl rounded-tl-none p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-teal-800 font-medium">
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></span>
                </span>
                <span className="text-gray-500 font-sans text-xs">
                  {currentRoleObj.title} is formulating response using {COMPLEXITY_MODES.find(c => c.id === complexity)?.modelName}...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTION CHIPS */}
      <div className="bg-slate-50/80 px-3 py-2 border-t border-teal-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-gray-500 font-mono font-bold uppercase flex items-center gap-1 shrink-0">
          <HelpCircle className="w-3 h-3 text-amber-600" />
          Suggestions:
        </span>
        {SUGGESTED_PROMPTS[selectedRole].map((prompt, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] bg-white hover:bg-teal-50 border border-teal-200 text-teal-900 px-2.5 py-1 rounded-full shrink-0 transition-all font-sans hover:border-teal-400 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="p-3 bg-white border-t border-teal-100 shrink-0">
        <div className="relative flex items-end gap-2 bg-slate-50 border border-teal-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-teal-600/40 focus-within:border-teal-600 transition-all">
          <textarea
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask our ${currentRoleObj.title}... (Shift + Enter for new line)`}
            rows={2}
            className="w-full bg-transparent resize-none p-1.5 text-xs sm:text-sm text-gray-800 focus:outline-none font-sans"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="w-9 h-9 bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all disabled:cursor-not-allowed group"
            title="Send Message"
          >
            <Send className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 px-1 font-mono">
          <span>
            Model: <strong className="text-teal-800">{COMPLEXITY_MODES.find(c => c.id === complexity)?.modelName}</strong>
          </span>
          <span>Bridge College of Nursing &amp; Health Sciences</span>
        </div>
      </div>
    </div>
  );
}
