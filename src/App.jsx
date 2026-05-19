import React from 'react';
import Hero from './components/Hero';
import TossChart from './components/TossChart';
import PhaseChart from './components/PhaseChart';
import BatterCards from './components/BatterCards';
import BowlerCards from './components/BowlerCards';
import InsightBanner from './components/InsightBanner';
import { Shield, Trophy, TrendingUp, Cpu } from 'lucide-react';

function App() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        background: 'rgba(10, 11, 13, 0.8)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0'
      }}>
        <div className="container header-container">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '18px',
              letterSpacing: '-0.02em'
            }}
          >
            <Cpu size={20} style={{ color: 'var(--accent-blue)' }} />
            <span>IPL <span style={{ color: 'var(--accent-blue)' }}>CRUNCH</span> '26</span>
          </div>

          <nav className="nav-bar">
            <button 
              onClick={() => scrollToSection('toss')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)' }}
            >
              Toss Influence
            </button>
            <button 
              onClick={() => scrollToSection('phases')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)' }}
            >
              Innings Phases
            </button>
            <button 
              onClick={() => scrollToSection('insight')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)' }}
            >
              Wicket Trap
            </button>
            <button 
              onClick={() => scrollToSection('players')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)' }}
            >
              Dominant Players
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Main Analysis Container */}
      <main className="container" style={{ flexGrow: 1, paddingBottom: '60px' }}>
        
        {/* Toss Section */}
        <motion.section 
          id="toss" 
          style={{ scrollMarginTop: '100px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <TossChart />
        </motion.section>

        {/* Narrative bridge */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', letterSpacing: '0.05em' }}>
          So the toss is irrelevant. Then what truly decides the outcome? The answer lies in three phases of 120 balls.
        </div>

        {/* Innings Phases Section */}
        <motion.section 
          id="phases" 
          style={{ scrollMarginTop: '100px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <PhaseChart />
        </motion.section>

        {/* Narrative bridge */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', letterSpacing: '0.05em' }}>
          But what happens when teams ignore the data and chase aggression over survival?
        </div>

        {/* Wicket Trap (Surprising Insight) */}
        <motion.section 
          id="insight" 
          style={{ scrollMarginTop: '100px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <InsightBanner />
        </motion.section>

        {/* Narrative bridge */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', letterSpacing: '0.05em' }}>
          Behind every winning strategy, there are individuals who make it possible. Meet the architects.
        </div>

        {/* Players Section */}
        <motion.section 
          id="players" 
          style={{ scrollMarginTop: '100px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '8px' }}>
              The Architects of Victory
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
              Systems win matches. But it takes individual brilliance to turn a good team into a dynasty. These are the players who defined the last five seasons.
            </p>
          </div>
          <BatterCards />
          <BowlerCards />
        </motion.section>

      </main>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-color)', 
        padding: '32px 0', 
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '13px'
      }}>
        <div className="container">
          <p style={{ marginBottom: '8px' }}>
            <strong>The Anatomy of an IPL Win</strong> — IPL Crunch '26 Submission
          </p>
          <p>
            17 seasons. 1,200+ matches. 500,000+ balls. One question: what actually wins in the IPL?
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
