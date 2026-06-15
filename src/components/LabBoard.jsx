import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import experimentsData from '../data/experiments.json';
import GlassTextField from './GlassTextField';

export default function LabBoard() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Search filtering logic (checks title or question content)
  const filteredExperiments = experimentsData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  const standardExercises = filteredExperiments.filter(item => !item.isOpenEnded);
  const openEndedExercises = filteredExperiments.filter(item => item.isOpenEnded);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Centered Global Search Input */}
      <GlassTextField
        value={search}
        onChange={setSearch}
        placeholder="Search experiments by tool, title, or keywords..."
        onClear={() => setSearch('')}
      />

      {filteredExperiments.length > 0 ? (
        <>
          {/* Section 1: Standard Labs */}
          {standardExercises.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                color: 'var(--accent-primary)', 
                textAlign: 'left', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></span>
                Core Experiments
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {standardExercises.map((item) => (
                  <div 
                    key={item.id} 
                    className="glass-card" 
                    onClick={() => navigate(`/card/${item.id}`)}
                    style={{
                      padding: '36px 24px',
                      minHeight: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <div className="card-index">
                      {String(item.number).padStart(2, '0')}
                    </div>
                    <h3 className="card-title">
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Open-Ended Labs */}
          {openEndedExercises.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                color: 'var(--accent-primary)', 
                textAlign: 'left', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></span>
                Open-Ended Experiments
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {openEndedExercises.map((item) => (
                  <div 
                    key={item.id} 
                    className="glass-card" 
                    onClick={() => navigate(`/card/${item.id}`)}
                    style={{
                      padding: '36px 24px',
                      minHeight: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <div className="card-index">
                      {String(item.number).padStart(2, '0')}
                    </div>
                    <h3 className="card-title">
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Laboratory Exercises Found
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            No exercises match the search query "{search}". Try searching for other topics like "KNN", "SVM", or "Naive Bayes".
          </p>
        </div>
      )}
    </div>
  );
}
