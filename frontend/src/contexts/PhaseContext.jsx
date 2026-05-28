import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPhases } from '../services/office-incharge.service';

const PhaseContext = createContext(null);

export const PhaseProvider = ({ children }) => {
  const [phases, setPhases] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPhases();
      if (res?.data?.success) {
        const sorted = [...(res.data.data || [])].sort((a, b) => a.sequence - b.sequence);
        setPhases(sorted);
        const active = sorted.find(p => p.isActive) || null;
        setCurrentPhase(active);
      } else {
        setError('Failed to load phases');
      }
    } catch (e) {
      console.error('Failed to fetch phases', e);
      setError(e?.message || 'Failed to load phases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhases();
  }, [fetchPhases]);

  const isPhase = (key) => currentPhase?.key === key;
  const isBeforePhase = (key) => {
    if (!currentPhase || !phases.length) return false;
    const idx = phases.findIndex(p => p.key === key);
    const activeIdx = phases.findIndex(p => p.isActive);
    if (idx === -1 || activeIdx === -1) return false;
    return activeIdx < idx;
  };
  const isAfterPhase = (key) => {
    if (!currentPhase || !phases.length) return false;
    const idx = phases.findIndex(p => p.key === key);
    const activeIdx = phases.findIndex(p => p.isActive);
    if (idx === -1 || activeIdx === -1) return false;
    return activeIdx > idx;
  };

  return (
    <PhaseContext.Provider value={{
      phases,
      currentPhase,
      loading,
      error,
      refresh: fetchPhases,
      isPhase,
      isBeforePhase,
      isAfterPhase
    }}>
      {children}
    </PhaseContext.Provider>
  );
};

export const usePhase = () => {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error('usePhase must be used within a PhaseProvider');
  return ctx;
};

export default PhaseContext;
