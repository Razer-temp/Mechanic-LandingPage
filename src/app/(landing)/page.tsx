'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { BrandMarquee } from '@/components/ui/BrandMarquee';
import { Footer } from '@/components/ui/Footer';
import { diagnose, estimateCost, handleConversation, type DiagnosisResult, type CostEstimate, type ConversationResult } from '@/lib/ai-engine';
import { getDeviceInfo } from '@/lib/device';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';

export default function LandingPage() {
  // --- States for Interactions ---
  const [diagnosisText, setDiagnosisText] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const [estBikeType, setEstBikeType] = useState('');
  const [estServiceType, setEstServiceType] = useState('');
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', bike: '', service: '', serviceLocation: 'workshop', address: '' });
  const [serviceLocation, setServiceLocation] = useState('workshop');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ type: 'bot' | 'user'; html: React.ReactNode }[]>([
    { type: 'bot', html: <>Hi! I&apos;m your AI Mechanic assistant. 🏍️<br />Tell me about your bike problem and I&apos;ll help diagnose it!</> }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const supabase = createClient();
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // --- Refs for Animations ---
  const particlesRef = useRef<HTMLDivElement>(null);

  // --- 1. Particles ---
  useEffect(() => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    container.innerHTML = ''; // Clear
    for (let i = 0; i < 30; i++) {
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

  // --- 3. Counters ---
  useEffect(() => {
    const animateCounter = (el: HTMLElement, target: number) => {
      const duration = 2000;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.getAttribute('data-target') || '0');
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- 4. Parallax ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxItems = [
        { selector: '.hero-orb--blue', speed: 0.03 },
        { selector: '.hero-orb--red', speed: -0.02 },
        { selector: '.hero-grid-overlay', speed: 0.01 },
      ];
      parallaxItems.forEach(({ selector, speed }) => {
        const el = document.querySelector(selector) as HTMLElement;
        if (el) el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 5. AI Diagnosis Logic ---
  const handleDiagnosis = () => {
    if (!diagnosisText.trim()) return;
    setIsDiagnosing(true);
    setDiagnosisResult(null);

    setTimeout(async () => {
      const result = diagnose(diagnosisText);
      setDiagnosisResult(result);
      setIsDiagnosing(false);

      if (result) {
        try {
          await supabase.from('ai_diagnoses' as any).insert({
            input_text: diagnosisText,
            result_title: result.title,
            result_urgency: result.urgency,
            result_cost: result.cost,
            metadata: getDeviceInfo()
          });
        } catch (err) {
          console.error('Error saving diagnosis:', err);
        }
      }
    }, 1500);
  };

  const setQuickIssue = (issue: string) => {
    setDiagnosisText(issue);
  };

  // --- 6. Cost Estimator Logic ---
  const handleEstimate = () => {
    if (!estBikeType || !estServiceType) return;
    const result = estimateCost(estBikeType, estServiceType);
    setCostEstimate(result);

    if (result) {
      const saveEstimate = async () => {
        try {
          await supabase.from('ai_estimates' as any).insert({
            bike_type: estBikeType,
            service_type: estServiceType,
            min_cost: result.min,
            max_cost: result.max,
            metadata: getDeviceInfo()
          });
        } catch (err) {
          console.error('Error saving estimate:', err);
        }
      };
      saveEstimate();
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
  const saveChatMessage = async (sessionId: string, role: 'user' | 'bot', content: string) => {
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role,
        content
      });
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  };

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
  }, [chatInput, chatSessionId, supabase]);

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
            <span className="pulse-dot"></span> AI-Powered Workshop
          </div>
          <h1 className="hero-title animate-on-scroll">
            Smart Bike Care.<br />
            <span className="gradient-text">Faster. Better.</span>
          </h1>
          <p className="hero-subtitle animate-on-scroll">
            AI-Powered Two-Wheeler Diagnostics &amp; Repair — Expert mechanics, instant diagnosis, and transparent pricing for your ride.
          </p>
          <div className="hero-ctas animate-on-scroll">
            <a href="#booking" className="btn btn-primary btn-glow">
              <span>🔧</span> Book Service
            </a>
            <a href="#diagnosis" className="btn btn-secondary">
              <span>🤖</span> AI Bike Check
            </a>
            <a href="tel:+919811530780" className="btn btn-outline">
              <span>📞</span> Call Now
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
            <div className="diagnosis-input-card glass-card animate-on-scroll">
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
                <button className="btn btn-primary btn-glow btn-full" id="diagnosisBtn" onClick={handleDiagnosis}>
                  <span>🔍</span> {isDiagnosing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
              </div>
            </div>
            <div className="diagnosis-result-card glass-card animate-on-scroll" id="diagnosisResult">
              {isDiagnosing ? (
                <div className="result-placeholder">
                  <div className="ai-brain-icon" style={{ animation: 'breathe 0.5s ease-in-out infinite' }}>🧠</div>
                  <p>Analyzing {bikeModel ? <>for <strong>{bikeModel}</strong></> : null}...</p>
                </div>
              ) : diagnosisResult ? (
                <div className="diagnosis-output" style={{ padding: '36px', animation: 'fadeInUp 0.5s ease' }}>
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
              { icon: '🔩', title: 'Engine Repair', desc: 'Complete engine overhaul, timing chain, piston repair, and head gasket replacement.', price: 'From ₹1,500' },
              { icon: '⚙️', title: 'Full Servicing', desc: 'Oil change, filter replacement, chain adjustment, spark plug — complete care package.', price: 'From ₹799' },
              { icon: '🛑', title: 'Brake Fix', desc: 'Disc & drum brake pads, brake fluid change, ABS diagnostics, and caliper servicing.', price: 'From ₹500' },
              { icon: '🛢️', title: 'Oil Change', desc: 'Premium synthetic & semi-synthetic engine oil with filter replacement.', price: 'From ₹350' },
              { icon: '🚨', title: 'Emergency Repair', desc: 'Roadside assistance, flat tire, towing service, and emergency breakdown support.', price: 'From ₹299' },
              { icon: '⚡', title: 'Electrical Work', desc: 'Wiring repair, headlight upgrade, battery replacement, ECU diagnostics.', price: 'From ₹400' },
            ].map((s, i) => (
              <div key={i} className="service-card glass-card animate-on-scroll">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service-price">{s.price}</span>
              </div>
            ))}
          </div>
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
              { icon: '🤖', title: 'AI Diagnostics', desc: 'Our AI engine analyzes 1000+ bike symptoms to pinpoint issues before you even visit.' },
              { icon: '👨‍🔧', title: 'Expert Mechanics', desc: 'Certified technicians with 10+ years experience across all bike brands.' },
              { icon: '⚡', title: 'Fast Turnaround', desc: 'Most services completed within 2-4 hours. Same-day delivery guaranteed.' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. AI-powered cost estimation before you commit to any repair.' },
              { icon: '🛡️', title: 'Warranty Assured', desc: '6-month warranty on all repairs. Genuine parts with quality guarantee.' },
              { icon: '📍', title: 'Pickup & Drop', desc: 'Free pick-up and delivery within 10km radius. Hassle-free doorstep service.' },
            ].map((w, i) => (
              <div key={i} className="why-card animate-on-scroll">
                <div className="why-icon-wrap"><span>{w.icon}</span></div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section section-how" id="how-it-works">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">📋 Process</span>
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <p className="section-desc">From diagnosis to repair — seamless, smart, and stress-free.</p>
          </div>
          <div className="steps-timeline">
            {[
              { num: '01', title: 'Describe Your Problem', desc: 'Use our AI chatbot or form to describe your bike\'s issue in plain language.' },
              { num: '02', title: 'AI Analysis', desc: 'Our AI engine analyzes symptoms, estimates costs, and suggests the best repair plan.' },
              { num: '03', title: 'Visit Workshop', desc: 'Bring your bike in — or we\'ll pick it up. Our mechanics verify and start repair.' },
              { num: '04', title: 'Ride Happy', desc: 'Quality-checked repair with warranty. Pay only what was estimated — no surprises.' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.num}>
                <div className="step-card animate-on-scroll">
                  <div className="step-number">{step.num}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="step-connector"></div>}
              </React.Fragment>
            ))}
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
          <div className="estimator-card glass-card animate-on-scroll">
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
              {costEstimate && (
                <div className="estimate-output" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <p className="est-price">
                    {costEstimate.min === 0 && costEstimate.max === 0 ? 'N/A' : `₹${costEstimate.min.toLocaleString()} – ₹${costEstimate.max.toLocaleString()}`}
                  </p>
                  <p className="est-note">{costEstimate.note}</p>
                </div>
              )}
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
          <div className="reviews-grid">
            {[
              { name: 'Rajesh Kumar', bike: 'Honda Activa 6G Owner', avatar: 'RK', text: '"The AI diagnosis was spot-on! It told me my bike had a carburetor issue before I even visited. The repair was done in 3 hours. Incredibly impressed!"' },
              { name: 'Priya Sharma', bike: 'RE Classic 350 Owner', avatar: 'PS', text: '"Best mechanic service in town! The cost estimator was accurate, no hidden charges. My Royal Enfield runs like new. Highly recommended!"' },
              { name: 'Amit Verma', bike: 'KTM Duke 200 Owner', avatar: 'AV', text: '"Emergency breakdown at midnight — they picked up my bike and had it ready by morning. The WhatsApp updates kept me informed. Lifesavers!"' },
            ].map((r, i) => (
              <div key={i} className="review-card glass-card animate-on-scroll">
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
      </section>

      {/* ===== BOOKING FORM ===== */}
      <section className="section section-booking" id="booking">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-tag">📅 Book Now</span>
            <h2 className="section-title">Schedule Your <span className="gradient-text">Service</span></h2>
            <p className="section-desc">Fill in the form and we&apos;ll confirm your slot within minutes.</p>
          </div>
          <div className="booking-card glass-card animate-on-scroll">
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
                  <p><a href="mailto:hello@smartbikepro.in">hello@smartbikepro.in</a></p>
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

      {/* ===== FLOATING AI CHAT BUTTON ===== */}
      <div className={clsx('floating-chat', chatOpen && 'open')} id="floatingChat">
        <button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)} aria-label="Open AI Mechanic Chat">
          <span className="chat-icon">🤖</span>
          <span className="chat-label">AI Mechanic</span>
          <span className="chat-close">✕</span>
        </button>
        <div className="chat-window glass-card" id="chatWindow">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-avatar">🤖</span>
              <div>
                <strong>AI Mechanic</strong>
                <span className="chat-status"><span className="pulse-dot pulse-dot--green"></span> Online</span>
              </div>
            </div>
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
      <a href="https://wa.me/919811530780?text=Hi!%20I%20need%20bike%20service." className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        💬
      </a>
    </div>
  );
}
