import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const SessionContext = createContext(null);

const STORAGE_KEY = 'selectedSessionId';

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSessionState] = useState(null);
  const [loading, setLoading] = useState(true);

  const initFromList = (list) => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const match = savedId ? list.find(s => s._id === savedId || s.id === savedId) : null;
    if (match) {
      setSelectedSessionState(match);
    } else {
      const active = list.find(s => s.isActive) || list[0] || null;
      setSelectedSessionState(active);
      if (active) localStorage.setItem(STORAGE_KEY, active._id || active.id);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiClient.get('/office-incharge/sessions')
      .then(res => {
        if (cancelled) return;
        const list = res?.data?.data || [];
        setSessions(list);
        initFromList(list);
      })
      .catch(e => console.error('Failed to fetch sessions', e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const setSelectedSession = (session) => {
    setSelectedSessionState(session);
    if (session) {
      localStorage.setItem(STORAGE_KEY, session._id || session.id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <SessionContext.Provider value={{
      sessions,
      selectedSession,
      setSelectedSession,
      loading,
      refresh: () => window.location.reload()
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
};

export default SessionContext;
