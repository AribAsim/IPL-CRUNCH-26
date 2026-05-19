import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { Flame, ShieldAlert, Compass } from 'lucide-react';
import data from '../data/processed.json';

const InsightBanner = () => {
  const ppTrap = data.ppTrap.filter(t => t.wickets <= 4); // Filter out extremely rare 5+ wicket cases for clean chart

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{item.wickets} Wickets Lost</p>
          <p className="value" style={{ color: 'var(--accent-cyan)' }}>
            Win Probability: <span style={{ fontWeight: 700, color: '#fff' }}>{item.win_pct}%</span>
          </p>
          <p className="value" style={{ fontSize: '11px' }}>
            Based on {item.innings} matches
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ 
      background: 'linear-gradient(135deg, rgba(21, 24, 30, 0.95) 0%, rgba(10, 11, 13, 0.95) 100%)',
      borderColor: 'var(--accent-cyan)',
      boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)',
      marginBottom: '60px',
      padding: '40px'
    }}>
      {/* Category Labels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div className="badge badge-red" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-red)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <Flame size={14} /> key data discovery
        </div>
        <div className="badge badge-blue">
          <Compass size={14} /> surprising insight
        </div>
      </div>

      {/* Dramatic Insight Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        <span style={{ 
          fontSize: '12px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.25em', 
          color: 'var(--accent-red)', 
          fontWeight: 700 
        }}>
          THE 36-BALL ILLUSION
        </span>
        <h2 style={{ 
          fontSize: '38px', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 900, 
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          How the Pursuit of Early Violence <span className="gradient-text-red">Destroys IPL Chases</span>
        </h2>
      </div>

      <div className="grid-cols-2" style={{ gap: '40px', alignItems: 'flex-start' }}>
        {/* Left Side: Cinematic Narrative & Vertical Timeline */}
        <div>
          <p style={{ 
            color: 'var(--text-primary)', 
            fontSize: '17px', 
            fontWeight: 500, 
            marginBottom: '18px',
            lineHeight: 1.5,
            borderLeft: '3px solid var(--accent-red)',
            paddingLeft: '16px'
          }}>
            "Teams mistake the Powerplay for a launchpad. In reality, it is a minefield where one extra step of aggression costs the entire game."
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.7 }}>
            Modern T20 analytics demands early boundary hitting to exploit field restrictions. Yet, the data exposes a brutal truth: <strong>the marginal utility of a fast start is completely obliterated by the loss of raw wickets.</strong> When a team loses early wickets, they lose the tactical leverage to dictate terms to the spinner in the middle overs, leading to slow runs and a collapse in win probability.
          </p>
          
          {/* Vertical Timeline Breakdown */}
          <div style={{ 
            position: 'relative', 
            paddingLeft: '24px', 
            borderLeft: '2px dashed rgba(255,255,255,0.1)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px', 
            marginBottom: '24px',
            marginTop: '24px'
          }}>
            {/* Timeline nodes */}
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-35px', 
                top: '2px', 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: 'var(--accent-green)', 
                border: '4px solid #11151d',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
              }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-green)' }}>
                  0 Wickets Lost: The Golden Zone (67.56% Win Rate)
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  Maximum batting depth preserved. Middle overs can be dominated with spinners forced to bowl to set batters.
                </span>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-35px', 
                top: '2px', 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: 'var(--accent-blue)', 
                border: '4px solid #11151d'
              }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-blue)' }}>
                  1 Wicket Lost: Stable Control (56.70% Win Rate)
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  A minor speed bump. The batting lineup retains enough leverage to maintain momentum.
                </span>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-35px', 
                top: '2px', 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: 'var(--accent-gold)', 
                border: '4px solid #11151d',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)'
              }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  2 Wickets Lost: The Tipping Point (40.68% Win Rate)
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  The collapse begins. A <strong>-16.02%</strong> drop in win rate, forcing the middle order into an immediate, defensive rebuild.
                </span>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-35px', 
                top: '2px', 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: 'var(--accent-red)', 
                border: '4px solid #11151d',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
              }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-red)' }}>
                  3+ Wickets Lost: Fatal Damage (25.90% Win Rate)
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  The chase is effectively dead. Teams are reduced to a microscopic 25.9% chance as the tail gets exposed early.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Infographic & Visual Annotations */}
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          padding: '28px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)'
        }}>
          <h4 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '13px', 
            textTransform: 'uppercase', 
            color: 'var(--text-secondary)', 
            marginBottom: '20px', 
            letterSpacing: '0.1em', 
            textAlign: 'center',
            fontWeight: 600
          }}>
            Powerplay Wickets Lost vs Win %
          </h4>
          
          {/* Recharts BarChart with Tipping Point */}
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ppTrap} margin={{ top: 15, right: 10, left: 10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="wickets" stroke="var(--text-secondary)" tickLine={false} label={{ value: 'Wickets Lost', position: 'bottom', offset: -5, fill: 'var(--text-muted)', fontSize: 10, letterSpacing: '0.05em' }} />
                <YAxis stroke="var(--text-secondary)" tickLine={false} unit="%" domain={[0, 100]} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <ReferenceLine 
                  y={50} 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: '50% Win Benchmark', 
                    fill: 'var(--text-muted)', 
                    position: 'top', 
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }} 
                />
                <Bar dataKey="win_pct" name="Win %" radius={[6, 6, 0, 0]}>
                  {ppTrap.map((entry, index) => {
                    const colors = [
                      'var(--accent-green)',
                      'var(--accent-blue)',
                      'var(--accent-gold)',
                      'var(--accent-red)',
                      '#991b1b'
                    ];
                    return <Cell key={`cell-${index}`} fill={colors[index] || 'var(--text-muted)'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Storytelling Annotations & Visual Collapse Indicator */}
          <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-red)', fontWeight: 600 }}>
                  Probability Collapse
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  0 Wickets vs 2 Wickets (-26.88% Gap)
                </span>
              </div>
              
              {/* Visual Collapse Progress Bar */}
              <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: 0, 
                  top: 0, 
                  height: '100%', 
                  width: '67.56%', 
                  background: 'var(--accent-green)',
                  borderRadius: '4px 0 0 4px'
                }} />
                <div style={{ 
                  position: 'absolute', 
                  left: '40.68%', 
                  top: 0, 
                  height: '100%', 
                  width: '26.88%', 
                  background: 'var(--accent-red)',
                  opacity: 0.8
                }} />
                {/* 50% Anchor line */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: '2px',
                  height: '100%',
                  background: '#fff',
                  opacity: 0.3
                }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '4px' }}>
                <div style={{ color: 'var(--accent-red)', marginTop: '2px' }}>
                  <ShieldAlert size={15} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                  <strong>The 50% Flip:</strong> Losing just 2 wickets during the initial 36 balls instantly flips the match in the opponent's favor, tanking win odds from a dominant <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>67.6%</span> to a losing <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>40.7%</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Documentary-Style Tactical Verdict */}
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            borderLeft: '4px solid var(--accent-cyan)', 
            padding: '14px 18px', 
            borderRadius: '0 8px 8px 0',
            marginTop: '24px'
          }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '12px', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
              <strong>The Tactical Verdict:</strong> Defensive stability in the Powerplay is statistically more predictive of victory than raw scoring rate. Teams that win the IPL build their innings on wickets in hand, not powerplay cameos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightBanner;
