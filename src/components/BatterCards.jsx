import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Zap, Percent, Activity } from 'lucide-react';
import data from '../data/processed.json';

const BatterCards = () => {
  const [showAll, setShowAll] = useState(false);
  const batters = data.topBatters;
  const displayedBatters = showAll ? batters : batters.slice(0, 5);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: '8px' }}>
            <Users size={12} style={{ marginRight: '4px' }} /> batting leaders
          </div>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            The Run Machines (2022–2026)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            THESE BATTERS DON'T JUST SCORE — THEY DICTATE MATCH OUTCOMES. THE ELITE 5 WHO TURN SCOREBOARDS INTO WEAPONS.
          </p>
        </div>
        
        <button 
          className="tab-btn active" 
          onClick={() => setShowAll(!showAll)}
          style={{ cursor: 'pointer', border: '1px solid var(--border-color)', padding: '6px 14px' }}
        >
          {showAll ? 'Show Top 5' : 'Show Top 10'}
        </button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="player-grid"
      >
        {displayedBatters.map((player, index) => {
          // Get initials
          const nameParts = player.name.split(' ');
          const initials = nameParts.length > 1 
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` 
            : player.name.slice(0, 2);

          return (
            <motion.div 
              key={player.name}
              variants={item}
              className="player-card"
              whileHover={{ 
                y: -6, 
                scale: 1.02, 
                boxShadow: index === 0 
                  ? '0 12px 30px rgba(245, 158, 11, 0.15)' 
                  : '0 12px 30px rgba(59, 130, 246, 0.15)',
                borderColor: index === 0 ? 'var(--accent-gold)' : 'var(--accent-blue)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="player-rank">#{index + 1}</div>
              <div className="player-avatar" style={{
                background: index === 0 
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.05))' 
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(0, 0, 0, 0.2))',
                borderColor: index === 0 ? 'var(--accent-gold)' : 'var(--border-color)',
                color: index === 0 ? 'var(--accent-gold)' : 'var(--accent-blue)'
              }}>
                {initials.toUpperCase()}
              </div>
              <h3 className="player-name">{player.name}</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>runs</span>
                <div style={{ 
                  fontSize: '28px', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900,
                  color: index === 0 ? 'var(--accent-gold)' : 'var(--text-primary)'
                }}>
                  {player.runs.toLocaleString()}
                </div>
              </div>

              <div className="player-stats-grid">
                <div className="player-stat-box">
                  <div className="player-stat-val">{player.innings}</div>
                  <div className="player-stat-lbl">Innings</div>
                </div>
                <div className="player-stat-box">
                  <div className="player-stat-val">{player.average}</div>
                  <div className="player-stat-lbl">Average</div>
                </div>
                <div className="player-stat-box">
                  <div className="player-stat-val">{player.strike_rate}</div>
                  <div className="player-stat-lbl">S/R</div>
                </div>
                <div className="player-stat-box">
                  <div className="player-stat-val" style={{ color: player.hundreds > 0 ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                    {player.hundreds} / {player.fifties}
                  </div>
                  <div className="player-stat-lbl">100s / 50s</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BatterCards;
