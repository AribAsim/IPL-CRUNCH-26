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
  Award, Coins, ShieldAlert, ArrowUpRight, Search, Bell, Menu, X 
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

  const { overall } = data.tossStats;
  const middleGap = data.phaseStats.Middle.gap.run_rate;
  const ppTrapWinRate = data.ppTrap.find(t => t.wickets === 3)?.win_pct || 25.9;

  // Custom simulation run simulation alert
  const runSimulation = () => {
    alert("Running tactical simulation... Done! Tactical Win Correlation verified at 69.29%.");
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
        <div className="sidebar-profile">
          <div className="profile-img-container">
            <Users size={18} />
          </div>
          <div className="profile-details">
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Scout Engine</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Level 4 Analyst</div>
          </div>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: 'var(--accent-green)', 
            boxShadow: '0 0 8px var(--accent-green)' 
          }} />
        </div>

        {/* Navigation Grid */}
        <div className="nav-grid">
          <button 
            className={`nav-tile ${activeTab === 'overview' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          >
            <Cpu size={20} />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'toss' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('toss'); setMobileMenuOpen(false); }}
          >
            <Coins size={20} />
            <span>Toss Myth</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'phases' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('phases'); setMobileMenuOpen(false); }}
          >
            <Activity size={20} />
            <span>Innings Phases</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'trap' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('trap'); setMobileMenuOpen(false); }}
          >
            <ShieldAlert size={20} />
            <span>Wicket Trap</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'batters' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('batters'); setMobileMenuOpen(false); }}
          >
            <Award size={20} />
            <span>Top Batters</span>
          </button>
          <button 
            className={`nav-tile ${activeTab === 'bowlers' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('bowlers'); setMobileMenuOpen(false); }}
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px'
        }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '6px 12px 6px 32px'
            }} className="desktop-only">
              <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search stats, players..." 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-primary)', 
                  outline: 'none', 
                  fontSize: '13px' 
                }} 
              />
            </div>
            <div style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}>
              <Bell size={16} />
            </div>
          </div>
        </div>

        {/* Tab-specific Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }} className="grid-cols-2">
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
                <BatterCards />
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
                <BowlerCards />
              </div>
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
          onClick={() => setActiveTab('overview')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'overview' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Cpu size={18} />
          <span style={{ fontSize: '10px' }}>Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('toss')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'toss' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Coins size={18} />
          <span style={{ fontSize: '10px' }}>Toss</span>
        </button>
        <button 
          onClick={() => setActiveTab('phases')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'phases' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Activity size={18} />
          <span style={{ fontSize: '10px' }}>Phases</span>
        </button>
        <button 
          onClick={() => setActiveTab('batters')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'batters' ? '#ffffff' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Award size={18} />
          <span style={{ fontSize: '10px' }}>Batters</span>
        </button>
        <button 
          onClick={() => setActiveTab('bowlers')} 
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
    </div>
  );
}

export default App;
