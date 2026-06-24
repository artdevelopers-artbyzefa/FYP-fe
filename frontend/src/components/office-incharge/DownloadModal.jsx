import { useEffect, useState } from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function DownloadModal({ isOpen, onComplete }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    if (isOpen) {
      setPhase('enter');
      const t1 = setTimeout(() => setPhase('generating'), 80);
      const t2 = setTimeout(() => setPhase('done'), 500);
      const t3 = setTimeout(() => {
        setPhase('exit');
        setTimeout(() => onComplete?.(), 300);
      }, 1500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      setPhase('exit');
    }
  }, [isOpen, onComplete]);

  if (!isOpen && phase === 'exit') return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative rounded-3xl shadow-2xl px-10 py-10 flex flex-col items-center text-center max-w-sm w-full mx-4"
        style={{
          backgroundColor: '#ffffff',
          animation: phase === 'enter' ? 'scaleIn 0.25s ease-out' : phase === 'exit' ? 'scaleIn 0.2s ease-in reverse' : 'none',
          transform: phase === 'exit' ? 'scale(0.9)' : 'scale(1)',
          opacity: phase === 'exit' ? '0' : '1',
          transition: 'transform 0.2s ease-in, opacity 0.2s ease-in',
        }}
      >
        <div className="relative w-20 h-20 mb-5">
          {phase === 'done' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center animate-scaleIn"
                style={{ backgroundColor: '#ecfdf5' }}
              >
                <CheckCircle2 size={36} style={{ color: '#059669' }} />
              </div>
            </div>
          ) : phase === 'generating' ? (
            <div
              className="absolute inset-0 rounded-full border-4"
              style={{
                borderColor: '#e2e8f0',
                borderTopColor: '#1e3a8a',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ) : (
            <div
              className="absolute inset-0 rounded-full border-4"
              style={{ borderColor: '#e2e8f0', borderTopColor: '#1e3a8a', animation: 'spin 1s linear infinite' }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            {phase === 'done' ? null : <FileText size={24} style={{ color: '#1e3a8a' }} />}
          </div>
        </div>

        <h3 className="text-base font-bold mb-1" style={{ color: '#0f172a' }}>
          {phase === 'done' ? 'PDF Generated' : 'Generating PDF'}
        </h3>
        <p className="text-xs mb-2" style={{ color: '#64748b' }}>
          {phase === 'done' ? 'Your rubric has been downloaded.' : <>Please wait while we prepare your document.</>}
        </p>
      </div>
    </div>
  );
}
