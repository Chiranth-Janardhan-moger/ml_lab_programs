import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import experimentsData from '../data/experiments.json';
import MarkdownRenderer from './MarkdownRenderer';
import Toast from './Toast';

export default function CardDetail() {
  const { id } = useParams();
  const [prevId, setPrevId] = useState(id);
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);

  if (id !== prevId) {
    setPrevId(id);
    setLoading(true);
    setActiveOptionIndex(0);
  }

  // Load experiment data
  useEffect(() => {
    const found = experimentsData.find((item) => item.id === id);
    
    // Simulate premium loader skeleton for AI generation
    const timer = setTimeout(() => {
      if (found) {
        setExperiment(found);
      }
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!experiment) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Experiment Not Found</h2>
        <Link to="/" className="glass-btn" style={{ marginTop: '20px' }}>Back to Home</Link>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  // Copy individual command triggered toast
  const handleCopyCommand = () => {
    showToast('Command Copied Successfully');
  };

  const hasOptions = experiment && experiment.options && experiment.options.length > 0;
  const currentCommands = hasOptions ? experiment.options[activeOptionIndex].commands : (experiment.commands || '');

  // Extract and copy only the python code block
  const copyPythonCode = () => {
    const match = currentCommands.match(/```python\n([\s\S]*?)```/);
    const pythonCode = match ? match[1].trim() : '';

    if (pythonCode) {
      navigator.clipboard.writeText(pythonCode)
        .then(() => showToast('Python Code Copied Successfully'))
        .catch(err => console.error('Failed to copy python code:', err));
    } else {
      showToast('No Python code found to copy');
    }
  };

  return (
    <div className="fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      
      {/* Top Controls bar - integrated inside page flow */}
      <div className="detail-header-controls">
        {/* Back button with premium left arrow icon */}
        <Link to="/" className="glass-btn" style={{ minWidth: '44px', justifyContent: 'center', padding: '12px 14px' }} title="Back to Home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        
        <div className="detail-copy-actions">
          <button onClick={copyPythonCode} className="glass-btn glass-btn-primary" style={{ gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy Code
          </button>
        </div>
      </div>

      {/* Experiment Title Block */}
      <div style={{ paddingBottom: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          {experiment.isOpenEnded ? 'Open-Ended Experiment' : 'Machine Learning Lab Manual · Exercise'} {experiment.number}
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '-0.5px' }}>
          {experiment.title}
        </h1>
      </div>

      {/* Problem Statement Block - full width */}
      <div style={{ 
        padding: '24px', 
        background: 'rgba(59, 130, 246, 0.04)', 
        borderRadius: '16px', 
        borderLeft: '4px solid var(--accent-primary)',
        borderTop: '1px solid rgba(59, 130, 246, 0.08)',
        borderRight: '1px solid rgba(59, 130, 246, 0.08)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.08)'
      }}>
        <h4 style={headingStyle}>Problem Statement</h4>
        <p style={{ color: 'var(--text-primary)', fontStyle: 'italic', fontSize: '16px', marginTop: '8px' }}>{experiment.question}</p>
      </div>

      {/* Commands & Configuration Section - full width */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h4 style={headingStyle}>Commands & Configuration</h4>
          
          {/* Dynamic option switcher if available */}
          {hasOptions && (
            <div style={{ 
              display: 'inline-flex', 
              background: 'rgba(15, 23, 42, 0.04)', 
              borderRadius: '12px', 
              padding: '4px',
              border: '1px solid var(--glass-border)'
            }}>
              {experiment.options.map((opt, idx) => (
                <button
                   key={opt.name}
                   onClick={() => setActiveOptionIndex(idx)}
                   style={{
                     padding: '6px 16px',
                     borderRadius: '8px',
                     border: 'none',
                     fontFamily: 'var(--font-sans)',
                     fontSize: '13px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease',
                     background: activeOptionIndex === idx ? 'var(--glass-bg)' : 'transparent',
                     color: activeOptionIndex === idx ? 'var(--accent-primary)' : 'var(--text-secondary)',
                     boxShadow: activeOptionIndex === idx ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                   }}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Render */}
        <MarkdownRenderer content={currentCommands} onCopyCommand={handleCopyCommand} />
      </div>

      {/* Copy notification popup */}
      <Toast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}

const headingStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  textAlign: 'left'
};

/* Pulse Loader Skeleton Component */
function SkeletonLoader() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px', animation: 'skeletonPulse 1.5s infinite ease-in-out' }}>
      <div className="detail-header-controls">
        <div style={{ width: '44px', height: '40px', background: 'var(--glass-border)', borderRadius: '12px' }}></div>
        <div className="detail-copy-actions">
          <div style={{ width: '150px', height: '40px', background: 'var(--glass-border)', borderRadius: '12px' }}></div>
          <div style={{ width: '180px', height: '40px', background: 'var(--glass-border)', borderRadius: '12px' }}></div>
        </div>
      </div>

      <div>
        <div style={{ width: '180px', height: '14px', background: 'var(--glass-border)', borderRadius: '4px', marginBottom: '12px' }}></div>
        <div style={{ width: '380px', height: '36px', background: 'var(--glass-border)', borderRadius: '6px' }}></div>
      </div>

      <div style={{ padding: '24px', background: 'var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '120px', height: '16px', background: 'rgba(15,23,42,0.1)', borderRadius: '4px' }}></div>
        <div style={{ width: '90%', height: '14px', background: 'rgba(15,23,42,0.06)', borderRadius: '4px' }}></div>
        <div style={{ width: '95%', height: '14px', background: 'rgba(15,23,42,0.06)', borderRadius: '4px' }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '160px', height: '16px', background: 'var(--glass-border)', borderRadius: '4px' }}></div>
        <div style={{ width: '100%', height: '120px', background: 'var(--glass-border)', borderRadius: '12px' }}></div>
      </div>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
