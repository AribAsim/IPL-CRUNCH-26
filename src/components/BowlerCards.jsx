import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, CircleDot, Activity } from 'lucide-react';
import data from '../data/processed.json';

const BowlerCards = () => {
  const [showAll, setShowAll] = useState(false);
  const bowlers = data.topBowlers;
  const displayedBowlers = showAll ? bowlers : bowlers.slice(0, 5);

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
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            <Shield size={12} style={{ marginRight: '4px' }} /> bowling leaders
          </div>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            The Wicket Hunters (2022–2026)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            BATTING WINS GAMES. BOWLING WINS TOURNAMENTS. THE 5 BOWLERS WHO BREAK BATTING LINEUPS APART.
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
        {displayedBowlers.map((player, index) => {
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
                  : '0 12px 30px rgba(6, 182, 212, 0.15)',
                borderColor: index === 0 ? 'var(--accent-gold)' : 'var(--accent-cyan)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="player-rank">#{index + 1}</div>
              <div className="player-avatar" style={{
                background: index === 0 
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.05))' 
                  : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(0, 0, 0, 0.2))',
                borderColor: index === 0 ? 'var(--accent-gold)' : 'var(--border-color)',
                color: index === 0 ? 'var(--accent-gold)' : 'var(--accent-cyan)'
              }}>
                {initials.toUpperCase()}
              </div>
              <h3 className="player-name">{player.name}</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>wickets</span>
                <div style={{ 
                  fontSize: '28px', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900,
                  color: index === 0 ? 'var(--accent-gold)' : 'var(--text-primary)'
                }}>
                  {player.wickets}
                </div>
              </div>

              <div className="player-stats-grid">
                <div className="player-stat-box">
                  <div className="player-stat-val">{player.matches}</div>
                  <div className="player-stat-lbl">Matches</div>
                </div>
                <div className="player-stat-box">
                  <div className="player-stat-val">{player.economy.toFixed(2)}</div>
                  <div className="player-stat-lbl">Economy</div>
                </div>
                <div className="player-stat-box">
                  <div className="player-stat-val">{player.strike_rate.toFixed(1)}</div>
                  <div className="player-stat-lbl">S/R</div>
                </div>
                <div className="player-stat-box">
                  <div className="player-stat-val">{player.best_figures}</div>
                  <div className="player-stat-lbl">Best</div>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '12px', 
                fontSize: '11px', 
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '8px'
              }}>
                <CircleDot size={12} style={{ color: 'var(--accent-cyan)' }} />
                <span>Dot Balls: <strong>{player.dot_balls}</strong></span>
                {player.five_w > 0 && (
                  <span style={{ color: 'var(--accent-gold)', marginLeft: '6px' }}>
                    | 5W: <strong>{player.five_w}</strong>
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BowlerCards;
