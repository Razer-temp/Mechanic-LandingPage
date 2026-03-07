'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { BrandMarquee } from '@/components/ui/BrandMarquee';
import { Footer } from '@/components/ui/Footer';
import { diagnose, estimateCost, handleConversation, type DiagnosisResult, type CostEstimate, type ConversationResult } from '@/lib/ai-engine';
import { getDeviceInfo } from '@/lib/device';
import { createClient } from '@/lib/supabase/client';
import './ai-intelligence.css';
import './landing-effects.css';
import './how-it-works.css';
import './footer-premium.css';
import '../animated-button.css';
import clsx from 'clsx';
import { MessageSquareText, BrainCircuit, Wrench, Rocket, X, Sparkles, MessageCircle, PhoneCall, Check, Target, PhoneOutgoing, Search, Bot, Zap, ShieldCheck, Banknote, MapPin } from 'lucide-react';
import { KineticPiston, KineticGears, KineticDisc, KineticDroplet, KineticWarning, KineticLightning } from '@/components/icons/KineticIcons';
import { motion } from 'framer-motion';

const HOW_STEPS = [
  {
    num: '01',
    colorBase: 'text-blue-500',
    icon: <MessageSquareText className="size-8" />,
    title: 'Describe Issue',
    desc: 'Chat with our AI or use the form to describe what’s wrong with your bike. Our smart system understands natural language.'
  },
  {
    num: '02',
    colorBase: 'text-fuchsia-500',
    icon: <BrainCircuit className="size-8" />,
    title: 'AI Analysis',
    desc: 'Our AI engine analyzes symptoms to provide instant diagnosis and transparent cost estimates before any work begins.'
  },
  {
    num: '03',
    colorBase: 'text-emerald-500',
    icon: <Wrench className="size-8" />,
    title: 'Expert Repair',
    desc: 'Book a slot. Our certified mechanics fix your bike using genuine parts, ensuring peak performance.'
  },
  {
    num: '04',
    colorBase: 'text-amber-500',
    icon: <Rocket className="size-8" />,
    title: 'Ready to Ride',
    desc: 'Get your bike back in top condition. Pay online or at the workshop. Delivery guaranteed within our service area.'
  }
];

export default function LandingPage() {
  // --- States for Interactions ---
  const [diagnosisText, setDiagnosisText] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisAttempted, setDiagnosisAttempted] = useState(false);

  const [estBikeType, setEstBikeType] = useState('');
  const [estServiceType, setEstServiceType] = useState('');
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
  const [estimateAttempted, setEstimateAttempted] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', bike: '', service: '', serviceLocation: 'workshop', address: '' });
  const [serviceLocation, setServiceLocation] = useState('workshop');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ type: 'bot' | 'user'; html: React.ReactNode }[]>([
    { type: 'bot', html: <>Hi! I&apos;m your AI Mechanic assistant. 🏍️<br />Tell me about your bike problem and I&apos;ll help diagnose it!</> }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  // showFloating removed — buttons are always visible
  const supabase = createClient();
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // --- Ref for mobile section ---
  const mobileSectionRef = useRef<HTMLDivElement>(null);

  // --- Refs for Animations ---
  const particlesRef = useRef<HTMLDivElement>(null);

  // --- 1. Particles ---
  useEffect(() => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    container.innerHTML = ''; // Clear
    // Reduce particles on mobile for GPU performance
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 8 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 4 + 's';
      p.style.animationDuration = (3 + Math.random() * 3) + 's';
      container.appendChild(p);
    }
  }, []);

  // --- 2. Scroll Reveal ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- 3. Mobile Service Ignition ---
  useEffect(() => {
    // Initial check and observer setup
    const isMobile = () => window.innerWidth < 768;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (isMobile() && entry.isIntersecting) {
          entry.target.classList.add('animate-ignition');
        } else {
          entry.target.classList.remove('animate-ignition');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '-35% 0px -35% 0px'
    });

    document.querySelectorAll('.service-card, .why-card').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- 3. Counters ---
  useEffect(() => {
    const animateCounter = (el: HTMLElement, target: number) => {
      const duration = 2000;
      const start = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(target * easeOutQuart);

        el.textContent = current + (target > 50 ? '+' : '');

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target') || '0');
          animateCounter(entry.target as HTMLElement, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- 4. Parallax ---
  useEffect(() => {
    // Skip parallax on mobile — it causes scroll jank
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isMobile) return;

    // Cache elements to avoid querying DOM linearly on every scroll tick
    const items = [
      { el: document.querySelector('.hero-orb--blue') as HTMLElement | null, speed: 0.03 },
      { el: document.querySelector('.hero-orb--red') as HTMLElement | null, speed: -0.02 },
      { el: document.querySelector('.hero-grid-overlay') as HTMLElement | null, speed: 0.01 },
    ].filter(i => i.el !== null);

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          items.forEach(({ el, speed }) => {
            if (el) el.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 5. Mouse Glow & Tilt Effect (Event Delegation — works for all cards) ---
  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const target = e.target as HTMLElement | null;
          if (!target) {
            ticking = false;
            return;
          }
          const card = target.closest<HTMLElement>('.tilt-card, .hover-glow, .magnetic-btn');
          if (card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPct = x / rect.width;
            const yPct = y / rect.height;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.setProperty('--mouse-x-pct', `${xPct}`);
            card.style.setProperty('--mouse-y-pct', `${yPct}`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Track which card the mouse is currently over
      const card = (e.target as HTMLElement).closest<HTMLElement>('.tilt-card, .hover-glow, .magnetic-btn');
      if (card) card.dataset.hovered = 'true';
    };

    const handleMouseOut = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.tilt-card, .hover-glow, .magnetic-btn');
      if (!card) return;

      // Only reset if we actually left the card (not just moved between children)
      const related = e.relatedTarget as HTMLElement | null;
      if (related && card.contains(related)) return;

      delete card.dataset.hovered;
      // Reset tilt percentages so card returns to flat
      card.style.removeProperty('--mouse-x-pct');
      card.style.removeProperty('--mouse-y-pct');
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // --- 7. AI Diagnosis Logic ---
  const handleDiagnosis = () => {
    if (!diagnosisText.trim()) return;
    setIsDiagnosing(true);
    setDiagnosisResult(null);

    setTimeout(async () => {
      const result = diagnose(diagnosisText);
      setDiagnosisResult(result);
      setIsDiagnosing(false);
      setDiagnosisAttempted(true);

      // Always save to DB, even if AI couldn't identify specific issue
      try {
        const deviceInfo = getDeviceInfo();
        const sessionId = chatSessionId;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from('ai_diagnoses' as any).insert({
          input_text: diagnosisText,
          bike_model: bikeModel || null,
          result_title: result?.title || 'Unidentified Issue',
          result_urgency: result?.urgency || 'low',
          result_cost: result?.cost || 'Manual Review Required',
          metadata: deviceInfo,
          session_id: sessionId || null,
          is_read: false
        });

        if (error) console.error('Error saving diagnosis:', error);
      } catch (err) {
        console.error('Error saving diagnosis:', err);
      }
    }, 1500);
  };

  const setQuickIssue = (issue: string) => {
    setDiagnosisText(issue);
  };

  // --- 6. Cost Estimator Logic ---
  const handleEstimate = async () => {
    if (!estBikeType || !estServiceType) return;
    const result = estimateCost(estBikeType, estServiceType);
    setCostEstimate(result);
    setEstimateAttempted(true);

    if (result) {
      const saveEstimateResult = async () => {
        try {
          const deviceInfo = getDeviceInfo();
          const sessionId = chatSessionId;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await supabase.from('ai_estimates' as any).insert({
            bike_type: estBikeType,
            service_type: estServiceType,
            min_cost: result.min,
            max_cost: result.max,
            metadata: deviceInfo,
            session_id: sessionId || null
          });

          if (error) console.error('Error saving estimate:', error);
        } catch (err) {
          console.error('Error saving estimate:', err);
        }
      };
      await saveEstimateResult();
    }
  };

  // --- 7. Booking Logic ---
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('bookName') as string;
    const phone = formData.get('bookPhone') as string;
    const bike = formData.get('bookBike') as string;
    const service = formData.get('bookService') as string;
    const loc = formData.get('serviceLocation') as string;
    const address = formData.get('bookAddress') as string || '';

    if (!name || !phone || !bike || !service || !loc) return;

    // Save to Supabase
    const saveBooking = async () => {
      try {
        const deviceInfo = getDeviceInfo();

        await supabase.from('bookings').insert({
          name,
          phone,
          bike_model: bike,
          service_type: service,
          service_location: loc,
          address: loc === 'doorstep' ? address : null,
          preferred_date: (formData.get('bookDate') as string),
          preferred_time: (formData.get('bookTime') as string),
          notes: (formData.get('bookNotes') as string),
          status: 'pending',
          metadata: deviceInfo
        });
      } catch (err) {
        console.error('Error saving booking:', err);
      }
    };
    saveBooking();

    setBookingData({ name, phone, bike, service, serviceLocation: loc, address });
    setBookingSuccess(true);
  };

  // --- 8. Chatbot Logic ---
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const saveChatMessage = useCallback(async (sessionId: string, role: 'user' | 'bot', content: string) => {
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role,
        content
      });
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  }, [supabase]);

  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatMessages(prev => [...prev, { type: 'user', html: text }]);
    setChatInput('');

    let currentSessionId = chatSessionId;

    // Create session if it doesn't exist
    if (!currentSessionId) {
      try {
        const deviceInfo = getDeviceInfo();

        const { data, error } = await supabase.from('chat_sessions').insert({
          customer_name: 'Guest',
          metadata: deviceInfo
        }).select().single();

        if (data && !error) {
          currentSessionId = data.id;
          setChatSessionId(data.id);
        }
      } catch (err) {
        console.error('Error creating chat session:', err);
      }
    }

    if (currentSessionId) {
      saveChatMessage(currentSessionId, 'user', text);
    }

    // Typing indicator delay
    setTimeout(() => {
      // Check for conversational responses first
      const conversation = handleConversation(text);
      let botText = '';
      let reply: React.ReactNode;

      if (conversation) {
        botText = conversation.reply;
        reply = conversation.reply.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < conversation.reply.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      } else {
        // Otherwise, try diagnostic logic
        const result = diagnose(text);
        if (result) {
          botText = `${result.title}\n\nPossible causes:\n• ${result.causes.join('\n• ')}\n\nUrgency: ${result.urgency.toUpperCase()}\nEst. Cost: ${result.cost}\n\n${result.tip}`;
          reply = (
            <>
              <strong>{result.title}</strong><br /><br />
              Possible causes:<br />
              {result.causes.map((c, i) => (
                <React.Fragment key={i}>
                  • {c}<br />
                </React.Fragment>
              ))}<br />
              ⚠️ Urgency: <strong>{result.urgency.toUpperCase()}</strong><br />
              💰 Est. Cost: <strong>{result.cost}</strong><br /><br />
              💡 {result.tip}<br /><br />
              👉 <a href="#booking" style={{ color: '#00d4ff' }}>Book a service</a> to get it fixed!
            </>
          );
        } else {
          botText = "I couldn't identify the exact issue from your description. I'd recommend a Full Diagnostic Checkup (₹199) where our experts will inspect your bike thoroughly.";
          reply = (
            <>
              I couldn&apos;t identify the exact issue from your description. 🤔<br /><br />
              I&apos;d recommend a <strong>Full Diagnostic Checkup (₹199)</strong> where our experts will inspect your bike thoroughly.<br /><br />
              👉 <a href="#booking" style={{ color: '#00d4ff' }}>Book a checkup</a> or call us at <a href="tel:+919811530780" style={{ color: '#00d4ff' }}>+91 98115 30780</a>
            </>
          );
        }
      }

      setChatMessages(prev => [...prev, { type: 'bot', html: reply }]);
      if (currentSessionId) {
        saveChatMessage(currentSessionId, 'bot', botText);
      }
    }, 1200);
  }, [chatInput, chatSessionId, supabase, saveChatMessage]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="landing-page-wrapper">
      <Navbar />

      {/* ===== HERO ===== */}
      <header className="hero" id="hero">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb--blue"></div>
          <div className="hero-orb hero-orb--red"></div>
          <div className="hero-grid-overlay"></div>
          <div className="hero-particles" ref={particlesRef}></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-on-scroll">
            <div className="shooting-stars-container">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="shooting-star"></div>
              ))}
            </div>
            <span className="pulse-dot"></span>
            <span className="badge-text">
              AI-Powered Workshop
            </span>
          </div>
          <h1 className="hero-title animate-on-scroll">
            <span className="text-reveal-wrapper">
              <span className="text-reveal delay-100">Smart Bike Care.</span>
            </span>
            <br />
            <span className="text-reveal-wrapper">
              <span className="text-reveal delay-300 gradient-text">Faster. Better.</span>
            </span>
          </h1>
          <p className="hero-subtitle animate-on-scroll delay-500">
            AI-Powered Two-Wheeler Diagnostics &amp; Repair — Expert mechanics, instant diagnosis, and transparent pricing for your ride.
          </p>
          <div className="hero-ctas animate-on-scroll delay-500 flex flex-wrap justify-center gap-4">
            {/* 1. Book Service -> Check */}
            <a href="#booking" className="animated-gradient-btn bordered group" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
              <div className="flex items-center justify-center gap-3">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <Wrench className="absolute w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-all duration-500 group-hover:opacity-0 group-hover:-rotate-90 group-hover:scale-50" />
                  <Check className="absolute w-5 h-5 text-cyan-400 opacity-0 scale-50 rotate-90 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100" />
                </div>
                <span>Book Service</span>
              </div>
            </a>

            {/* 2. AI Bike Check -> Sparkles */}
            <a href="#diagnosis" className="btn btn-secondary group border border-[rgba(167,139,250,0.2)] hover:border-[rgba(167,139,250,0.4)] transition-all duration-300">
              <div className="flex items-center justify-center gap-2">
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <BrainCircuit className="absolute w-4 h-4 text-gray-400 group-hover:text-fuchsia-400 transition-all duration-500 group-hover:opacity-0 group-hover:scale-50" />
                  <Sparkles className="absolute w-4 h-4 text-fuchsia-400 opacity-0 scale-150 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">AI Bike Check</span>
              </div>
            </a>

            {/* 3. Call Now -> Message */}
            <a href="tel:+919811530780" className="btn btn-outline group border border-[rgba(255,255,255,0.07)] hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center justify-center gap-2">
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <PhoneCall className="absolute w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-all duration-500 group-hover:opacity-0 group-hover:scale-50 group-hover:-rotate-12" />
                  <PhoneOutgoing className="absolute w-4 h-4 text-emerald-400 opacity-0 scale-50 rotate-12 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Call Now</span>
              </div>
            </a>
          </div>
          <div className="hero-stats animate-on-scroll">
            <div className="stat-item">
              <span className="stat-number" data-target="15000">0</span>+
              <span className="stat-label">Bikes Serviced</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-target="98">0</span>%
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-target="50">0</span>+
              <span className="stat-label">AI Diagnoses Daily</span>
            </div>
          </div>
        </div>

      </header>

      <BrandMarquee />

      {/* ===== AI DIAGNOSIS ===== */}
      <section className="section section-diagnosis" id="diagnosis">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">🤖 AI-Powered</span>
            <h2 className="section-title">Instant AI <span className="gradient-text">Bike Diagnosis</span></h2>
            <p className="section-desc">Describe your bike&apos;s problem and our AI will analyze it in seconds — giving you potential causes, urgency level, and estimated costs.</p>
          </div>
          <div className="diagnosis-grid">
            <div className="diagnosis-input-card glass-card animate-on-scroll hover-glow tilt-card">
              <h3>Describe Your Bike Issue</h3>
              <div className="diagnosis-form">
                <div className="form-group">
                  <label htmlFor="bikeModel">Bike Model</label>
                  <input
                    type="text"
                    id="bikeModel"
                    placeholder="e.g., Honda Activa 6G, Royal Enfield Classic 350"
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bikeIssue">What&apos;s the problem?</label>
                  <textarea
                    id="bikeIssue"
                    rows={4}
                    placeholder="e.g., Engine makes rattling noise at high speed, hard to start in morning, brake squeaking..."
                    value={diagnosisText}
                    onChange={(e) => setDiagnosisText(e.target.value)}
                  ></textarea>
                </div>
                <div className="quick-issues">
                  {['Engine won\'t start', 'Strange noise from engine', 'Brakes not working properly', 'Oil leaking', 'Battery draining fast', 'Low mileage / poor fuel efficiency'].map((issue) => (
                    <span
                      key={issue}
                      className="quick-chip"
                      onClick={() => setQuickIssue(issue)}
                    >
                      {issue.split(' / ')[0]}
                    </span>
                  ))}
                </div>
                <button className="btn btn-primary btn-glow btn-full group" id="diagnosisBtn" onClick={handleDiagnosis}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <Search className="absolute w-5 h-5 group-hover:opacity-0 group-hover:scale-50 transition-all duration-500" />
                      <Sparkles className="absolute w-5 h-5 opacity-0 scale-150 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100" />
                    </div>
                    <span>{isDiagnosing ? 'Analyzing...' : 'Analyze with AI'}</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="diagnosis-result-card glass-card animate-on-scroll hover-glow tilt-card" id="diagnosisResult">
              {isDiagnosing ? (
                <div className="result-placeholder">
                  <div className="ai-brain-icon analyzing">🧠</div>
                  <p>Analyzing {bikeModel ? <>for <strong>{bikeModel}</strong></> : null}...</p>
                </div>
              ) : diagnosisResult ? (
                <div className="diagnosis-output">
                  <h3>🔍 AI Analysis: {diagnosisResult.title}</h3>
                  <div className="result-section">
                    <h4>Possible Causes</h4>
                    <ul>{diagnosisResult.causes.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  </div>
                  <div className="result-section">
                    <h4>Urgency Level</h4>
                    <span className={clsx('urgency-badge', `urgency-${diagnosisResult.urgency}`)}>{diagnosisResult.urgency.toUpperCase()}</span>
                  </div>
                  <div className="result-section">
                    <h4>Estimated Cost</h4>
                    <p style={{ fontWeight: 600, color: 'var(--accent-green)', fontSize: '1.1rem' }}>{diagnosisResult.cost}</p>
                  </div>
                  <div className="result-section">
                    <h4>💡 Pro Tip</h4>
                    <p>{diagnosisResult.tip}</p>
                  </div>
                  <a href="#booking" className="btn btn-primary btn-glow btn-full" style={{ marginTop: '20px' }}>
                    <span>📅</span> Book Repair Now
                  </a>
                </div>
              ) : diagnosisAttempted ? (
                <div className="ai-fallback-card">
                  <div className="ai-fallback-icon">🤔</div>
                  <h3 className="ai-fallback-title">Diagnosis Update</h3>
                  <p className="ai-fallback-text">
                    I couldn&apos;t identify the exact issue from your description.
                  </p>
                  <div className="ai-fallback-highlight">
                    <p className="ai-fallback-highlight-tag">Recommended Action</p>
                    <p className="ai-fallback-highlight-title">Full Diagnostic Checkup (₹199)</p>
                    <p className="ai-fallback-highlight-desc">Our experts will inspect your bike thoroughly to pinpoint the exact problem.</p>
                  </div>
                  <a href="#booking" className="btn btn-primary btn-glow btn-full">
                    <span>📅</span> Book a Checkup
                  </a>
                  <p className="ai-fallback-footer">
                    OR CALL US AT <a href="tel:+919811530780" className="ai-fallback-phone">+91 98115 30780</a>
                  </p>
                </div>
              ) : (
                <div className="result-placeholder">
                  <div className="ai-brain-icon">🧠</div>
                  <p>Enter your bike issue and click <strong>Analyze</strong> to get AI-powered diagnosis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section section-services" id="services">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">🔧 What We Do</span>
            <h2 className="section-title">Our <span className="gradient-text">Services</span></h2>
            <p className="section-desc">From routine servicing to complex engine repairs — we handle every two-wheeler need with precision and care.</p>
          </div>
          <div className="services-grid">
            {[
              { icon: KineticPiston, neonColor: '#22d3ee', title: 'Engine Repair', desc: 'Complete engine overhaul, timing chain, piston repair, and head gasket replacement.', price: 'From ₹1,500*' },
              { icon: KineticGears, neonColor: '#e879f9', title: 'Full Servicing', desc: 'Oil change, filter replacement, chain adjustment, spark plug — complete care package.', price: 'From ₹799*' },
              { icon: KineticDisc, neonColor: '#f87171', title: 'Brake Fix', desc: 'Disc & drum brake pads, brake fluid change, ABS diagnostics, and caliper servicing.', price: 'From ₹500*' },
              { icon: KineticDroplet, neonColor: '#fbbf24', title: 'Oil Change', desc: 'Premium synthetic & semi-synthetic engine oil with filter replacement.', price: 'From ₹350*' },
              { icon: KineticWarning, neonColor: '#fb923c', title: 'Emergency Repair', desc: 'Roadside assistance, flat tire, towing service, and emergency breakdown support.', price: 'From ₹299*' },
              { icon: KineticLightning, neonColor: '#facc15', title: 'Electrical Work', desc: 'Wiring repair, headlight upgrade, battery replacement, ECU diagnostics.', price: 'From ₹400*' },
            ].map((s, i) => (
              <div key={i} className="service-card glass-card animate-on-scroll hover-glow tilt-card group" style={{ '--neon-color': s.neonColor } as React.CSSProperties}>
                <div className="service-icon kinetic-icon-wrap">
                  <s.icon className="kinetic-svg" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service-price">{s.price}</span>
              </div>
            ))}
          </div>
          <p className="section-disclaimer animate-on-scroll">
            * Prices may vary based on vehicle model, condition, and specific parts required.
          </p>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section section-why" id="why-us">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">💎 Why Us</span>
            <h2 className="section-title">Why Choose <span className="gradient-text">SmartBike Pro</span>?</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: Bot, neonColor: '#22d3ee', title: 'AI Diagnostics', desc: 'Our AI engine analyzes 1000+ bike symptoms to pinpoint issues before you even visit.' },
              { icon: Wrench, neonColor: '#e879f9', title: 'Expert Mechanics', desc: 'Certified technicians with 10+ years experience across all bike brands.' },
              { icon: Zap, neonColor: '#facc15', title: 'Fast Turnaround', desc: 'Most services completed within 2-4 hours. Same-day delivery guaranteed.' },
              { icon: Banknote, neonColor: '#4ade80', title: 'Transparent Pricing', desc: 'No hidden charges. AI-powered cost estimation before you commit to any repair.' },
              { icon: ShieldCheck, neonColor: '#60a5fa', title: 'Warranty Assured', desc: '6-month warranty on all repairs. Genuine parts with quality guarantee.' },
              { icon: MapPin, neonColor: '#f87171', title: 'Pickup & Drop', desc: 'Free pick-up and delivery within 10km radius. Hassle-free doorstep service.' },
            ].map((w, i) => (
              <div key={i} className="why-card animate-on-scroll hover-glow tilt-card group" style={{ '--neon-color': w.neonColor } as React.CSSProperties}>
                <div className="neural-bg"></div>
                <div className="why-icon-wrap kinetic-icon-wrap">
                  <w.icon className="kinetic-svg" />
                </div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — Ultra Premium SaaS Version ===== */}
      <section className="how-section-premium" id="how-it-works">
        {/* Background depth effects */}
        <div className="how-bg-glow-left"></div>
        <div className="how-bg-glow-right"></div>

        <div className="container relative z-10">
          <div className="text-center mb-16 lg:mb-24">
            <span className="how-label-premium animate-on-scroll">
              Process
            </span>
            <h2 className="how-title-premium animate-on-scroll delay-100">
              How It <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="how-subtitle-premium animate-on-scroll delay-200">
              From diagnosis to repair — seamless, smart, and stress-free.
            </p>
          </div>

          <div className="accordion-container hidden lg:flex">
            {HOW_STEPS.map((step, i) => (
              <div
                key={i}
                className={clsx(
                  "accordion-panel group",
                  i === 0 ? "active" : "" // First panel is active/expanded by default strictly via CSS handling later if needed, but we'll use pure CSS hover for simplicity here
                )}
                style={{
                  transitionDelay: `${i * 100}ms`,
                  // CRITICAL: backdropFilter is stripped by cssnano in production builds.
                  // Injecting via inline style bypasses the CSS minifier entirely.
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {/* 
                  MINIFIER BYPASS HACK: We render the gradient border as a real DOM node 
                  with inline styles. This completely prevents Next.js's production cssnano 
                  minifier from stripping the critical `mask-composite` rules used for glassmorphism.
                */}
                <div
                  className="accordion-gradient-border-hack"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    pointerEvents: "none",
                    borderRadius: "inherit",
                    padding: "2px",
                    background: "linear-gradient(135deg, deeppink, royalblue, rebeccapurple, lime)",
                    backgroundSize: "300% 300%",
                    animation: "glow-shift 6s linear infinite", // Fixed typo: animate -> animation
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                  }}
                ></div>

                <div className="accordion-bg"></div>

                <div className="accordion-content">
                  {/* The collapsed view element (Number & Title) */}
                  <div className="accordion-collapsed-view">
                    <span className="accordion-huge-num">{step.num}</span>
                    <span className="accordion-rotated-title">{step.title}</span>
                  </div>

                  {/* The expanded view element (Details) */}
                  <div className="accordion-expanded-view">
                    <div className={clsx("accordion-icon-wrap", step.colorBase)}>
                      {step.icon}
                    </div>
                    <div className="accordion-text-wrap">
                      <span className="accordion-small-num">Step {step.num}</span>
                      <h3 className="accordion-title">{step.title}</h3>
                      <p className="accordion-desc">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE TIMELINE EXPERIENCE (Visible only on <1024px) */}
          <div ref={mobileSectionRef} className="block lg:hidden mobile-timeline-wrapper">
            <div className="mobile-timeline-line"></div>
            <div className="mobile-timeline-cards">
              {HOW_STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="timeline-step-card glass-card hover-glow"
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-card-header">
                    <span className="timeline-num">{step.num}</span>
                    <div className={clsx("timeline-icon", step.colorBase)}>{step.icon}</div>
                  </div>
                  <h3 className="timeline-title">{step.title}</h3>
                  <p className="timeline-desc">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== AI COST ESTIMATOR ===== */}
      <section className="section section-estimator" id="estimator">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">💡 Smart Tool</span>
            <h2 className="section-title">AI <span className="gradient-text">Cost Estimator</span></h2>
            <p className="section-desc">Get an instant price range for your service — no obligation, no surprises.</p>
          </div>
          <div className="estimator-card glass-card animate-on-scroll hover-glow tilt-card">
            <div className="estimator-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="estBikeType">Bike Type</label>
                  <select id="estBikeType" value={estBikeType} onChange={(e) => setEstBikeType(e.target.value)}>
                    <option value="">Select type...</option>
                    <option value="scooter">Scooter (Activa, Jupiter, etc.)</option>
                    <option value="commuter">Commuter (Splendor, Shine, etc.)</option>
                    <option value="sport">Sport (R15, KTM, etc.)</option>
                    <option value="cruiser">Cruiser (Bullet, Thunderbird, etc.)</option>
                    <option value="electric">Electric (Ather, Ola, etc.)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="estService">Service Type</label>
                  <select id="estService" value={estServiceType} onChange={(e) => setEstServiceType(e.target.value)}>
                    <option value="">Select service...</option>
                    <option value="general">General Servicing</option>
                    <option value="engine">Engine Repair</option>
                    <option value="brake">Brake Fix</option>
                    <option value="oil">Oil Change</option>
                    <option value="electrical">Electrical Work</option>
                    <option value="emergency">Emergency Repair</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-glow btn-full" id="estimateBtn" onClick={handleEstimate}>
                <span>💰</span> Get Estimate
              </button>
            </div>
            <div className="estimate-result" id="estimateResult">
              {costEstimate ? (
                <div className="estimate-output" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <p className="est-price">
                    {costEstimate.min === 0 && costEstimate.max === 0 ? 'N/A' : `₹${costEstimate.min.toLocaleString()} – ₹${costEstimate.max.toLocaleString()}`}
                  </p>
                  <p className="est-note">{costEstimate.note}</p>
                </div>
              ) : estimateAttempted ? (
                <div className="estimate-output fallback">
                  <p className="text-white font-bold mb-2">No Estimate Found 🤔</p>
                  <p className="text-[#55556a] text-xs mb-4">We couldn&apos;t generate an instant estimate for this combination.</p>
                  <a href="#booking" className="text-[#00c8ff] text-xs font-black uppercase tracking-widest hover:underline">
                    Book a Checkup for Exact Pricing 🔧
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="section section-reviews" id="reviews">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">⭐ Testimonials</span>
            <h2 className="section-title">What Our <span className="gradient-text">Customers Say</span></h2>
          </div>
          <div className="reviews-marquee-wrapper">
            {/* Row 1: Scroll Left */}
            <div className="marquee-container">
              <div className="marquee-track scroll-left">
                {[
                  { name: 'Rajesh Kumar', bike: 'Honda Activa 6G', avatar: 'RK', text: '"The AI diagnosis was spot-on! It told me my bike had a carburetor issue before I even visited. The repair was done in 3 hours. Incredibly impressed!"' },
                  { name: 'Priya Sharma', bike: 'RE Classic 350', avatar: 'PS', text: '"Best mechanic service in town! The cost estimator was accurate, no hidden charges. My Royal Enfield runs like new. Highly recommended!"' },
                  { name: 'Amit Verma', bike: 'KTM Duke 200', avatar: 'AV', text: '"Emergency breakdown at midnight — they picked up my bike and had it ready by morning. The WhatsApp updates kept me informed. Lifesavers!"' },
                  { name: 'Sneha Gupta', bike: 'TVS Jupiter', avatar: 'SG', text: '"Loved the transparency! The mechanic explained everything, and the final bill matched the AI estimate perfectly. Will definitely visit again."' },
                  // Duplicates for seamless loop
                  { name: 'Rajesh Kumar', bike: 'Honda Activa 6G', avatar: 'RK', text: '"The AI diagnosis was spot-on! It told me my bike had a carburetor issue before I even visited. The repair was done in 3 hours. Incredibly impressed!"' },
                  { name: 'Priya Sharma', bike: 'RE Classic 350', avatar: 'PS', text: '"Best mechanic service in town! The cost estimator was accurate, no hidden charges. My Royal Enfield runs like new. Highly recommended!"' },
                  { name: 'Amit Verma', bike: 'KTM Duke 200', avatar: 'AV', text: '"Emergency breakdown at midnight — they picked up my bike and had it ready by morning. The WhatsApp updates kept me informed. Lifesavers!"' },
                  { name: 'Sneha Gupta', bike: 'TVS Jupiter', avatar: 'SG', text: '"Loved the transparency! The mechanic explained everything, and the final bill matched the AI estimate perfectly. Will definitely visit again."' },
                ].map((r, i) => (
                  <div key={i} className="review-card glass-card marquee-item hover-glow">
                    <div className="review-stars">★★★★★</div>
                    <p className="review-text">{r.text}</p>
                    <div className="review-author">
                      <div className="author-avatar">{r.avatar}</div>
                      <div>
                        <strong>{r.name}</strong>
                        <span>{r.bike}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scroll Right */}
            <div className="marquee-container">
              <div className="marquee-track scroll-right">
                {[
                  { name: 'Vikram Singh', bike: 'Yamaha R15 V4', avatar: 'VS', text: '"Professional and tech-savvy. The online booking was smooth, and they heavily optimized my R15 chain set. Feels faster now!"' },
                  { name: 'Anjali Desai', bike: 'Ola S1 Pro', avatar: 'AD', text: '"Finally a mechanic that understands EVs! They fixed my front fork suspension issue without confusing me with technical jargon."' },
                  { name: 'Rahul Mehta', bike: 'Bajaj Pulsar 150', avatar: 'RM', text: '"Great value for money. The full service package covered everything. My Pulsar vibration issue is completely gone."' },
                  { name: 'Karthik R', bike: 'Hero Splendor+', avatar: 'KR', text: '"Simple, fast, and honest. No unnecessary part replacements. They actually repaired my old part instead of forcing a new one."' },
                  // Duplicates for seamless loop
                  { name: 'Vikram Singh', bike: 'Yamaha R15 V4', avatar: 'VS', text: '"Professional and tech-savvy. The online booking was smooth, and they heavily optimized my R15 chain set. Feels faster now!"' },
                  { name: 'Anjali Desai', bike: 'Ola S1 Pro', avatar: 'AD', text: '"Finally a mechanic that understands EVs! They fixed my front fork suspension issue without confusing me with technical jargon."' },
                  { name: 'Rahul Mehta', bike: 'Bajaj Pulsar 150', avatar: 'RM', text: '"Great value for money. The full service package covered everything. My Pulsar vibration issue is completely gone."' },
                  { name: 'Karthik R', bike: 'Hero Splendor+', avatar: 'KR', text: '"Simple, fast, and honest. No unnecessary part replacements. They actually repaired my old part instead of forcing a new one."' },
                ].map((r, i) => (
                  <div key={i} className="review-card glass-card marquee-item hover-glow">
                    <div className="review-stars">★★★★★</div>
                    <p className="review-text">{r.text}</p>
                    <div className="review-author">
                      <div className="author-avatar">{r.avatar}</div>
                      <div>
                        <strong>{r.name}</strong>
                        <span>{r.bike}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOOKING FORM ===== */}
      <section className="section section-booking" id="booking">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">📅 Book Now</span>
            <h2 className="section-title">Schedule Your <span className="gradient-text">Service</span></h2>
            <p className="section-desc">Fill in the form and we&apos;ll confirm your slot within minutes.</p>
          </div>
          <div className="booking-card glass-card animate-on-scroll hover-glow">
            {bookingSuccess ? (
              <div className="booking-success" style={{ animation: 'fadeInUp 0.5s ease' }}>
                <div className="success-icon">✅</div>
                <h3>Booking Confirmed!</h3>
                <p>Thank you, <strong>{bookingData.name}</strong>! We&apos;ve received your booking for <strong>{bookingData.service}</strong>.</p>
                <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>We&apos;ll call you at <strong>{bookingData.phone}</strong> to confirm your slot shortly.</p>
                {bookingData.serviceLocation === 'doorstep' && (
                  <p style={{ marginTop: '4px', fontSize: '0.9rem', color: 'var(--accent-violet)' }}>📍 <strong>Doorstep Service</strong> to: {bookingData.address}</p>
                )}
                <a
                  href={`https://wa.me/919811530780?text=Hi!%20I%20just%20booked%20${encodeURIComponent(bookingData.service)}%20(${bookingData.serviceLocation === 'doorstep' ? 'Doorstep%20Service' : 'Workshop%20Visit'})${bookingData.serviceLocation === 'doorstep' ? `%20at%20${encodeURIComponent(bookingData.address)}` : ''}%20for%20my%20${encodeURIComponent(bookingData.bike)}.%20Name:%20${encodeURIComponent(bookingData.name)}`}
                  className="btn btn-whatsapp"
                  style={{ marginTop: '24px' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💬</span> Confirm via WhatsApp
                </a>
              </div>
            ) : (
              <form className="booking-form" id="bookingForm" onSubmit={handleBookingSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookName">Full Name *</label>
                    <input type="text" name="bookName" id="bookName" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookPhone">Phone Number *</label>
                    <input type="tel" name="bookPhone" id="bookPhone" placeholder="+91 98765 43210" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookBike">Bike Model *</label>
                    <input type="text" name="bookBike" id="bookBike" placeholder="e.g., Honda Activa 6G" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookService">Service Needed *</label>
                    <select name="bookService" id="bookService" required>
                      <option value="">Select service...</option>
                      {serviceLocation === 'workshop' ? (
                        <>
                          <option value="General Servicing">General Servicing</option>
                          <option value="Basic Service">Basic Service</option>
                          <option value="Vehicle Inspection">Vehicle Inspection</option>
                          <option value="Engine Repair">Engine Repair</option>
                          <option value="Brake Fix">Brake Fix</option>
                          <option value="Oil Change">Oil Change</option>
                          <option value="Electrical Work">Electrical Work</option>
                          <option value="Emergency Repair">Emergency Repair</option>
                          <option value="Full Checkup">Full Checkup</option>
                        </>
                      ) : (
                        <>
                          <option value="General Servicing">General Servicing</option>
                          <option value="Basic Service">Basic Service</option>
                          <option value="Vehicle Inspection">Vehicle Inspection</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="serviceLocation">Service Location *</label>
                    <select
                      name="serviceLocation"
                      id="serviceLocation"
                      required
                      value={serviceLocation}
                      onChange={(e) => setServiceLocation(e.target.value)}
                    >
                      <option value="workshop">Workshop Visit (In-Store)</option>
                      <option value="doorstep">Doorstep Service (At Home)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookDate">Preferred Date *</label>
                    <input type="date" name="bookDate" id="bookDate" required defaultValue={new Date().toISOString().split('T')[0]} min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                {serviceLocation === 'doorstep' && (
                  <div className="form-group animate-fadeInUp">
                    <label htmlFor="bookAddress">Pickup/Service Address *</label>
                    <textarea name="bookAddress" id="bookAddress" rows={2} placeholder="Enter your full address for doorstep service" required></textarea>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookTime">Preferred Time</label>
                    <select name="bookTime" id="bookTime">
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="bookNotes">Additional Notes</label>
                  <textarea name="bookNotes" id="bookNotes" rows={3} placeholder="Any specific issue or request..."></textarea>
                </div>
                <div className="form-row form-actions">
                  <button type="submit" className="btn btn-primary btn-glow btn-full">
                    <span>✅</span> Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== CONTACT & MAP ===== */}
      <section className="section section-contact" id="contact">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">📍 Visit Us</span>
            <h2 className="section-title">Location & <span className="gradient-text">Contact</span></h2>
          </div>
          <div className="contact-grid">
            <div className="contact-info glass-card animate-on-scroll">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Workshop Address</strong>
                  <p>D-1C, Shah Alam Bandh Marg, near sai Baba Mandir<br />Block D, Adarsh Nagar Extension, Adarsh Nagar, Delhi, 110033</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p><a href="tel:+919811530780">+91 98115 30780</a></p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <div>
                  <strong>Working Hours</strong>
                  <p>Mon–Sat: 9:00 AM – 7:00 PM<br />Sunday: 10:00 AM – 4:00 PM</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p><a href="mailto:hello.smartbikepro@gmail.com">hello.smartbikepro@gmail.com</a></p>
                </div>
              </div>
              <div className="contact-buttons">
                <a href="https://wa.me/919811530780?text=Hi!%20I%20need%20bike%20service." className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  <span>💬</span> WhatsApp Us
                </a>
                <a href="tel:+919811530780" className="btn btn-outline">
                  <span>📞</span> Call Now
                </a>
              </div>
            </div>
            <div className="contact-map glass-card animate-on-scroll">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.885559275282!2d77.1736294!3d28.722965900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0173dbf9bd49%3A0x5cb504c3469666a!2sMannu%20Bike%20Repair%20Centre!5e0!3m2!1sen!2sin!4v1770802264534!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0, borderRadius: '16px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ===== FLOATING AI CHAT BUTTON (MORPH) ===== */}
      <div
        className={clsx('floating-chat', chatOpen && 'open')}
        id="floatingChat"
      >
        {/* The trigger — visible when chat is closed */}
        <button
          className="chat-trigger"
          onClick={() => setChatOpen(true)}
          aria-label="Open AI Mechanic Chat"
        >
          <span className="chat-trigger-icon">
            <BrainCircuit size={26} />
          </span>
        </button>

        {/* The chat panel — revealed after morph */}
        <div className="chat-window" id="chatWindow">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-avatar premium-glow-icon"><Sparkles size={20} /></span>
              <div>
                <strong>AI Mechanic</strong>
                <span className="chat-status"><span className="pulse-dot pulse-dot--green"></span> Online</span>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setChatOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={clsx('chat-msg', msg.type === 'bot' ? 'chat-msg--bot' : 'chat-msg--user')}>
                <span className="msg-avatar">{msg.type === 'bot' ? '🤖' : '👤'}</span>
                <div className="msg-bubble">
                  {msg.html}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              id="chatInput"
              placeholder="Describe your bike issue..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button className="chat-send" id="chatSend" onClick={sendChatMessage} aria-label="Send message">➤</button>
          </div>
        </div>
      </div>

      {/* ===== WHATSAPP FLOAT ===== */}
      <a
        href="https://wa.me/919811530780?text=Hi!%20I%20need%20bike%20service."
        className="whatsapp-float magnetic-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 448 512" width="22" height="22" fill="currentColor">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
        <span className="whatsapp-label">WhatsApp</span>
      </a>
    </div>
  );
}
