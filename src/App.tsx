/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  X, 
  Download, 
  Calendar, 
  Send, 
  Bot, 
  Building2, 
  Target, 
  FileText, 
  Check, 
  HelpCircle,
  Menu
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'ai-advisor' | 'schedule' | 'proof'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<string | null>(null);
  
  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regSubmitted, setRegSubmitted] = useState(false);

  // Grant Calculator state
  const [calcSector, setCalcSector] = useState('Deep Tech & AI');
  const [calcStage, setCalcStage] = useState('Seed (Pre-Revenue)');
  const [calcFunding, setCalcFunding] = useState('$500k - $1.5M');
  const [calculatedResult, setCalculatedResult] = useState<{
    matches: number;
    estimatedAmount: string;
    probability: string;
    topGrant: string;
  } | null>(null);

  // AI Chat state
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: "Hello. I am Apex AI, your executive non-dilutive capital advisor. Tell me about your company's core R&D or technology, and I will identify matching government grant programs and compliance strategies." }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 31 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRunCalculator = (e: React.FormEvent) => {
    e.preventDefault();
    // Deterministic mock calculation based on choices
    let matches = 4;
    let amount = '$1.2M - $2.5M';
    let prob = '88%';
    let top = 'SBIR Phase II / Horizon Europe Accelerator';

    if (calcSector === 'Clean Energy & Hardware') {
      matches = 6;
      amount = '$2.0M - $5.0M';
      prob = '92%';
      top = 'DOE Advanced Research Projects Agency (ARPA-E)';
    } else if (calcSector === 'Biotech & Life Sciences') {
      matches = 5;
      amount = '$1.5M - $3.0M';
      prob = '85%';
      top = 'NIH SBIR Fast-Track Grant';
    }

    setCalculatedResult({ matches, estimatedAmount: amount, probability: prob, topGrant: top });
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMsg = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai-grant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiMessages, { role: 'user', content: userMsg }],
          companyDetails: { sector: calcSector, stage: calcStage, goal: calcFunding }
        })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I encountered a connection error. Please verify your API configuration or try again in a moment." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    setRegSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f5f5f7] font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar (Apple 3-zone contract) */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050507]/80 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark */}
          <a href="#" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span>APEX GRANT</span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <button onClick={() => setActiveTab('overview')} className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'overview' ? 'text-white' : 'hover:text-neutral-200'}`}>Overview</button>
            <button onClick={() => setActiveTab('calculator')} className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'calculator' ? 'text-white' : 'hover:text-neutral-200'}`}>Grant Matcher</button>
            <button onClick={() => setActiveTab('ai-advisor')} className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'ai-advisor' ? 'text-white' : 'hover:text-neutral-200'}`}>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Advisor
            </button>
            <button onClick={() => setActiveTab('schedule')} className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'schedule' ? 'text-white' : 'hover:text-neutral-200'}`}>Masterclass</button>
            <button onClick={() => setActiveTab('proof')} className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'proof' ? 'text-white' : 'hover:text-neutral-200'}`}>Case Studies</button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 whitespace-nowrap shrink-0"
            >
              Secure Seat Free
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0c] border-b border-white/10 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
            <button onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} className="text-left text-neutral-300 py-1">Overview</button>
            <button onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }} className="text-left text-neutral-300 py-1">Grant Matcher</button>
            <button onClick={() => { setActiveTab('ai-advisor'); setMobileMenuOpen(false); }} className="text-left text-neutral-300 py-1">AI Advisor</button>
            <button onClick={() => { setActiveTab('schedule'); setMobileMenuOpen(false); }} className="text-left text-neutral-300 py-1">Masterclass Schedule</button>
            <button onClick={() => { setActiveTab('proof'); setMobileMenuOpen(false); }} className="text-left text-neutral-300 py-1">Case Studies</button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-24">
            {/* Hero Section */}
            <section className="text-center space-y-8 pt-8 pb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Masterclass & Non-Dilutive Funding Briefing</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto text-wrap balance leading-tight">
                Government Funding. <br className="hidden md:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Engineered for Ambition.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
                Discover how high-growth technology companies secure non-dilutive government grants up to $2,500,000 without giving up a single share of equity.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/25 flex items-center gap-2 group"
                >
                  <span>Reserve Free Masterclass Seat</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setActiveTab('calculator')}
                  className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <span>Launch Grant Matcher</span>
                </button>
              </div>

              {/* Countdown Ribbon */}
              <div className="pt-6 flex items-center justify-center gap-6 text-neutral-400 text-xs tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Next Session Begins In:</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-white text-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span> : 
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> : 
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            </section>

            {/* Cinematic Hero Image Showcase */}
            <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent z-10" />
              <img 
                src="/src/assets/images/hero_grant_masterclass_1794825670020.jpg" 
                alt="Masterclass Auditorium" 
                referrerPolicy="no-referrer"
                className="w-full h-[520px] object-cover object-center opacity-85 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">Executive Briefing</div>
                  <h3 className="text-2xl font-bold text-white">Precision Capital Architecture for 2026</h3>
                </div>
                <div className="flex items-center gap-6 text-xs text-neutral-300 bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-white font-bold text-base">$480M+</div>
                    <div className="text-neutral-400">Secured for Alumni</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <div className="text-white font-bold text-base">84%</div>
                    <div className="text-neutral-400">Approval Rate</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bento Grid Capabilities */}
            <section className="space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The Apex Methodology</h2>
                <p className="text-neutral-400 max-w-xl mx-auto text-sm">Four pillars of non-dilutive funding acquisition engineered for elite venture-backed and bootstrapped pioneers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-sm space-y-4 hover:border-blue-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">01. Algorithmic Matchmaking</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Instantly cross-reference your technical roadmap with over 1,400 active federal, state, and international innovation grants to eliminate blind submissions.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-sm space-y-4 hover:border-blue-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">02. Proposal Architecture</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Master the exact compliance frameworks, evaluation rubrics, and technical narrative structures demanded by government scientific review panels.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-sm space-y-4 hover:border-blue-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">03. Zero Equity Dilution</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Retain 100% of your cap table while accelerating R&D, scaling manufacturing, and hiring world-class engineering talent on government budgets.
                  </p>
                </div>
              </div>
            </section>

            {/* Dashboard Showcase Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                  Apex Intelligence Suite
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Real-Time Grant Analytics & Pipeline Control</h2>
                <p className="text-neutral-400 leading-relaxed text-sm">
                  Track every milestone of your grant application lifecycle with military-grade precision. Monitor match scores, agency allocations, and submission deadlines in a single unified command interface.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>Automated deadline alerts and compliance checklists</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>Direct integration with federal submission portals</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>AI-powered peer review simulation before filing</span>
                  </div>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => setActiveTab('calculator')}
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <span>Test Grant Matcher Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900">
                <img 
                  src="/src/assets/images/grant_matching_dashboard_1794825669472.jpg" 
                  alt="Grant Matching Dashboard" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: CALCULATOR (GRANT MATCHER) */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-white tracking-tight">Interactive Grant Eligibility Matcher</h1>
              <p className="text-neutral-400 text-sm max-w-lg mx-auto">Input your company parameters to calculate matched government grant opportunities and estimated non-dilutive capital.</p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
              <form onSubmit={handleRunCalculator} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 tracking-wider uppercase">Industry Sector</label>
                  <select 
                    value={calcSector} 
                    onChange={e => setCalcSector(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Deep Tech & AI">Deep Tech & Artificial Intelligence</option>
                    <option value="Clean Energy & Hardware">Clean Energy & Advanced Hardware</option>
                    <option value="Biotech & Life Sciences">Biotech & Life Sciences</option>
                    <option value="Defense & Dual-Use">Defense & Dual-Use Tech</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 tracking-wider uppercase">Company Stage</label>
                  <select 
                    value={calcStage} 
                    onChange={e => setCalcStage(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Pre-seed (R&D)">Pre-Seed / R&D Stage</option>
                    <option value="Seed (Pre-Revenue)">Seed (Pre-Revenue)</option>
                    <option value="Series A/B (Scaling)">Series A / B (Scaling)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 tracking-wider uppercase">Funding Target</label>
                  <select 
                    value={calcFunding} 
                    onChange={e => setCalcFunding(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="$250k - $500k">$250k - $500k</option>
                    <option value="$500k - $1.5M">$500k - $1.5M</option>
                    <option value="$1.5M - $5.0M">$1.5M - $5.0M</option>
                  </select>
                </div>

                <div className="md:col-span-3 pt-4">
                  <button 
                    type="submit"
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run Algorithmic Grant Match Analysis</span>
                  </button>
                </div>
              </form>

              {calculatedResult && (
                <div className="mt-8 p-8 rounded-2xl bg-black/50 border border-blue-500/30 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Analysis Complete</div>
                      <h3 className="text-xl font-bold text-white mt-1">{calcSector} Profile</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Match Probability</div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono">{calculatedResult.probability}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="text-xs text-neutral-400">Eligible Active Programs</div>
                      <div className="text-2xl font-bold text-white font-mono">{calculatedResult.matches} Agencies</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="text-xs text-neutral-400">Estimated Non-Dilutive Allocation</div>
                      <div className="text-2xl font-bold text-blue-400 font-mono">{calculatedResult.estimatedAmount}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-blue-300 font-medium">Top Priority Recommendation</div>
                      <div className="text-sm font-bold text-white mt-0.5">{calculatedResult.topGrant}</div>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                    >
                      Claim Grant Roadmap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AI ADVISOR */}
        {activeTab === 'ai-advisor' && (
          <div className="max-w-4xl mx-auto space-y-8 py-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-white tracking-tight">Apex AI Grant Strategist</h1>
              <p className="text-neutral-400 text-sm max-w-lg mx-auto">Consult our generative AI advisor powered by Gemini to refine your grant pitch and discover optimal funding pathways.</p>
            </div>

            <div className="rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
              {/* Chat Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-white/10'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-300 shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-neutral-800 text-neutral-400 text-sm px-5 py-3 rounded-2xl border border-white/10 animate-pulse">
                      Apex AI is analyzing grant compliance frameworks...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendAiMessage} className="p-4 bg-black/60 border-t border-white/10 flex items-center gap-3">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  placeholder="Ask about SBIR requirements, Horizon Europe, or describe your R&D project..."
                  className="flex-1 bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit"
                  disabled={aiLoading || !aiInput.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm transition-colors flex items-center gap-2 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULE / MASTERCLASS */}
        {activeTab === 'schedule' && (
          <div className="max-w-4xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-white tracking-tight">Masterclass Schedule & Access</h1>
              <p className="text-neutral-400 text-sm max-w-lg mx-auto">Select an upcoming live executive briefing session led by our senior grant strategists.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'session-1', date: 'Tomorrow, 10:00 AM EST', title: 'SBIR / STTR Fast-Track Mastery', seats: '7 seats remaining', speaker: 'Dr. Marcus Vance (Former DoD Program Manager)' },
                { id: 'session-2', date: 'Thursday, 2:00 PM EST', title: 'European & International Non-Dilutive Funding', seats: '12 seats remaining', speaker: 'Elena Rostova (Horizon Europe Advisor)' },
                { id: 'session-3', date: 'Friday, 11:00 AM EST', title: 'Defense & Dual-Use Grant Architecture', seats: '4 seats remaining', speaker: 'Col. Robert Sterling (Ret.)' },
                { id: 'session-4', date: 'Next Monday, 1:00 PM EST', title: 'AI & Deep Tech R&D Grant Blueprint', seats: '9 seats remaining', speaker: 'Sarah Jenkins (Apex Chief Strategist)' },
              ].map(session => (
                <div key={session.id} className="p-8 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl space-y-6 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{session.date}</span>
                      <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">{session.seats}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{session.title}</h3>
                    <p className="text-neutral-400 text-sm">{session.speaker}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedWebinar(session.title); setIsModalOpen(true); }}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-blue-600 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Reserve Session Seat</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROOF / CASE STUDIES */}
        {activeTab === 'proof' && (
          <div className="max-w-5xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-white tracking-tight">Verified Proof of Impact</h1>
              <p className="text-neutral-400 text-sm max-w-lg mx-auto">Read how our alumni companies secured millions in non-dilutive government capital without equity loss.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { company: 'Quantum Optics Lab', amount: '$2,400,000', grant: 'NSF SBIR Phase II', quote: 'Apex gave us the exact compliance playbook and narrative architecture required by NSF reviewers. Funded in 4 months.' },
                { company: 'AeroSynth Dynamics', amount: '$1,850,000', grant: 'DoD Air Forceworks', quote: 'We went from zero defense contracting experience to securing a multi-million non-dilutive award with Apex guidance.' },
                { company: 'BioGrid AI', amount: '$1,500,000', grant: 'NIH Fast-Track Grant', quote: 'The AI grant matching and peer review feedback loops saved us hundreds of hours of trial and error.' },
                { company: 'VoltGrid Energy', amount: '$3,100,000', grant: 'DOE ARPA-E Award', quote: 'Absolute masterclass in clean energy funding. Retained 100% equity while accelerating our prototype 2 years ahead.' },
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.company}</h3>
                      <p className="text-xs text-neutral-400">{item.grant}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Award Amount</div>
                      <div className="text-xl font-bold text-emerald-400 font-mono">{item.amount}</div>
                    </div>
                  </div>
                  <p className="text-neutral-300 text-sm italic leading-relaxed">"{item.quote}"</p>
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Non-Dilutive Government Grant</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/10 p-8 shadow-2xl relative space-y-6">
            <button 
              onClick={() => { setIsModalOpen(false); setRegSubmitted(false); }}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!regSubmitted ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Free Executive Seat</div>
                  <h3 className="text-2xl font-bold text-white">Reserve Your Masterclass Access</h3>
                  {selectedWebinar && <p className="text-xs text-neutral-400">Selected: <span className="text-white font-medium">{selectedWebinar}</span></p>}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={regName} 
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Alex Vance"
                      className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">Professional Email</label>
                    <input 
                      type="email" 
                      required
                      value={regEmail} 
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">Company Name</label>
                    <input 
                      type="text" 
                      value={regCompany} 
                      onChange={e => setRegCompany(e.target.value)}
                      placeholder="Venture Labs Inc."
                      className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-600/30"
                >
                  Confirm Free Reservation
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Seat Confirmed</h3>
                  <p className="text-neutral-400 text-sm">We have reserved your access pass. A calendar invitation and secure briefing link have been dispatched to <span className="text-white font-medium">{regEmail}</span>.</p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => { setIsModalOpen(false); setRegSubmitted(false); }}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiet Apple-Style Footer */}
      <footer className="border-t border-white/10 mt-24 py-12 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">A</div>
            <span>© 2026 Apex Grant Strategy Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Compliance Disclosures</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
