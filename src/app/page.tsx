'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { diagnose, estimateCost, type DiagnosisResult, type CostEstimate } from '@/lib/ai-engine';
import { useAuth } from '@/context/AuthContext';
import { Wrench, CheckCircle, Zap, Shield, Clock, MapPin, MessageCircle, ChevronDown, Send, User, Bot, AlertTriangle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

export default function LandingPage() {
  const { user } = useAuth();
  const [diagnosisText, setDiagnosisText] = useState('');
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [model, setModel] = useState('');

  // Estimator State
  const [bikeType, setBikeType] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ type: 'user' | 'bot'; text: string | React.ReactNode }[]>([
    { type: 'bot', text: "Hi! I'm your AI Mechanic assistant. 🏍️ Tell me about your bike problem and I'll help diagnose it!" }
  ]);

  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Diagnosis Handler
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiagnosis = () => {
    if (!diagnosisText.trim()) return;
    setIsDiagnosing(true);
    setActiveDiagnosis(null);

    setTimeout(() => {
      const result = diagnose(diagnosisText);
      setActiveDiagnosis(result);
      setIsDiagnosing(false);
    }, 1500);
  };

  // Cost Estimation Handler
  const handleEstimate = () => {
    if (!bikeType || !serviceType) return;
    const result = estimateCost(bikeType, serviceType);
    setEstimate(result);
  };

  // Chat Handler
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const result = diagnose(userMsg);
      let botResponse: React.ReactNode;

      if (result) {
        botResponse = (
          <div className="space-y-2">
            <p><strong>{result.title}</strong></p>
            <p className="text-sm opacity-90">{result.causes[0]}. Estimated cost: <span className="text-accent-green font-bold">{result.cost}</span></p>
            <button
              onClick={() => scrollTo('booking')}
              className="text-xs text-accent-base underline font-bold"
            >
              Book Repair Now
            </button>
          </div>
        );
      } else {
        botResponse = "I'm not exactly sure, but one of our experts can check it for you. Would you like to schedule a diagnostic visit?";
      }

      setChatMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="min-h-screen bg-bg-void selection:bg-accent-base/20 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Cinematic Background */}
        <div className="hero-orb hero-orb--blue w-[600px] h-[600px] -top-[10%] -right-[10%] bg-accent-base/30" />
        <div className="hero-orb hero-orb--red w-[450px] h-[450px] -bottom-[10%] -left-[10%] bg-accent-red/20 [animation-delay:-8s]" />
        <div className="absolute inset-0 hero-grid pointer-events-none" />

        <div className="container relative z-10 text-center px-4">
          <div className="animate-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-base/5 border border-accent-base/10 text-accent-base text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-base animate-pulse" />
            AI-Powered Workshop
          </div>

          <h1 className="animate-reveal [transition-delay:100ms] text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
            Smart Bike Care.<br />
            <span className="gradient-text">Faster. Better.</span>
          </h1>

          <p className="animate-reveal [transition-delay:200ms] text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Next-generation diagnostics and precision repairs for your two-wheeler — powered by AI, delivered by experts.
          </p>

          <div className="animate-reveal [transition-delay:300ms] flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('booking')}
              className="btn-primary px-10 py-4 rounded-2xl text-bg-void font-bold text-lg shadow-2xl shadow-accent-base/30 hover:shadow-accent-base/50 transition-all hover:-translate-y-1 w-full sm:w-auto bg-accent-base flex items-center gap-2 justify-center group"
            >
              <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Book Service
            </button>
            <button
              onClick={() => scrollTo('diagnosis')}
              className="px-8 py-4 rounded-2xl border border-white/10 text-text-primary font-bold hover:border-accent-base/50 hover:bg-white/5 transition-all w-full sm:w-auto flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Bot className="w-5 h-5" /> AI Checkup
            </button>
          </div>


          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center animate-in fade-in duration-1000 delay-500">
            {[['15k+', 'Bikes Serviced'], ['98%', 'Happy Riders'], ['50+', 'Daily AI Scans'], ['4.9', 'Avg Rating']].map(([num, label]) => (
              <div key={label}>
                <span className="block text-3xl md:text-4xl font-black gradient-text mb-1">{num}</span>
                <span className="text-xs uppercase tracking-widest text-text-muted font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI DIAGNOSIS ===== */}
      <section id="diagnosis" className="py-24 relative">
        <div className="container">
          <div className="text-center mb-16 animate-reveal">
            <span className="text-accent-base font-bold tracking-widest text-xs uppercase mb-2 block">Powered by AI</span>
            <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-4">Instant <span className="gradient-text">Diagnosis</span></h2>
            <p className="text-text-secondary max-w-xl mx-auto">Describe your bike's symptoms and our AI engine will analyze potential issues in seconds.</p>
          </div>


          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="glass-card p-8 md:p-10 animate-reveal">
              <h3 className="font-heading font-bold text-xl text-text-primary mb-6">What's the issue?</h3>
              <textarea
                value={diagnosisText}
                onChange={(e) => setDiagnosisText(e.target.value)}
                placeholder="e.g. Engine making rattling noise at high speed, hard to start in morning..."
                className="w-full bg-bg-void/50 border border-border-subtle rounded-xl p-4 text-text-primary placeholder:text-text-muted focus:border-accent-base focus:ring-1 focus:ring-accent-base outline-none min-h-[140px] mb-6 transition-all resize-none"
              />
              <div className="flex flex-wrap gap-2 mb-8">
                {['Engine noise', 'Brake squeaking', 'Starting trouble', 'Low mileage', 'Oil leak'].map((tag) => (
                  <button key={tag} onClick={() => setDiagnosisText(tag)} className="px-3 py-1.5 rounded-full bg-accent-base/10 text-accent-base text-xs font-medium hover:bg-accent-base/20 transition-colors border border-accent-base/10">
                    {tag}
                  </button>
                ))}
              </div>
              <button
                onClick={handleDiagnosis}
                disabled={isDiagnosing || !diagnosisText}
                className="w-full py-4 rounded-xl bg-accent-base text-white font-bold hover:bg-accent-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent-base/20"
              >
                {isDiagnosing ? <span className="animate-spin text-xl">◌</span> : <Zap className="w-5 h-5 fill-current" />}
                {isDiagnosing ? 'Analyzing...' : 'Analyze with AI'}
              </button>
            </div>

            <div className="glass-card p-8 md:p-10 min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden animate-reveal [transition-delay:200ms]">
              {activeDiagnosis ? (
                <div className="w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent-base/20 flex items-center justify-center text-2xl">🚨</div>
                    <div>
                      <h3 className="font-bold text-xl text-text-primary">{activeDiagnosis.title}</h3>
                      <span className={clsx("text-xs font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block",
                        activeDiagnosis.urgency === 'high' ? 'bg-accent-red/20 text-accent-red' :
                          activeDiagnosis.urgency === 'medium' ? 'bg-accent-amber/20 text-accent-amber' :
                            'bg-accent-green/20 text-accent-green'
                      )}>
                        {activeDiagnosis.urgency} Urgency
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-text-secondary mb-2 tracking-wider">Possible Causes</h4>
                      <ul className="list-disc list-inside text-text-primary space-y-1 text-sm">
                        {activeDiagnosis.causes.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-bold text-text-secondary mb-2 tracking-wider">Est. Repair Cost</h4>
                      <p className="text-accent-green font-bold text-2xl">{activeDiagnosis.cost}</p>
                    </div>
                    <div className="bg-bg-void/50 p-4 rounded-lg border border-border-subtle">
                      <p className="text-sm text-text-secondary">💡 <strong>Pro Tip:</strong> {activeDiagnosis.tip}</p>
                    </div>
                  </div>

                  <Link href="/signup" className="mt-8 w-full py-3 rounded-xl border border-border-light text-text-primary font-semibold hover:border-accent-base hover:text-accent-base transition-all flex items-center justify-center gap-2">
                    Book Repair Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              ) : (
                <div className="text-center text-text-muted">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-border-glow opacity-50" />
                  <p>AI Analysis results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="py-24 bg-bg-surface/50 border-y border-border-subtle">
        <div className="container">
          <div className="text-center mb-16 animate-reveal">
            <span className="text-accent-violet font-bold tracking-widest text-xs uppercase mb-2 block">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-4">Expert <span className="gradient-text">Services</span></h2>
          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Engine Repair', icon: '🔩', price: '₹1,500', desc: 'Complete engine overhaul, timing chain, piston repair.' },
              { title: 'Full Servicing', icon: '⚙️', price: '₹799', desc: 'Oil change, filter replacement, chain adjustment, washing.' },
              { title: 'Brake Fix', icon: '🛑', price: '₹500', desc: 'Disc/drum brake pads, fluid change, and ABS diagnostics.' },
              { title: 'Oil Change', icon: '🛢️', price: '₹350', desc: 'Premium synthetic engine oil with filter replacement.' },
              { title: 'Emergency', icon: '🚨', price: '₹299', desc: 'Roadside assistance, towing, and flat tire support.' },
              { title: 'Electrical', icon: '⚡', price: '₹400', desc: 'Wiring repair, battery replacement, light upgrades.' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-8 group cursor-default">
                <div className="text-4xl mb-6 group-hover:-translate-y-2 transition-transform duration-500 inline-block">{s.icon}</div>
                <h3 className="font-heading font-bold text-xl text-text-primary mb-2 group-hover:text-accent-base transition-colors">{s.title}</h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Starting From</span>
                  <span className="px-3 py-1 rounded-full bg-accent-green/10 text-accent-green font-bold text-sm border border-accent-green/20">{s.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ESTIMATOR ===== */}
      <section id="estimator" className="py-24 bg-bg-void relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-reveal">
              <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-6">Smart <span className="gradient-text">Cost Estimator</span></h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Price transparency is our promise. Select your bike type and service needed to get an instant cost range before you even book.
              </p>

              <div className="space-y-6">
                {['No hidden labor charges', 'Genuine spare parts pricing', 'Digital invoice provided'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-base/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-accent-base" />
                    </div>
                    <span className="text-text-primary font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-10 relative animate-reveal [transition-delay:200ms]">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Wrench className="w-40 h-40" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Bike Type</label>
                    <select
                      value={bikeType}
                      className="w-full bg-bg-void border border-border-subtle rounded-xl p-3 text-text-primary outline-none focus:border-accent-base"
                      onChange={(e) => setBikeType(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="scooter">Scooter</option>
                      <option value="commuter">Commuter</option>
                      <option value="sport">Sport Bike</option>
                      <option value="cruiser">Cruiser</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Service</label>
                    <select
                      value={serviceType}
                      className="w-full bg-bg-void border border-border-subtle rounded-xl p-3 text-text-primary outline-none focus:border-accent-base"
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="general">General Service</option>
                      <option value="engine">Engine Work</option>
                      <option value="brake">Brakes</option>
                      <option value="oil">Oil Change</option>
                      <option value="electrical">Electrical</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleEstimate}
                  className="w-full py-4 rounded-xl bg-bg-surface border border-border-light hover:border-accent-base text-text-primary font-bold transition-all shadow-md active:scale-95"
                >
                  Calculate Estimate
                </button>

                {estimate && (
                  <div className="bg-bg-void/60 border border-border-accent rounded-xl p-6 text-center animate-in zoom-in-95 duration-300">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 block">Estimated Cost</span>
                    <div className="text-3xl font-black gradient-text mb-2">
                      ₹{estimate.min} – ₹{estimate.max}
                    </div>
                    <p className="text-xs text-text-secondary">{estimate.note}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />

      {/* ===== CHATBOT ===== */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 rounded-full bg-grad-hero text-white shadow-lg shadow-accent-base/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center animate-bounce duration-300"
          >
            <MessageCircle className="w-7 h-7 fill-current" />
          </button>
        )}

        {chatOpen && (
          <div className="w-[360px] h-[500px] glass-card flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300 origin-bottom-right">
            <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-grad-hero flex items-center justify-center text-sm">🤖</div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">AI Mechanic</h4>
                  <span className="text-[10px] text-accent-green font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-text-muted hover:text-text-primary">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={clsx("flex gap-2 max-w-[85%]", msg.type === 'user' ? 'ml-auto flex-row-reverse' : '')}>
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0", msg.type === 'bot' ? 'bg-bg-surface border border-border-subtle' : 'bg-accent-base text-white')}>
                    {msg.type === 'bot' ? '🤖' : <User className="w-4 h-4" />}
                  </div>
                  <div className={clsx("p-3 rounded-2xl text-sm leading-relaxed", msg.type === 'bot' ? 'bg-bg-surface border border-border-subtle text-text-secondary' : 'bg-accent-base text-white')}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-border-subtle bg-bg-surface/30">
              <div className="relative">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit(e)}
                  placeholder="Type a message..."
                  className="w-full bg-bg-void border border-border-subtle rounded-xl py-3 pl-4 pr-12 text-sm text-text-primary outline-none focus:border-accent-base"
                />
                <button
                  onClick={handleChatSubmit}
                  className="absolute right-2 top-2 p-1.5 bg-accent-base text-white rounded-lg hover:bg-accent-dim transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



