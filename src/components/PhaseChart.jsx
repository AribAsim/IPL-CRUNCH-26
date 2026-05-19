import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Target, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import data from '../data/processed.json';

const PhaseChart = () => {
  const [activeMetric, setActiveMetric] = useState('runs');
  const phases = ['Powerplay', 'Middle', 'Death'];
  const { Powerplay, Middle, Death } = data.phaseStats;

  // Format data for runs comparison
  const runsData = [
    { name: 'Powerplay (1-6)', Winner: Powerplay.winner.avg_runs, Loser: Powerplay.loser.avg_runs },
    { name: 'Middle (7-15)', Winner: Middle.winner.avg_runs, Loser: Middle.loser.avg_runs },
    { name: 'Death (16-20)', Winner: Death.winner.avg_runs, Loser: Death.loser.avg_runs }
  ];

  // Format data for run rate comparison
  const rrData = [
    { name: 'Powerplay (1-6)', Winner: Powerplay.winner.avg_run_rate, Loser: Powerplay.loser.avg_run_rate },
    { name: 'Middle (7-15)', Winner: Middle.winner.avg_run_rate, Loser: Middle.loser.avg_run_rate },
    { name: 'Death (16-20)', Winner: Death.winner.avg_run_rate, Loser: Death.loser.avg_run_rate }
  ];

  // Format data for wickets comparison
  const wicketsData = [
    { name: 'Powerplay (1-6)', Winner: Powerplay.winner.avg_wickets, Loser: Powerplay.loser.avg_wickets },
    { name: 'Middle (7-15)', Winner: Middle.winner.avg_wickets, Loser: Middle.loser.avg_wickets },
    { name: 'Death (16-20)', Winner: Death.winner.avg_wickets, Loser: Death.loser.avg_wickets }
  ];

  // Format data for win correlation comparison
  const correlationData = [
    { name: 'Powerplay (1-6)', 'More Runs Win %': Powerplay.correlations.more_runs_win_pct, 'Fewer Wickets Win %': Powerplay.correlations.fewer_wickets_win_pct },
    { name: 'Middle (7-15)', 'More Runs Win %': Middle.correlations.more_runs_win_pct, 'Fewer Wickets Win %': Middle.correlations.fewer_wickets_win_pct },
    { name: 'Death (16-20)', 'More Runs Win %': Death.correlations.more_runs_win_pct, 'Fewer Wickets Win %': Death.correlations.fewer_wickets_win_pct }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const suffix = activeMetric === 'rr' ? ' RPO' : activeMetric === 'wickets' ? ' Wkts' : ' Runs';
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="value" style={{ color: item.color }}>
              {item.name}: <span style={{ fontWeight: 700, color: '#fff' }}>{item.value.toFixed(2)}{suffix}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getChartData = () => {
    switch (activeMetric) {
      case 'runs': return runsData;
      case 'rr': return rrData;
      case 'wickets': return wicketsData;
      case 'corr': return correlationData;
      default: return runsData;
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            <Target size={12} style={{ marginRight: '4px' }} /> phase impact
          </div>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            THE MIDDLE-OVERS CHOKEHOLD
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
            IPL MATCHES ARE NOT WON IN THE POWERPLAY OR THE DEATH. THEY ARE WON IN THE OVERLOOKED MIDDLE OVERS, WHERE CHAMPIONS QUIETLY STRANGLE THE OPPOSITION.
          </p>
        </div>
        
        <div className="tab-group">
          <button 
            className={`tab-btn ${activeMetric === 'runs' ? 'active' : ''}`}
            onClick={() => setActiveMetric('runs')}
            style={{ position: 'relative' }}
          >
            {activeMetric === 'runs' && (
              <motion.div 
                layoutId="activePhaseTab"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  zIndex: 0,
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>Runs</span>
          </button>
          <button 
            className={`tab-btn ${activeMetric === 'rr' ? 'active' : ''}`}
            onClick={() => setActiveMetric('rr')}
            style={{ position: 'relative' }}
          >
            {activeMetric === 'rr' && (
              <motion.div 
                layoutId="activePhaseTab"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  zIndex: 0,
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>Run Rate</span>
          </button>
          <button 
            className={`tab-btn ${activeMetric === 'wickets' ? 'active' : ''}`}
            onClick={() => setActiveMetric('wickets')}
            style={{ position: 'relative' }}
          >
            {activeMetric === 'wickets' && (
              <motion.div 
                layoutId="activePhaseTab"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  zIndex: 0,
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>Wickets</span>
          </button>
          <button 
            className={`tab-btn ${activeMetric === 'corr' ? 'active' : ''}`}
            onClick={() => setActiveMetric('corr')}
            style={{ position: 'relative' }}
          >
            {activeMetric === 'corr' && (
              <motion.div 
                layoutId="activePhaseTab"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  zIndex: 0,
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>Win Correlation</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', lgGridTemplateCols: '3fr 2fr', gap: '32px' }} className="grid-cols-2">
        {/* Visualization area */}
        <div style={{ height: '320px', width: '100%', minHeight: '320px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMetric}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ height: '100%', width: '100%' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} interval={0} tick={{ fontSize: 10 }} />
                  <YAxis 
                    stroke="var(--text-secondary)" 
                    tickLine={false} 
                    unit={activeMetric === 'rr' ? '' : activeMetric === 'corr' ? '%' : ''}
                    domain={activeMetric === 'corr' ? [0, 100] : activeMetric === 'runs' ? [0, 90] : activeMetric === 'rr' ? [0, 12] : [0, 3.5]}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  
                  {activeMetric === 'corr' ? (
                    <>
                      <Bar dataKey="More Runs Win %" fill="var(--accent-cyan)" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Fewer Wickets Win %" fill="var(--accent-gold)" radius={[8, 8, 0, 0]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Winner" fill="var(--accent-blue)" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Loser" fill="rgba(255,255,255,0.15)" radius={[8, 8, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Narrative bullet points */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {activeMetric === 'runs' && (
            <div>
              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-blue)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Silent Scoring Engine
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Winners amass <strong>{Middle.winner.avg_runs} runs</strong> in the Middle overs vs losers' <strong>{Middle.loser.avg_runs}</strong> — a decisive <strong>+{Middle.gap.runs} run</strong> gap. This is where champions build the foundation that death-over fireworks merely finish.
                </p>
              </div>

              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-gold)', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Powerplay Sets the Tone
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Winners outscore losers by <strong>{Powerplay.gap.runs} runs</strong> in the first 6 overs. It's not about explosions — it's about establishing a psychological stranglehold before the middle-overs grind.
                </p>
              </div>
            </div>
          )}

          {activeMetric === 'rr' && (
            <div>
              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-cyan)', background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Death Overs: The Finishing Blow
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Winners score at <strong>{Death.winner.avg_run_rate} RPO</strong> in death overs vs losers' <strong>{Death.loser.avg_run_rate} RPO</strong> — a <strong>+{Death.gap.run_rate} RPO</strong> gap. But this acceleration is only possible because the middle overs built the platform.
                </p>
              </div>

              <div className="insight-block">
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Relentless Middle Tempo
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Winners sustain <strong>{Middle.winner.avg_run_rate} RPO</strong> through the middle overs while losers stall at <strong>{Middle.loser.avg_run_rate} RPO</strong>. This quiet, grinding pressure is what separates title winners from pretenders.
                </p>
              </div>
            </div>
          )}

          {activeMetric === 'wickets' && (
            <div>
              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-red)', background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Death by a Thousand Cuts
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Losers hemorrhage <strong>{Death.loser.avg_wickets} wickets</strong> in the death overs, stranding potential finishers in the dugout. Winners preserve theirs at just <strong>{Death.winner.avg_wickets}</strong>, keeping destructive power at the crease when it matters most.
                </p>
              </div>

              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-gold)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Survive the Powerplay, Win the War
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Winners concede only <strong>{Powerplay.winner.avg_wickets} wickets</strong> in the Powerplay. Losers shed <strong>{Powerplay.loser.avg_wickets}</strong>, triggering a cascade of defensive play that chokes the middle overs.
                </p>
              </div>
            </div>
          )}

          {activeMetric === 'corr' && (
            <div>
              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-cyan)', background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Strongest Predictor of Victory
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <strong>{Middle.correlations.more_runs_win_pct}%</strong> of teams that outscore their opponents in the Middle overs go on to win. No other phase comes close. This is the single most powerful statistical indicator in IPL cricket.
                </p>
              </div>

              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-gold)', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Death Overs: Wickets Trump Runs
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  More death-over runs don't predict wins (47.62% — chases end early). But losing fewer wickets has a <strong>{Death.correlations.fewer_wickets_win_pct}%</strong> correlation with victory. The lesson: keep your finishers alive.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhaseChart;
