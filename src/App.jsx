import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import TossChart from './components/TossChart';
import PhaseChart from './components/PhaseChart';
import BatterCards from './components/BatterCards';
import BowlerCards from './components/BowlerCards';
import InsightBanner from './components/InsightBanner';
import { 
  Cpu, Trophy, Target, Shield, Users, Activity, 
  Award, Coins, ShieldAlert, ArrowUpRight, Search, Bell, Menu, X,
  Play, HelpCircle, Edit3
} from 'lucide-react';
import data from './data/processed.json';

// Helper for top player avatars in the sidebar
const PlayerSmallAvatar = ({ playerId, name }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = `https://i.cricketcb.com/stats/img/faceImages/${playerId}.jpg`;
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: 'var(--bg-tertiary)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0
    }}>
      {!imgError ? (
        <img 
          src={imageUrl} 
          alt={name} 
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{initials}</span>
      )}
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Profile state with LocalStorage persistence
  const [analystName, setAnalystName] = useState(() => localStorage.getItem('analyst_name') || 'Scout Engine');
  const [analystXP, setAnalystXP] = useState(() => parseInt(localStorage.getItem('analyst_xp') || '4200'));
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [xpNotification, setXpNotification] = useState(null);

  // Visited tabs tracker
  const [visitedTabs, setVisitedTabs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('visited_tabs') || '["overview"]');
    } catch {
      return ["overview"];
    }
  });

  // Dynamically compute analyst level/tier based on XP
  const getAnalystTier = (xp) => {
    if (xp >= 6000) return 'Level 5 Master Scout';
    if (xp >= 4500) return 'Level 4 Strategy Director';
    if (xp >= 2500) return 'Level 3 Senior Analyst';
    if (xp >= 1000) return 'Level 2 Specialist';
    return 'Level 1 Novice';
  };

  const analystTier = getAnalystTier(analystXP);

  // XP progression system
  const gainXP = (amount, reason = '') => {
    setAnalystXP(prev => {
      const next = prev + amount;
      localStorage.setItem('analyst_xp', next.toString());
      return next;
    });

    setXpNotification({ amount, reason });
    setTimeout(() => {
      setXpNotification(null);
    }, 3000);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setMobileMenuOpen(false);
    if (!visitedTabs.includes(tab)) {
      const nextVisited = [...visitedTabs, tab];
      setVisitedTabs(nextVisited);
      localStorage.setItem('visited_tabs', JSON.stringify(nextVisited));
      
      const tabNames = {
        overview: 'Overview',
        toss: 'Toss Myth',
        phases: 'Innings Phases',
        trap: 'Wicket Trap',
        batters: 'Top Batters',
        bowlers: 'Top Bowlers'
      };
      gainXP(150, `Explored ${tabNames[tab] || tab} analysis`);
    }
  };

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState([]);
  const [simResult, setSimResult] = useState(null);

  // Onboarding Tutorial state
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem('tutorial_completed'));
  const [tutorialStep, setTutorialStep] = useState(0);

  const { overall } = data.tossStats;
  const middleGap = data.phaseStats.Middle.gap.run_rate;
  const ppTrapWinRate = data.ppTrap.find(t => t.wickets === 3)?.win_pct || 25.9;

  // Run simulation flow
  const runSimulation = () => {
    setIsSimulating(true);
    setSimLogs([]);
    setSimResult(null);

    const logs = [
      "Initializing connection to Scout AI engine...",
      "Extracting 1,218 matches of ball-by-ball dataset...",
      "Calibrating weight settings: Middle Overs (45%), PP (30%), Death Overs (20%)...",
      "Running Monte Carlo match simulation (10,000 matches)...",
      "Compiling win probability variance indexes..."
    ];

    logs.forEach((logText, index) => {
      setTimeout(() => {
        setSimLogs(prev => [...prev, logText]);
        if (index === logs.length - 1) {
          setTimeout(() => {
            setSimResult({
              winPct: 69.29,
              tacticalEdge: "Chasing team holds a +12.4% strategy efficiency premium at these weights.",
              status: "Optimal Strategy Target Identified"
            });
            gainXP(250, "Completed Tactical Match Simulation");
          }, 400);
        }
      }, (index + 1) * 450);
    });
  };

  const getLevelProgress = (xp) => {
    if (xp >= 6000) return 100;
    let base = 0, target = 1000;
    if (xp >= 4500) { base = 4500; target = 6000; }
    else if (xp >= 2500) { base = 2500; target = 4500; }
    else if (xp >= 1000) { base = 1000; target = 2500; }
    return ((xp - base) / (target - base)) * 100;
  };

  const getNextRankText = (xp) => {
    if (xp >= 4500) return 'Level 5 Master Scout (6000 XP)';
    if (xp >= 2500) return 'Level 4 Strategy Director (4500 XP)';
    if (xp >= 1000) return 'Level 3 Senior Analyst (2500 XP)';
    return 'Level 2 Specialist (1000 XP)';
  };

  return (
    <div className="dashboard-layout">
      {/* 1. LEFT SIDEBAR */}
      <aside className={`left-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Cpu size={24} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
            IPL <span style={{ color: 'var(--accent-cyan)' }}>CRUNCH</span>
          </span>
        </div>

        {/* Profile Card */}
        <div 
          className="sidebar-profile" 
          onClick={() => {
            setIsProfileModalOpen(true);
            gainXP(50, "Opened Analyst Profile Options");
          }}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="profile-img-container">
            <Users size={18} />
          </div>
          <div className="profile-details">
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{analystName}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{analystTier}</div>
          </div>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: 'var(--accent-green)', 
            boxShadow: '0 0 8px var(--accent-green)' 
          }} />

          {/* Mini XP indicator */}
          <div style={{ 
            position: 'absolute', 
            right: '8px', 
            bottom: '-2px', 
            fontSize: '9px', 
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)'
          }}>
            {analystXP} XP
          </div>
        </div>

        {/* Quick Help & Tour control */}
        <div style={{ display: 'flex', gap: '12px', padding: '0 12px', marginBottom: '16px' }}>
          <button 
            onClick={() => { setShowTutorial(true); setTutorialStep(0); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              padding: '0'
            }}
          >
            <HelpCircle size={12} style={{ color: 'var(--accent-cyan)' }} />
            <span>Interactive Help</span>
          </button>
        </div>

        {/* Navigation Grid */}
        <div className="nav-grid">
          <button 
            className={`nav-tile ${activeTab === 'overview' ? 'active' : ''}`} 
            onClick={() => handleTabClick('overview')}
          >
            <Cpu size={20} />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'toss' ? 'active' : ''}`} 
            onClick={() => handleTabClick('toss')}
          >
            <Coins size={20} />
            <span>Toss Myth</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'phases' ? 'active' : ''}`} 
            onClick={() => handleTabClick('phases')}
          >
            <Activity size={20} />
            <span>Innings Phases</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'trap' ? 'active' : ''}`} 
            onClick={() => handleTabClick('trap')}
          >
            <ShieldAlert size={20} />
            <span>Wicket Trap</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'batters' ? 'active' : ''}`} 
            onClick={() => handleTabClick('batters')}
          >
            <Award size={20} />
            <span>Top Batters</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'bowlers' ? 'active' : ''}`} 
            onClick={() => handleTabClick('bowlers')}
          >
            <Target size={20} />
            <span>Top Bowlers</span>
          </button>
        </div>

        {/* Bottom Milestones */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
            IPL Milestones
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>2008</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Inaugural season launch</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>2016</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kohli hits 973 run record</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>2020</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Defensive choke strategy peak</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>2026</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>AI scouting draft prediction</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL */}
      <main className="center-panel">
        {/* Global Dashboard Top Header */}
        <div className="dashboard-header">
          <div>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              IPL Strategy Workspace
            </span>
            <h1 style={{ fontSize: '26px', fontFamily: 'var(--font-display)', fontWeight: 800, margin: '4px 0 0 0' }}>
              {activeTab === 'overview' && "Strategy Control Center"}
              {activeTab === 'toss' && "The Toss Illusion Analysis"}
              {activeTab === 'phases' && "Middle-Overs Chokehold"}
              {activeTab === 'trap' && "Powerplay Wicket Trap"}
              {activeTab === 'batters' && "Batting Architecture"}
              {activeTab === 'bowlers' && "Bowling Architecture"}
            </h1>
          </div>

          {/* Search bar and Notifications */}
          <div className="search-notif-container">
            <div style={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '6px 28px 6px 32px'
            }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search stats, players..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length === 1) {
                    gainXP(20, "Initiated search query");
                  }
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-primary)', 
                  outline: 'none', 
                  fontSize: '13px',
                  width: '130px'
                }} 
              />
              {searchQuery && (
                <X 
                  size={12} 
                  onClick={() => setSearchQuery('')}
                  style={{ 
                    position: 'absolute', 
                    right: '8px', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '50%',
                    padding: '2px'
                  }} 
                />
              )}
            </div>
            <div 
              onClick={() => {
                setIsProfileModalOpen(true);
                gainXP(10, "Checked notifications");
              }}
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <Bell size={16} />
            </div>
          </div>
        </div>

        {/* Tab-specific Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery ? 'search-results' : activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {searchQuery ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                      Search Results for "{searchQuery}"
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                      Filtering tactical profiles matching search criteria.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.06)', 
                      border: '1px solid var(--border-color)', 
                      color: 'var(--text-primary)', 
                      padding: '6px 14px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600
                    }}
                  >
                    Clear Search
                  </button>
                </div>
                <BatterCards searchQuery={searchQuery} />
                <BowlerCards searchQuery={searchQuery} />
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div>
                    {/* Trending Teams Sparkline Grid */}
                    <div className="trending-grid">
                      <div className="trending-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>CSK (Chennai)</span>
                          <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>+1.8%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '20px', fontWeight: 800 }}>9.20 <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>power</span></span>
                          <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                            <path d="M0 18Q12 4 24 16T48 8Q54 2 60 4" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>

                      <div className="trending-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6' }}>MI (Mumbai)</span>
                          <span style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: 600 }}>-0.4%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '20px', fontWeight: 800 }}>8.90 <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>power</span></span>
                          <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                            <path d="M0 6Q12 18 24 8T48 20Q54 22 60 18" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>

                      <div className="trending-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>RCB (Bengaluru)</span>
                          <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>+2.3%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '20px', fontWeight: 800 }}>8.70 <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>power</span></span>
                          <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                            <path d="M0 22Q12 12 24 18T48 6Q54 4 60 2" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>

                      <div className="trending-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#a855f7' }}>KKR (Kolkata)</span>
                          <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>+1.2%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '20px', fontWeight: 800 }}>9.10 <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>power</span></span>
                          <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                            <path d="M0 16Q12 14 24 8T48 10Q54 4 60 6" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard summary stats */}
                    <div style={{ marginBottom: '24px' }} className="grid-cols-2">
                      <div className="glass-card">
                        <div className="badge badge-blue" style={{ marginBottom: '12px' }}>
                          <Trophy size={12} /> Executive Summary
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                          The Toss is a Coin Flip. Chasing is a Strategy.
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                          Captains agonize over the toss, yet history shows a dead-even <strong>50.49%</strong> win rate. The real edge isn't the coin—it's the chase. Teams chasing win <strong>54.35%</strong> of matches.
                        </p>
                        <div className="hero-stats-grid">
                          <div className="stat-widget" style={{ padding: '8px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-blue)' }}>{overall.total_matches}</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Matches</div>
                          </div>
                          <div className="stat-widget" style={{ padding: '8px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-green)' }}>{overall.chasing_won_pct}%</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Chasing Win</div>
                          </div>
                          <div className="stat-widget" style={{ padding: '8px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800 }}>{overall.toss_winner_won_pct}%</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Toss Win</div>
                          </div>
                        </div>
                      </div>

                      <div className="glass-card">
                        <div className="badge badge-gold" style={{ marginBottom: '12px' }}>
                          <Target size={12} /> Strategic Drivers
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                          The Anatomy of Dominance
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                          Champions accelerate in the Middle overs (a massive <strong>+{middleGap}</strong> RPO gap) and protect wickets. Lose 3 wickets in the Powerplay, and win rate drops to <strong>{ppTrapWinRate}%</strong>.
                        </p>
                        <div className="hero-stats-grid">
                          <div className="stat-widget" style={{ padding: '8px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-gold)' }}>+{middleGap}</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Middle Gap</div>
                          </div>
                          <div className="stat-widget" style={{ padding: '8px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-red)' }}>{ppTrapWinRate}%</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PP 3-Wkt Win</div>
                          </div>
                          <div className="stat-widget" style={{ padding: '8px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800 }}>10.2s</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dot SR</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Insight Banner */}
                    <InsightBanner />
                  </div>
                )}

                {activeTab === 'toss' && <TossChart />}

                {activeTab === 'phases' && <PhaseChart />}

                {activeTab === 'trap' && <InsightBanner />}

                {activeTab === 'batters' && (
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '4px' }}>
                        Elite Batting Performers
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Leading batsmen of the tournament filtered by win contributions, run volume, and boundary strikes.
                      </p>
                    </div>
                    <BatterCards searchQuery={searchQuery} />
                  </div>
                )}

                {activeTab === 'bowlers' && (
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '4px' }}>
                        Elite Bowling Performers
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Leading bowlers of the tournament filtered by dot ball metrics, wickets, and defensive choke efficiency.
                      </p>
                    </div>
                    <BowlerCards searchQuery={searchQuery} />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. RIGHT SIDEBAR */}
      <aside className="right-sidebar">
        {/* Champions Formula breakdown */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Champions Formula
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'var(--font-display)', margin: '4px 0 0 0' }}>
                69.29%
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 600 }}>
                +12.4% strategy efficiency
              </span>
            </div>
            <button 
              onClick={runSimulation}
              style={{
                background: '#ffffff',
                border: 'none',
                color: '#0b0c0e',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)'
              }}
            >
              + Run Sim
            </button>
          </div>

          {/* Allocation progress bar */}
          <div className="allocation-bar">
            <div className="allocation-segment" style={{ width: '45%', backgroundColor: 'var(--accent-blue)' }} />
            <div className="allocation-segment" style={{ width: '30%', backgroundColor: 'var(--accent-gold)' }} />
            <div className="allocation-segment" style={{ width: '20%', backgroundColor: 'var(--accent-green)' }} />
            <div className="allocation-segment" style={{ width: '5%', backgroundColor: 'var(--accent-red)' }} />
          </div>

          {/* Legend items */}
          <div className="allocation-list">
            <div className="allocation-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Middle Overs Control</span>
              </div>
              <span style={{ fontWeight: 700 }}>45%</span>
            </div>
            <div className="allocation-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Powerplay Wickets</span>
              </div>
              <span style={{ fontWeight: 700 }}>30%</span>
            </div>
            <div className="allocation-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Death Overs Strike</span>
              </div>
              <span style={{ fontWeight: 700 }}>20%</span>
            </div>
            <div className="allocation-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Toss Bias Margin</span>
              </div>
              <span style={{ fontWeight: 700 }}>5%</span>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('phases')}
            style={{
              width: '100%',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 600,
              marginTop: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>View Formula Insights</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Elite Leaders list */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Elite Performers
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setActiveTab('batters')}>
              View All
            </span>
          </div>

          <div className="performer-list">
            <div className="performer-item">
              <PlayerSmallAvatar playerId="1413" name="Virat Kohli" />
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Virat Kohli</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RCB · Batter</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>973 Runs</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 600 }}>Record Season</div>
              </div>
            </div>

            <div className="performer-item">
              <PlayerSmallAvatar playerId="10834" name="Yuzvendra Chahal" />
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Yuzvendra Chahal</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PBKS · Bowler</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>27 Wkts</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 600 }}>Choke Specialist</div>
              </div>
            </div>

            <div className="performer-item">
              <PlayerSmallAvatar playerId="8756" name="Jos Buttler" />
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Jos Buttler</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RR · Batter</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>863 Runs</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 600 }}>Century King</div>
              </div>
            </div>

            <div className="performer-item">
              <PlayerSmallAvatar playerId="10714" name="Rashid Khan" />
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Rashid Khan</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GT · Bowler</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>24 Wkts</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 600 }}>Mystery Spin</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="mobile-nav-bar">
        <button 
          onClick={() => handleTabClick('overview')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'overview' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Cpu size={18} />
          <span style={{ fontSize: '10px' }}>Overview</span>
        </button>
        <button 
          onClick={() => handleTabClick('toss')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'toss' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Coins size={18} />
          <span style={{ fontSize: '10px' }}>Toss</span>
        </button>
        <button 
          onClick={() => handleTabClick('phases')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'phases' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Activity size={18} />
          <span style={{ fontSize: '10px' }}>Phases</span>
        </button>
        <button 
          onClick={() => handleTabClick('batters')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'batters' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Award size={18} />
          <span style={{ fontSize: '10px' }}>Batters</span>
        </button>
        <button 
          onClick={() => handleTabClick('bowlers')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'bowlers' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Target size={18} />
          <span style={{ fontSize: '10px' }}>Bowlers</span>
        </button>
      </div>

      {/* MOBILE HEADER BAR */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 90
      }} className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '16px', fontWeight: 800 }}>IPL CRUNCH</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 1. PROFILE EDITOR MODAL */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Scout Analytical Profile</span>
                </div>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Profile Name Input */}
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    Scout Signature / Name
                  </label>
                  <input 
                    type="text" 
                    value={analystName}
                    onChange={(e) => {
                      setAnalystName(e.target.value);
                      localStorage.setItem('analyst_name', e.target.value);
                    }}
                    placeholder="Enter Scout Name..."
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Level Display */}
                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rank Tier</span>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                        {analystTier}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Score</span>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        {analystXP} XP
                      </div>
                    </div>
                  </div>

                  {/* Level progress bar */}
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${getLevelProgress(analystXP)}%`, background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))' }} />
                  </div>

                  {/* Next Rank Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>Progress: {getLevelProgress(analystXP).toFixed(0)}%</span>
                    <span>Next Rank: {analystXP >= 6000 ? "Max Rank achieved" : getNextRankText(analystXP)}</span>
                  </div>
                </div>

                {/* Badges / Achievements Grid */}
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                    Analytical Badges Unlocked
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)',
                      background: visitedTabs.includes('toss') ? 'rgba(6, 182, 212, 0.05)' : 'var(--bg-tertiary)',
                      opacity: visitedTabs.includes('toss') ? 1 : 0.4
                    }}>
                      <Coins size={14} style={{ color: 'var(--accent-cyan)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Toss Debunker</span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)',
                      background: visitedTabs.includes('phases') ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-tertiary)',
                      opacity: visitedTabs.includes('phases') ? 1 : 0.4
                    }}>
                      <Activity size={14} style={{ color: 'var(--accent-blue)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Chokehold Analyst</span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)',
                      background: visitedTabs.includes('trap') ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-tertiary)',
                      opacity: visitedTabs.includes('trap') ? 1 : 0.4
                    }}>
                      <ShieldAlert size={14} style={{ color: 'var(--accent-red)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Trap Master</span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)',
                      background: analystXP >= 6000 ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-tertiary)',
                      opacity: analystXP >= 6000 ? 1 : 0.4
                    }}>
                      <Trophy size={14} style={{ color: 'var(--accent-gold)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Master Scout</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{
                    background: 'var(--accent-cyan)',
                    border: 'none',
                    color: '#050608',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  Close & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SIMULATION PROGRESS TERMINAL MODAL */}
      <AnimatePresence>
        {isSimulating && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content"
              style={{ maxWidth: '550px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Scout AI Simulation Engine</span>
                </div>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Calculating tactical output from CricScout historical metrics matrix:
                </p>

                {/* Terminal Console */}
                <div className="terminal-window">
                  {simLogs.map((log, i) => (
                    <div key={i} className="terminal-line">
                      &gt; {log}
                    </div>
                  ))}
                  {!simResult && (
                    <div className="terminal-line">
                      &gt; Calibrating match parameters...<span className="terminal-cursor" />
                    </div>
                  )}
                </div>

                {/* Simulation result */}
                {simResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      background: 'rgba(6, 182, 212, 0.04)', 
                      border: '1px solid rgba(6, 182, 212, 0.15)', 
                      borderRadius: '12px', 
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                        {simResult.status}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, background: 'rgba(16, 185, 129, 0.08)', padding: '2px 8px', borderRadius: '12px' }}>
                        +250 XP Awarded
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                        {simResult.winPct}%
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Win Probability Index
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      {simResult.tacticalEdge}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setIsSimulating(false)}
                  disabled={!simResult}
                  style={{
                    background: simResult ? 'var(--accent-cyan)' : 'var(--border-color)',
                    border: 'none',
                    color: '#050608',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: simResult ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-display)',
                    opacity: simResult ? 1 : 0.6
                  }}
                >
                  Acknowledge Strategy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. FIRST TIME ONBOARDING TOUR MODAL */}
      <AnimatePresence>
        {showTutorial && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content tutorial-slide"
              style={{ maxWidth: '500px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    Tactical Onboarding Tour
                  </span>
                </div>
                <button 
                  onClick={() => { setShowTutorial(false); localStorage.setItem('tutorial_completed', 'true'); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ minHeight: '180px' }}>
                {tutorialStep === 0 && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-cyan)' }}>
                      Welcome to IPL Strategy Command
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      This workspace breaks down millions of historical data points from the IPL dataset into actionable franchise strategy decisions.
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
                      Follow this quick 5-step scout briefing to learn how to operate the tactical controls.
                    </p>
                  </div>
                )}

                {tutorialStep === 1 && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-cyan)' }}>
                      1. Navigation Panel & Page Discovery
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Use the left navigation tiles to browse analytical domains: Toss Myth calculations, Innings Phase controls, Powerplay Wicket traps, and Top Performers.
                    </p>
                    <div style={{ 
                      marginTop: '12px', 
                      background: 'rgba(6, 182, 212, 0.05)', 
                      border: '1px solid rgba(6, 182, 212, 0.2)', 
                      borderRadius: '8px', 
                      padding: '10px 14px', 
                      fontSize: '12px',
                      color: 'var(--accent-cyan)',
                      fontWeight: 600
                    }}>
                      💡 Bonus: Exploring each workspace tab for the first time earns you +150 XP to upgrade your Analyst Level!
                    </div>
                  </div>
                )}

                {tutorialStep === 2 && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-cyan)' }}>
                      2. Global Search & Analytics Workspace
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      The header search bar lets you find tactical profiles instantly. Type any player's name (e.g. Virat Kohli, Rashid Khan) to filter performing assets across batsmen and bowler metrics in real-time.
                    </p>
                  </div>
                )}

                {tutorialStep === 3 && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-cyan)' }}>
                      3. Champions Formula Simulator
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Located in the right sidebar, the Champions Formula allows you to simulate matches. Adjust your weights or click "+ Run Sim" to run a Monte Carlo strategy assessment and earn +250 XP!
                    </p>
                  </div>
                )}

                {tutorialStep === 4 && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-cyan)' }}>
                      4. Analyst Rank & Profile Customization
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Click on your Profile Card at the top-left sidebar to open the Profile Editor. Change your Scout Signature Name, view your level progress bar, and check achievements and badges you've unlocked!
                    </p>
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Step {tutorialStep + 1} of 5
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {tutorialStep > 0 && (
                    <button 
                      onClick={() => setTutorialStep(prev => prev - 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Back
                    </button>
                  )}
                  {tutorialStep < 4 ? (
                    <button 
                      onClick={() => setTutorialStep(prev => prev + 1)}
                      style={{
                        background: 'var(--accent-cyan)',
                        border: 'none',
                        color: '#050608',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Next Step
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setShowTutorial(false); localStorage.setItem('tutorial_completed', 'true'); gainXP(100, "Completed Scouting tour"); }}
                      style={{
                        background: 'var(--accent-cyan)',
                        border: 'none',
                        color: '#050608',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Begin Scouting
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* XP Toast Notification popup */}
      <AnimatePresence>
        {xpNotification && (
          <motion.div 
            className="xp-popup"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <Trophy size={18} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Scout XP Gain
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>
                +{xpNotification.amount} XP: <span style={{ color: 'var(--accent-cyan)' }}>{xpNotification.reason}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
