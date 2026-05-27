import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { BarChart2, Calendar, MapPin, CheckCircle } from 'lucide-react';
import data from '../data/processed.json';

const TossChart = () => {
  const [activeTab, setActiveTab] = useState('overall');
  const { overall, decisions, season_trends, venue_trends } = data.tossStats;

  // Format data for overall win rates
  const overallData = [
    { name: 'Toss Outcome', Won: overall.toss_winner_won_pct, Lost: overall.toss_winner_lost_pct },
    { name: 'Game Strategy', Chasing: overall.chasing_won_pct, 'Batting First': overall.batting_first_won_pct }
  ];

  // Format data for decision win rates
  const decisionData = [
    { name: 'Field First', 'Win Rate %': decisions.field.win_pct, count: decisions.field.total },
    { name: 'Bat First', 'Win Rate %': decisions.bat.win_pct, count: decisions.bat.total }
  ];

  // Filter top 6 and bottom 6 venues for clean visualization
  const topVenues = venue_trends.slice(0, 5);
  const bottomVenues = venue_trends.slice(-5);
  const venueData = [...topVenues, ...bottomVenues];

  // Custom tooltips
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="value" style={{ color: item.color }}>
              {item.name}: <span style={{ fontWeight: 700, color: '#fff' }}>{item.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">Season {label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="value" style={{ color: item.color }}>
              {item.name}: <span style={{ fontWeight: 700, color: '#fff' }}>{item.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: '8px' }}>
            <BarChart2 size={12} style={{ marginRight: '4px' }} /> toss analysis
          </div>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            THE TOSS ILLUSION
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
            CAPTAINS OVERVALUE THE TOSS. HISTORICAL DATA PROVES THE COIN FLIP IS STATISTICALLY INSIGNIFICANT. THE REAL ADVANTAGE LIES IN KNOWING THE TARGET.
          </p>
        </div>
        
        <div className="tab-group">
          <button 
            className={`tab-btn ${activeTab === 'overall' ? 'active' : ''}`}
            onClick={() => setActiveTab('overall')}
            style={{ position: 'relative' }}
          >
            {activeTab === 'overall' && (
              <motion.div 
                layoutId="activeTossTab"
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
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center' }}>
              <BarChart2 size={14} style={{ marginRight: '6px' }} /> Overall
            </span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
            style={{ position: 'relative' }}
          >
            {activeTab === 'trends' && (
              <motion.div 
                layoutId="activeTossTab"
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
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center' }}>
              <Calendar size={14} style={{ marginRight: '6px' }} /> Trends
            </span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'venues' ? 'active' : ''}`}
            onClick={() => setActiveTab('venues')}
            style={{ position: 'relative' }}
          >
            {activeTab === 'venues' && (
              <motion.div 
                layoutId="activeTossTab"
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
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center' }}>
              <MapPin size={14} style={{ marginRight: '6px' }} /> Venue Bias
            </span>
          </button>
        </div>
      </div>

      <div className="chart-layout-grid">
        {/* Visualization area */}
        <div style={{ height: '320px', width: '100%', minHeight: '320px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'overall' && (
              <motion.div
                key="overall"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{ height: '100%', width: '100%' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overallData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} />
                    <YAxis stroke="var(--text-secondary)" tickLine={false} unit="%" domain={[0, 100]} width={40} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="Won" fill="var(--accent-blue)" radius={[8, 8, 0, 0]} name="Toss Winner Won" />
                    <Bar dataKey="Lost" fill="rgba(255,255,255,0.15)" radius={[8, 8, 0, 0]} name="Toss Winner Lost" />
                    <Bar dataKey="Chasing" fill="var(--accent-green)" radius={[8, 8, 0, 0]} name="Chasing Won" />
                    <Bar dataKey="Batting First" fill="var(--accent-red)" radius={[8, 8, 0, 0]} name="Batting First Won" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {activeTab === 'trends' && (
              <motion.div
                key="trends"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{ height: '100%', width: '100%' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={season_trends} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="season" 
                      stroke="var(--text-secondary)" 
                      tickLine={false} 
                      tickFormatter={(tick) => {
                        if (!tick) return '';
                        return tick.toString().includes('/') ? tick.split('/')[0] : tick;
                      }}
                    />
                    <YAxis stroke="var(--text-secondary)" tickLine={false} unit="%" domain={[20, 100]} width={40} />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" dataKey="chase_win_pct" stroke="var(--accent-green)" strokeWidth={3} name="Chasing Win %" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="field_choice_pct" stroke="var(--accent-gold)" strokeWidth={3} name="Captain Chose Field %" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {activeTab === 'venues' && (
              <motion.div
                key="venues"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{ height: '100%', width: '100%' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={venueData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="var(--text-secondary)" tickLine={false} unit="%" domain={[0, 100]} />
                    <YAxis dataKey="venue" type="category" stroke="var(--text-secondary)" tickLine={false} width={180} style={{ fontSize: '10px' }} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="toss_win_pct" name="Toss Win %" radius={[0, 6, 6, 0]}>
                      {venueData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.toss_win_pct > 55 ? 'var(--accent-cyan)' : entry.toss_win_pct < 45 ? 'var(--accent-red)' : 'var(--text-muted)'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Narrative bullet points */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {activeTab === 'overall' && (
            <div>
              <div className="insight-block">
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The 50.49% Coin Flip
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Winning the toss guarantees absolutely nothing. Across 1,200+ matches, toss winners secured {overall.toss_winner_won} wins (<strong>{overall.toss_winner_won_pct}%</strong>) vs {overall.toss_winner_lost} losses. It remains a mathematical coin-flip, devoid of structural advantage.
                </p>
              </div>

              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-green)', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Chasing Advantage
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  The toss is neutral, but the format is heavily skewed. Chasing teams win <strong>{overall.chasing_won_pct}%</strong> of the time. The ability to pace an innings to a known target, combined with evening dew, makes batting second structurally safer.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div>
              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-gold)', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Captains' Great Tactical Shift
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  In 2010, captains elected to field just <strong>{season_trends.find(s => s.season === '2010')?.field_choice_pct || 35}%</strong> of the time. Over a decade of painful lessons, tactical orthodoxy inverted. Today's captains ruthlessly exploit the chasing bias, opting to field first <strong>~80%</strong> of the time.
                </p>
              </div>

              <div className="insight-block">
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Data-Driven Evolution
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  This marks the most profound tactical evolution in T20 cricket: the realization that trying to defend a target with a wet ball is a mathematical suicide mission.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'venues' && (
            <div>
              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-cyan)', background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Fortresses
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Some venues defy the 50/50 rule. In Mullanpur (<strong>{venue_trends.find(v => v.venue.includes('Mullanpur'))?.toss_win_pct || 66.7}%</strong>) and Lucknow (<strong>{venue_trends.find(v => v.venue.includes('Lucknow'))?.toss_win_pct || 61.5}%</strong>), winning the toss grants a massive structural advantage, rendering the game heavily skewed before a ball is bowled.
                </p>
              </div>

              <div className="insight-block" style={{ borderLeftColor: 'var(--accent-red)', background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.06) 0%, transparent 100%)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  The Cursed Grounds
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  At Dharamsala and Hyderabad, the toss is a poison chalice. Toss winners suffer plummeting win rates of <strong>{venue_trends.find(v => v.venue.includes('Dharamsala'))?.toss_win_pct || 40.0}%</strong> and <strong>{venue_trends.find(v => v.venue.includes('Rajiv Gandhi'))?.toss_win_pct || 36.0}%</strong> respectively. Here, captaincy decisions consistently backfire against extreme pitch behaviors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TossChart;
