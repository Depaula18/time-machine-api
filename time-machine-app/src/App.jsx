import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n'; 

export default function App() {
  const [brokenUrl, setBrokenUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snapshotData, setSnapshotData] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); 
  const [historyList, setHistoryList] = useState([]);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if (url) setBrokenUrl(url);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/history');
      const data = await res.json();
      setHistoryList(data);
    } catch (err) {
      console.error("Erro ao buscar histórico", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const searchArchive = async () => {
    if (!brokenUrl) return;
    setLoading(true);
    setError('');
    setSnapshotData(null);

    try {
      const response = await fetch(`http://localhost:8000/api/search?url=${encodeURIComponent(brokenUrl)}`);
      const data = await response.json();

      if (data.error) {
        setError(`🚨 Erro: ${data.error}`);
      } else if (data.found) {
        setSnapshotData({ url: data.url, summary: data.summary });
      } else {
        setError(i18n.language === 'pt' ? 'Infelizmente, esta página se perdeu para sempre.' : 'Unfortunately, this page is lost forever.');
      }
    } catch (err) {
      setError(i18n.language === 'pt' ? 'Falha ao conectar com o servidor.' : 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER ATUALIZADO COM O BOTÃO DE IDIOMA */}
      <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', padding: '20px', borderBottom: '1px solid #334155', backgroundColor: '#1e293b' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => setActiveTab('search')}
            style={{ background: 'none', border: 'none', color: activeTab === 'search' ? '#38bdf8' : '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
            {t('tab_search')}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            style={{ background: 'none', border: 'none', color: activeTab === 'history' ? '#38bdf8' : '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
            {t('tab_history')}
          </button>
        </div>

        {/* Borda separadora e botão de Idioma */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#475569' }}></div>
        
        <button 
          onClick={toggleLanguage}
          style={{ background: '#334155', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          🌐 {i18n.language === 'pt' ? 'PT-BR' : 'EN-US'}
        </button>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
        
        {/* ABA: PESQUISA */}
        {activeTab === 'search' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', textAlign: 'center' }}>{t('title')}</h1>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', textAlign: 'center' }}>{t('subtitle')}</p>
            
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '10px', border: '1px solid #334155', width: '100%', wordWrap: 'break-word', textAlign: 'center' }}>
              <strong style={{ color: '#38bdf8' }}>{t('target_url')} </strong> {brokenUrl || t('no_url')}
            </div>

            {error && <div style={{ marginTop: '20px', color: '#f87171', backgroundColor: '#450a0a', padding: '10px 20px', borderRadius: '8px' }}>{error}</div>}

            <button onClick={searchArchive} disabled={loading || !brokenUrl} style={{ marginTop: '30px', padding: '15px 30px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: loading ? '#475569' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
              {loading ? t('btn_searching') : t('btn_search')}
            </button>

            {snapshotData && (
              <div style={{ marginTop: '30px', backgroundColor: '#0f766e', padding: '20px', borderRadius: '8px', width: '100%', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#ccfbf1' }}>{t('ai_summary')}</h3>
                <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{snapshotData.summary}"</p>
                <button onClick={() => window.location.href = snapshotData.url} style={{ padding: '10px 20px', backgroundColor: '#134e4a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t('btn_travel')}</button>
              </div>
            )}
          </div>
        )}

        {/* ABA: HISTÓRICO */}
        {activeTab === 'history' && (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#f8fafc' }}>{t('history_title')}</h2>
            {historyList.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>{t('history_empty')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {historyList.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '10px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '10px' }}>{new Date(item.data_resgate).toLocaleString()}</div>
                    <div style={{ color: '#f87171', textDecoration: 'line-through', marginBottom: '5px', wordBreak: 'break-all' }}>{item.url_quebrada}</div>
                    <div style={{ color: '#34d399', fontStyle: 'italic', marginBottom: '15px' }}>" {item.resumo_ia} "</div>
                    <a href={item.url_arquivo} target="_blank" rel="noreferrer" style={{ display: 'inline-block', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>{t('btn_access')}</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}