import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, TrendingUp, Users, Target } from 'lucide-react';
import data from '../data/processed.json';

const CountUp = ({ to, duration = 1.5, decimals = 0, prefix = '', suffix = '' }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = parseFloat(to);
    if (isNaN(end)) {
      setValue(to);
      return;
    }
    
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsedTime = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = start + easedProgress * (end - start);
      
      setValue(currentVal);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setValue(end);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [to, duration, isInView]);

  return <span ref={ref}>{prefix}{value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{suffix}</span>;
};

const Hero = () => {
  const { overall } = data.tossStats;
  
  // Calculate average middle over run-rate gap from data
  const middleGap = data.phaseStats.Middle.gap.run_rate;
  const ppTrapWinRate = data.ppTrap.find(t => t.wickets === 3)?.win_pct || 25.9;

  return (
    <section className="hero-section">
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-logo"
          >
            IPL Analytics Report
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            The Anatomy of an <span className="gradient-text-blue">IPL Win</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-subtitle"
          >
            What separates champions from the rest? An elite intelligence report decoding toss illusions, middle-over chokeholds, and player dominance across 1,200+ matches of raw ball-by-ball data.
          </motion.p>
        </div>

        {/* Executive Summary Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid-cols-2"
          style={{ gap: '20px', marginBottom: '40px' }}
        >
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="badge badge-blue" style={{ marginBottom: '16px' }}>
                <Trophy size={14} /> Executive Summary
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
                The Toss is a Coin Flip. Chasing is a Strategy.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                Captains agonize over the toss, yet history shows a dead-even <strong>50.49%</strong> win rate. The real edge isn't the coin—it's the chase. Teams chasing win <strong>54.35%</strong> of matches, fueling a tactical revolution where captains now elect to field first 80% of the time.
              </p>
            </div>
            <div className="hero-stats-grid">
              <div className="stat-widget">
                <div className="stat-val gradient-text-blue"><CountUp to={overall.total_matches} decimals={0} /></div>
                <div className="stat-lbl">Matches</div>
              </div>
              <div className="stat-widget">
                <div className="stat-val" style={{ color: 'var(--accent-green)' }}><CountUp to={overall.chasing_won_pct} decimals={2} suffix="%" /></div>
                <div className="stat-lbl">Chasing Win %</div>
              </div>
              <div className="stat-widget">
                <div className="stat-val"><CountUp to={overall.toss_winner_won_pct} decimals={2} suffix="%" /></div>
                <div className="stat-lbl">Toss Win %</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: '16px' }}>
                <Target size={14} /> Strategic Drivers
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
                The Anatomy of Dominance
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                Champions don't just score; they strangle the opposition. They accelerate ruthlessly in the Middle overs (a massive <strong>+{middleGap}</strong> RPO gap) and fiercely protect early wickets. Lose 3 wickets in the Powerplay, and your win probability collapses to a fatal <strong>{ppTrapWinRate}%</strong>.
              </p>
            </div>
            <div className="hero-stats-grid">
              <div className="stat-widget">
                <div className="stat-val gradient-text-gold"><CountUp to={middleGap} decimals={2} prefix="+" /></div>
                <div className="stat-lbl">Middle RPO Gap</div>
              </div>
              <div className="stat-widget">
                <div className="stat-val" style={{ color: 'var(--accent-red)' }}><CountUp to={ppTrapWinRate} decimals={1} suffix="%" /></div>
                <div className="stat-lbl">PP 3-Wkt Win %</div>
              </div>
              <div className="stat-widget">
                <div className="stat-val"><CountUp to={10.2} decimals={1} suffix="s" /></div>
                <div className="stat-lbl">Dot ball SR</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
