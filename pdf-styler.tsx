import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, X, RefreshCw, Download, Table, Code, BookOpen, Sparkles, Check, ZoomIn, ZoomOut, Maximize2, Type, Layers, Wand2, Brain, Zap } from 'lucide-react';
import * as mammoth from 'mammoth';
import * as Papa from 'papaparse';

const Confetti = ({ active }) => {
  if (!active) return null;
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: -10,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animation: `confetti ${1 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const themes = {
  minimalism: {
    name: 'Минимализм', emoji: '✨', description: 'Чистый и воздушный',
    bg: '#ffffff', text: '#374151', heading: '#111827', accent: '#e5e7eb', link: '#6366f1',
    fontFamily: "'Inter', system-ui, sans-serif", headingFont: "'Inter', system-ui, sans-serif",
    headingWeight: 600, headingSize: 28, textSize: 14, lineHeight: 1.75,
    headingStyle: 'clean', listStyle: 'disc', listColor: '#9ca3af',
    quoteStyle: 'left-border', quoteBorder: '#e5e7eb', quoteBg: 'transparent',
    codeBg: '#f9fafb', tableHeaderBg: '#f9fafb', tableBorder: '#e5e7eb'
  },
  elegant: {
    name: 'Элегантный', emoji: '🖋️', description: 'Классика с засечками',
    bg: '#fffef8', text: '#1f2937', heading: '#111827', accent: '#d4af37', link: '#92400e',
    fontFamily: "'Georgia', 'Times New Roman', serif", headingFont: "'Palatino', 'Georgia', serif",
    headingWeight: 700, headingSize: 26, textSize: 15, lineHeight: 1.8,
    headingStyle: 'underline', listStyle: 'circle', listColor: '#d4af37',
    quoteStyle: 'decorative', quoteBorder: '#d4af37', quoteBg: '#fefce8',
    codeBg: '#fef3c7', tableHeaderBg: '#fef3c7', tableBorder: '#d4af37'
  },
  modern: {
    name: 'Современный', emoji: '🚀', description: 'Смелый и яркий',
    bg: '#ffffff', text: '#334155', heading: '#6366f1', accent: '#818cf8', link: '#4f46e5',
    fontFamily: "'SF Pro Display', system-ui, sans-serif", headingFont: "'SF Pro Display', system-ui, sans-serif",
    headingWeight: 700, headingSize: 30, textSize: 14, lineHeight: 1.7,
    headingStyle: 'gradient', listStyle: 'square', listColor: '#6366f1',
    quoteStyle: 'accent-bg', quoteBorder: '#6366f1', quoteBg: '#eef2ff',
    codeBg: '#f1f5f9', tableHeaderBg: '#eef2ff', tableBorder: '#c7d2fe'
  },
  corporate: {
    name: 'Корпоративный', emoji: '💼', description: 'Деловой и строгий',
    bg: '#ffffff', text: '#1e293b', heading: '#0f172a', accent: '#1e40af', link: '#1d4ed8',
    fontFamily: "'Arial', 'Helvetica', sans-serif", headingFont: "'Arial', 'Helvetica', sans-serif",
    headingWeight: 700, headingSize: 22, textSize: 13, lineHeight: 1.6,
    headingStyle: 'uppercase', listStyle: 'decimal', listColor: '#1e40af',
    quoteStyle: 'professional', quoteBorder: '#1e40af', quoteBg: '#eff6ff',
    codeBg: '#f8fafc', tableHeaderBg: '#dbeafe', tableBorder: '#1e40af'
  },
  creative: {
    name: 'Креативный', emoji: '🎨', description: 'Яркий и выразительный',
    bg: '#fffbf5', text: '#292524', heading: '#dc2626', accent: '#f97316', link: '#ea580c',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif", headingFont: "'Poppins', 'Segoe UI', sans-serif",
    headingWeight: 800, headingSize: 32, textSize: 14, lineHeight: 1.7,
    headingStyle: 'highlight', listStyle: 'emoji', listColor: '#f97316',
    quoteStyle: 'creative', quoteBorder: '#f97316', quoteBg: '#fff7ed',
    codeBg: '#fef2f2', tableHeaderBg: '#ffedd5', tableBorder: '#f97316'
  },
  academic: {
    name: 'Академический', emoji: '🎓', description: 'Научный стиль',
    bg: '#ffffff', text: '#1f2937', heading: '#111827', accent: '#4b5563', link: '#1f2937',
    fontFamily: "'Times New Roman', 'Georgia', serif", headingFont: "'Times New Roman', 'Georgia', serif",
    headingWeight: 700, headingSize: 20, textSize: 14, lineHeight: 2.0,
    headingStyle: 'numbered', listStyle: 'decimal', listColor: '#374151',
    quoteStyle: 'academic', quoteBorder: '#9ca3af', quoteBg: '#f9fafb',
    codeBg: '#f3f4f6', tableHeaderBg: '#f3f4f6', tableBorder: '#6b7280'
  },
  dark: {
    name: 'Тёмный', emoji: '🌙', description: 'Для экранов',
    bg: '#18181b', text: '#e4e4e7', heading: '#fafafa', accent: '#a78bfa', link: '#c4b5fd',
    fontFamily: "'Inter', system-ui, sans-serif", headingFont: "'Inter', system-ui, sans-serif",
    headingWeight: 600, headingSize: 26, textSize: 14, lineHeight: 1.75,
    headingStyle: 'glow', listStyle: 'disc', listColor: '#a78bfa',
    quoteStyle: 'dark', quoteBorder: '#a78bfa', quoteBg: '#27272a',
    codeBg: '#27272a', tableHeaderBg: '#27272a', tableBorder: '#3f3f46'
  }
};

// AI анализ структуры документа
const analyzeWithAI = async (text, onProgress) => {
  onProgress('Отправляем текст на анализ...');
  
  const systemPrompt = `Ты — эксперт по структурированию текста. Проанализируй текст и верни JSON-массив блоков.

ПРАВИЛА:
1. Определяй заголовки по СМЫСЛУ, а не по форматированию
2. Разбивай длинные абзацы на логичные части
3. Выделяй цитаты, если есть прямая речь или выделенные мысли
4. Определяй списки даже без явных маркеров (перечисления через запятую преобразуй в список)
5. Код и технические блоки помечай как code
6. Используй правильную иерархию: h1 для главного заголовка, h2 для разделов, h3 для подразделов

ФОРМАТ ОТВЕТА (только JSON, без markdown):
[
  {"type": "heading", "level": 1, "text": "Главный заголовок"},
  {"type": "heading", "level": 2, "text": "Раздел"},
  {"type": "paragraph", "text": "Текст абзаца"},
  {"type": "bullet", "items": ["пункт 1", "пункт 2"]},
  {"type": "numbered", "items": ["первый", "второй"]},
  {"type": "quote", "text": "Цитата или важная мысль"},
  {"type": "code", "text": "код или технический текст"}
]

Верни ТОЛЬКО валидный JSON без комментариев и пояснений.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324',
        max_tokens: 4000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Проанализируй и структурируй этот текст:\n\n${text.substring(0, 15000)}` }
        ]
      })
    });

    onProgress('Анализируем структуру...');

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Парсим JSON из ответа
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      onProgress('Готово!');
      return parsed;
    }
    
    throw new Error('Не удалось распарсить ответ');
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
};

// Простой парсер как fallback
const parseSimple = (text) => {
  const lines = text.split('\n'), blocks = [];
  let currentList = null, currentListType = null;
  const avgLen = lines.filter(l => l.trim()).reduce((s, l) => s + l.length, 0) / lines.filter(l => l.trim()).length || 50;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], trimmed = line.trim();
    if (!trimmed) { 
      if (currentList) { blocks.push({ type: currentListType, items: currentList }); currentList = null; currentListType = null; } 
      continue; 
    }
    
    // Markdown заголовки
    const hMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (hMatch) {
      if (currentList) { blocks.push({ type: currentListType, items: currentList }); currentList = null; currentListType = null; }
      blocks.push({ type: 'heading', level: hMatch[1].length, text: hMatch[2] });
      continue;
    }
    
    const isShort = trimmed.length < avgLen * 0.5 && trimmed.length < 60;
    const isUpper = trimmed === trimmed.toUpperCase() && /[A-ZА-ЯЁ]/.test(trimmed);
    const nextEmpty = !lines[i + 1]?.trim();
    
    if ((isUpper && trimmed.length > 2) || (isShort && nextEmpty && trimmed.length > 2)) {
      if (currentList) { blocks.push({ type: currentListType, items: currentList }); currentList = null; currentListType = null; }
      blocks.push({ type: 'heading', level: isUpper ? 1 : 2, text: trimmed });
      continue;
    }
    
    if (/^[-•*]\s+/.test(trimmed)) {
      const item = trimmed.replace(/^[-•*]\s+/, '');
      if (currentListType === 'bullet') currentList.push(item);
      else { if (currentList) blocks.push({ type: currentListType, items: currentList }); currentList = [item]; currentListType = 'bullet'; }
      continue;
    }
    
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const item = trimmed.replace(/^\d+[.)]\s+/, '');
      if (currentListType === 'numbered') currentList.push(item);
      else { if (currentList) blocks.push({ type: currentListType, items: currentList }); currentList = [item]; currentListType = 'numbered'; }
      continue;
    }
    
    // Цитаты
    if (trimmed.startsWith('>')) {
      if (currentList) { blocks.push({ type: currentListType, items: currentList }); currentList = null; currentListType = null; }
      blocks.push({ type: 'quote', text: trimmed.replace(/^>\s*/, '') });
      continue;
    }
    
    if (currentList) { blocks.push({ type: currentListType, items: currentList }); currentList = null; currentListType = null; }
    blocks.push({ type: 'paragraph', text: trimmed });
  }
  if (currentList) blocks.push({ type: currentListType, items: currentList });
  return blocks;
};

const parseCsv = (text) => {
  const result = Papa.parse(text, { header: true, skipEmptyLines: true, delimitersToGuess: [',', ';', '\t', '|'] });
  if (result.data.length === 0) return [];
  return [{ type: 'table', headers: result.meta.fields || [], rows: result.data, warning: (result.meta.fields || []).length > 10 }];
};

const formatText = (text) => text
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/_(.+?)_/g, '<em>$1</em>');

const Preview = ({ content, theme, zoom }) => {
  const t = themes[theme];
  
  const getHeadingStyle = (level) => {
    const sizes = { 1: t.headingSize, 2: t.headingSize * 0.8, 3: t.headingSize * 0.65 };
    const base = {
      fontSize: sizes[level],
      fontFamily: t.headingFont,
      fontWeight: t.headingWeight,
      color: t.heading,
      marginBottom: 16,
      lineHeight: 1.3
    };
    
    switch (t.headingStyle) {
      case 'underline':
        return { ...base, borderBottom: `2px solid ${t.accent}`, paddingBottom: 8 };
      case 'gradient':
        return { ...base, background: `linear-gradient(135deg, ${t.heading}, ${t.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
      case 'uppercase':
        return { ...base, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: sizes[level] * 0.85 };
      case 'highlight':
        return { ...base, display: 'inline-block', background: `linear-gradient(180deg, transparent 60%, ${t.accent}40 60%)` };
      case 'glow':
        return { ...base, textShadow: `0 0 20px ${t.accent}50` };
      default:
        return base;
    }
  };
  
  const getQuoteStyle = () => {
    const base = { marginBottom: 16, fontStyle: 'italic' };
    switch (t.quoteStyle) {
      case 'decorative':
        return { ...base, borderLeft: `4px solid ${t.quoteBorder}`, background: t.quoteBg, padding: '16px 20px', borderRadius: '0 8px 8px 0' };
      case 'accent-bg':
        return { ...base, borderLeft: `4px solid ${t.quoteBorder}`, background: t.quoteBg, padding: '16px 20px', borderRadius: 8 };
      case 'creative':
        return { ...base, background: t.quoteBg, padding: '20px 24px', borderRadius: 12, borderLeft: `4px solid ${t.quoteBorder}` };
      case 'professional':
        return { ...base, borderLeft: `3px solid ${t.quoteBorder}`, paddingLeft: 20, color: t.accent };
      case 'dark':
        return { ...base, background: t.quoteBg, padding: '16px 20px', borderRadius: 8, borderLeft: `3px solid ${t.quoteBorder}` };
      default:
        return { ...base, borderLeft: `3px solid ${t.quoteBorder}`, paddingLeft: 16, opacity: 0.9 };
    }
  };
  
  const getListMarker = (index) => {
    if (t.listStyle === 'emoji') {
      const emojis = ['🔹', '🔸', '▫️', '◽'];
      return emojis[index % emojis.length] + ' ';
    }
    return '';
  };

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 24, background: '#f1f5f9' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.3s' }}>
        <div style={{ backgroundColor: t.bg, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: 48, fontFamily: t.fontFamily, color: t.text, lineHeight: t.lineHeight, fontSize: t.textSize }}>
            {content.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.4 }}>
                <FileText size={48} style={{ margin: '0 auto 16px' }} />
                <p>Загрузите файл для превью</p>
              </div>
            )}
            {content.map((block, idx) => {
              if (block.type === 'heading') {
                return <div key={idx} style={{ ...getHeadingStyle(block.level), marginTop: idx > 0 ? 32 : 0 }}>{block.text}</div>;
              }
              if (block.type === 'paragraph') {
                return <p key={idx} style={{ marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: formatText(block.text) }} />;
              }
              if (block.type === 'bullet') {
                return (
                  <ul key={idx} style={{ marginBottom: 16, paddingLeft: t.listStyle === 'emoji' ? 8 : 24, listStyleType: t.listStyle === 'emoji' ? 'none' : t.listStyle }}>
                    {block.items.map((item, i) => (
                      <li key={i} style={{ marginBottom: 8, color: t.text }}>
                        {t.listStyle === 'emoji' && <span style={{ marginRight: 8 }}>{getListMarker(i)}</span>}
                        <span dangerouslySetInnerHTML={{ __html: formatText(item) }} />
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === 'numbered') {
                return (
                  <ol key={idx} style={{ marginBottom: 16, paddingLeft: 24 }}>
                    {block.items.map((item, i) => (
                      <li key={i} style={{ marginBottom: 8 }}><span dangerouslySetInnerHTML={{ __html: formatText(item) }} /></li>
                    ))}
                  </ol>
                );
              }
              if (block.type === 'quote') {
                return <blockquote key={idx} style={getQuoteStyle()}>{block.text}</blockquote>;
              }
              if (block.type === 'code') {
                return <pre key={idx} style={{ fontFamily: "'Fira Code', monospace", fontSize: t.textSize * 0.9, marginBottom: 16, background: t.codeBg, padding: 16, borderRadius: 8, overflow: 'auto' }}>{block.text}</pre>;
              }
              if (block.type === 'table') {
                return (
                  <div key={idx} style={{ overflow: 'auto', marginBottom: 16 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: t.textSize * 0.9 }}>
                      <thead>
                        <tr style={{ backgroundColor: t.tableHeaderBg }}>
                          {block.headers.map((h, i) => (
                            <th key={i} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, borderBottom: `2px solid ${t.tableBorder}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.slice(0, 8).map((row, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${t.tableBorder}30` }}>
                            {block.headers.map((h, j) => (
                              <td key={j} style={{ padding: '10px 16px' }}>{row[h]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeCard = ({ id, theme, active, onClick, onHover }) => (
  <button
    onClick={onClick}
    onMouseEnter={() => onHover(id)}
    onMouseLeave={() => onHover(null)}
    style={{
      width: '100%',
      padding: 14,
      borderRadius: 16,
      border: active ? '2px solid #6366f1' : '2px solid #e5e7eb',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      backgroundColor: active ? '#eef2ff' : '#fff',
      transition: 'all 0.2s',
      transform: active ? 'scale(1.02)' : 'scale(1)',
      boxShadow: active ? '0 4px 12px rgba(99,102,241,0.15)' : '0 1px 3px rgba(0,0,0,0.05)'
    }}
  >
    <div style={{ 
      width: 48, height: 48, borderRadius: 12, backgroundColor: theme.bg, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
      border: `1px solid ${theme.bg === '#ffffff' || theme.bg === '#fffef8' || theme.bg === '#fffbf5' ? '#e5e7eb' : 'transparent'}`,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {theme.emoji}
    </div>
    <div style={{ flex: 1, textAlign: 'left' }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2937', marginBottom: 2 }}>{theme.name}</div>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{theme.description}</div>
    </div>
    {active && <Check size={18} style={{ color: '#6366f1' }} />}
  </button>
);

export default function PDFStyler() {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState([]);
  const [theme, setTheme] = useState('minimalism');
  const [previewTheme, setPreviewTheme] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, analyzing, ready, error
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [useAI, setUseAI] = useState(true);
  const inputRef = useRef(null);

  const activeTheme = previewTheme || theme;

  useEffect(() => {
    const handler = (e) => {
      if (status !== 'ready') return;
      const keys = Object.keys(themes), i = keys.indexOf(theme);
      if (e.key === 'ArrowLeft') setTheme(keys[(i - 1 + keys.length) % keys.length]);
      if (e.key === 'ArrowRight') setTheme(keys[(i + 1) % keys.length]);
      if (e.key === ' ' && !generating) { e.preventDefault(); generatePDF(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [status, theme, generating]);

  const processFile = async (f) => {
    setStatus('loading');
    setError('');
    setZoom(1);
    setAnalysisStatus('Читаем файл...');
    
    if (f.size > 10 * 1024 * 1024) { setError('Файл слишком большой. Максимум — 10 МБ'); setStatus('error'); return; }
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['txt', 'md', 'docx', 'csv'].includes(ext)) { setError('Поддерживаются: txt, md, docx, csv'); setStatus('error'); return; }

    try {
      let text = '';
      let parsed = [];
      
      // Читаем файл
      if (ext === 'docx') {
        const ab = await f.arrayBuffer();
        const r = await mammoth.extractRawText({ arrayBuffer: ab });
        text = r.value;
      } else if (ext === 'csv') {
        text = await f.text();
        parsed = parseCsv(text);
        setFile(f);
        setContent(parsed);
        setStatus('ready');
        return;
      } else {
        text = await f.text();
      }

      if (!text.trim()) {
        setError('Файл пустой');
        setStatus('error');
        return;
      }

      setFile(f);
      
      // Анализ с AI или простой парсер
      if (useAI) {
        setStatus('analyzing');
        try {
          parsed = await analyzeWithAI(text, setAnalysisStatus);
        } catch (e) {
          console.log('AI failed, using simple parser:', e);
          setAnalysisStatus('AI недоступен, используем базовый анализ...');
          parsed = parseSimple(text);
        }
      } else {
        parsed = parseSimple(text);
      }

      if (parsed.length === 0) {
        setError('Не удалось определить структуру');
        setStatus('error');
        return;
      }

      setContent(parsed);
      setStatus('ready');
    } catch (e) {
      console.error(e);
      setError('Не удалось прочитать файл');
      setStatus('error');
    }
  };

  const handleDrop = useCallback((e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }, [useAI]);
  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const resetFile = () => { setFile(null); setContent([]); setStatus('idle'); setError(''); setZoom(1); if (inputRef.current) inputRef.current.value = ''; };

  const generatePDF = async () => {
    setGenerating(true);
    const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    const t = themes[theme];
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210, pageHeight = 297, margin = 25, contentWidth = pageWidth - margin * 2;
    let y = margin;
    const checkPage = (needed) => { if (y + needed > pageHeight - margin) { doc.addPage(); y = margin; } };
    const hexToRgb = (hex) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]; };

    if (theme === 'dark') {
      doc.setFillColor(24, 24, 27);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    } else if (t.bg !== '#ffffff') {
      doc.setFillColor(...hexToRgb(t.bg));
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    for (const block of content) {
      if (block.type === 'heading') {
        const sizes = { 1: t.headingSize / 2.8, 2: t.headingSize * 0.75 / 2.8, 3: t.headingSize * 0.6 / 2.8 };
        const size = sizes[block.level] || sizes[1];
        checkPage(size + 6);
        doc.setFontSize(size);
        doc.setTextColor(...hexToRgb(t.heading));
        doc.setFont('helvetica', 'bold');
        let text = block.text;
        if (t.headingStyle === 'uppercase') text = text.toUpperCase();
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        if (t.headingStyle === 'underline' && block.level === 1) {
          doc.setDrawColor(...hexToRgb(t.accent));
          doc.setLineWidth(0.5);
          doc.line(margin, y + 2, margin + 40, y + 2);
        }
        y += lines.length * size * 0.45 + 5;
      }
      if (block.type === 'paragraph') {
        const size = t.textSize / 2.8;
        doc.setFontSize(size);
        doc.setTextColor(...hexToRgb(t.text));
        doc.setFont('helvetica', 'normal');
        const clean = block.text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/_(.+?)_/g, '$1');
        const lines = doc.splitTextToSize(clean, contentWidth);
        checkPage(lines.length * size * 0.45 + 3);
        doc.text(lines, margin, y);
        y += lines.length * size * 0.45 + 4;
      }
      if (block.type === 'bullet' || block.type === 'numbered') {
        const size = t.textSize / 2.8;
        doc.setFontSize(size);
        doc.setTextColor(...hexToRgb(t.text));
        (block.items || []).forEach((item, i) => {
          const prefix = block.type === 'bullet' ? '• ' : `${i + 1}. `;
          const lines = doc.splitTextToSize(prefix + (item || '').replace(/\*\*(.+?)\*\*/g, '$1'), contentWidth - 8);
          checkPage(lines.length * size * 0.45 + 2);
          doc.text(lines, margin + 6, y);
          y += lines.length * size * 0.45 + 2;
        });
        y += 3;
      }
      if (block.type === 'quote') {
        const size = t.textSize / 2.8;
        const lines = doc.splitTextToSize(block.text || '', contentWidth - 12);
        const blockHeight = lines.length * size * 0.45 + 6;
        checkPage(blockHeight);
        if (t.quoteBg !== 'transparent') {
          doc.setFillColor(...hexToRgb(t.quoteBg));
          doc.rect(margin, y - 3, contentWidth, blockHeight, 'F');
        }
        doc.setDrawColor(...hexToRgb(t.quoteBorder));
        doc.setLineWidth(1);
        doc.line(margin, y - 3, margin, y + blockHeight - 3);
        doc.setFontSize(size);
        doc.setTextColor(...hexToRgb(t.text));
        doc.setFont('helvetica', 'italic');
        doc.text(lines, margin + 6, y);
        y += blockHeight + 2;
      }
      if (block.type === 'code') {
        const size = t.textSize * 0.85 / 2.8;
        const codeLines = (block.text || '').split('\n');
        const blockHeight = codeLines.length * size * 0.5 + 8;
        checkPage(blockHeight);
        doc.setFillColor(...hexToRgb(t.codeBg));
        doc.roundedRect(margin, y - 3, contentWidth, blockHeight, 2, 2, 'F');
        doc.setFontSize(size);
        doc.setTextColor(...hexToRgb(theme === 'dark' ? '#e4e4e7' : t.text));
        doc.setFont('courier', 'normal');
        codeLines.forEach((line, i) => doc.text(line.substring(0, 80), margin + 4, y + i * size * 0.5 + 2));
        y += blockHeight + 3;
      }
      if (block.type === 'table') {
        const size = t.textSize * 0.8 / 2.8;
        const cellH = 8, colW = Math.min(contentWidth / (block.headers?.length || 1), 40);
        checkPage(cellH * 3);
        doc.setFillColor(...hexToRgb(t.tableHeaderBg));
        doc.rect(margin, y, colW * (block.headers?.length || 1), cellH, 'F');
        doc.setFontSize(size);
        doc.setTextColor(...hexToRgb(t.heading));
        doc.setFont('helvetica', 'bold');
        (block.headers || []).forEach((h, i) => doc.text(String(h).substring(0, 18), margin + i * colW + 3, y + 5.5));
        y += cellH;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRgb(t.text));
        const maxRows = Math.min((block.rows?.length || 0), 15);
        for (let r = 0; r < maxRows; r++) {
          checkPage(cellH);
          doc.setDrawColor(...hexToRgb(t.tableBorder + '40'));
          (block.headers || []).forEach((h, i) => {
            doc.rect(margin + i * colW, y, colW, cellH);
            doc.text(String(block.rows[r]?.[h] || '').substring(0, 18), margin + i * colW + 3, y + 5.5);
          });
          y += cellH;
        }
        y += 5;
      }
    }

    doc.save(file.name.replace(/\.[^/.]+$/, '') + '_styled.pdf');
    setGenerating(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  const stats = {
    headings: content.filter(b => b.type === 'heading').length,
    paragraphs: content.filter(b => b.type === 'paragraph').length,
    lists: content.filter(b => b.type === 'bullet' || b.type === 'numbered').length,
    quotes: content.filter(b => b.type === 'quote').length
  };

  const formatSize = (bytes) => bytes < 1024 ? bytes + ' Б' : bytes < 1048576 ? (bytes / 1024).toFixed(1) + ' КБ' : (bytes / 1048576).toFixed(1) + ' МБ';

  // Upload screen
  if (status === 'idle' || status === 'error') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f0fdf4 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 540 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, marginBottom: 20 }}>
                <Brain size={18} style={{ color: '#6366f1' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#4f46e5' }}>AI-анализ структуры</span>
              </div>
              <h1 style={{ fontSize: 44, fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>PDF Styler</h1>
              <p style={{ fontSize: 18, color: '#6b7280' }}>Умное оформление документов</p>
            </div>

            {/* AI Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <button
                onClick={() => setUseAI(!useAI)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
                  background: useAI ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#fff',
                  border: useAI ? 'none' : '2px solid #e5e7eb',
                  borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: useAI ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                }}
              >
                {useAI ? <Zap size={18} style={{ color: '#fff' }} /> : <Zap size={18} style={{ color: '#9ca3af' }} />}
                <span style={{ fontWeight: 600, color: useAI ? '#fff' : '#6b7280' }}>
                  AI-анализ {useAI ? 'включён' : 'выключен'}
                </span>
              </button>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.3s', transform: isDragging ? 'scale(1.02)' : 'scale(1)' }}
            >
              <div style={{
                position: 'absolute', inset: -3,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                borderRadius: 28, opacity: isDragging ? 0.6 : 0, transition: 'opacity 0.3s', filter: 'blur(8px)'
              }} />
              
              <div style={{
                position: 'relative', background: '#ffffff',
                border: `2px dashed ${isDragging ? '#6366f1' : '#d1d5db'}`,
                borderRadius: 24, padding: '56px 32px', textAlign: 'center',
                transition: 'all 0.3s', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
              }}>
                <input ref={inputRef} type="file" accept=".txt,.md,.docx,.csv" onChange={(e) => e.target.files[0] && processFile(e.target.files[0])} style={{ display: 'none' }} />
                
                <div style={{
                  width: 80, height: 80, margin: '0 auto 24px', borderRadius: 20,
                  background: isDragging ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s', transform: isDragging ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
                }}>
                  <Upload size={36} style={{ color: isDragging ? '#fff' : '#9ca3af' }} />
                </div>
                
                <p style={{ fontSize: 22, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>{isDragging ? '✨ Отпустите файл' : 'Перетащите файл'}</p>
                <p style={{ color: '#9ca3af', marginBottom: 24 }}>или кликните для выбора</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { ext: 'TXT', icon: FileText, color: '#6366f1' },
                    { ext: 'MD', icon: Code, color: '#8b5cf6' },
                    { ext: 'DOCX', icon: BookOpen, color: '#06b6d4' },
                    { ext: 'CSV', icon: Table, color: '#10b981' }
                  ].map(({ ext, icon: Icon, color }) => (
                    <div key={ext} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: `${color}10`, borderRadius: 10, border: `1px solid ${color}30` }}>
                      <Icon size={16} style={{ color }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>{ext}</span>
                    </div>
                  ))}
                </div>

                {status === 'error' && (
                  <div style={{ marginTop: 24, padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12 }}>
                    <p style={{ color: '#dc2626', fontWeight: 500 }}>{error}</p>
                  </div>
                )}
              </div>
            </div>

            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, marginTop: 24 }}>
              {useAI ? '🧠 Нейросеть определит структуру автоматически' : '📝 Структура определяется по форматированию'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading / Analyzing
  if (status === 'loading' || status === 'analyzing') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f0fdf4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 32px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #e5e7eb' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 20, background: status === 'analyzing' ? 'linear-gradient(135deg, #eef2ff, #faf5ff)' : '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {status === 'analyzing' ? <Brain size={36} style={{ color: '#6366f1' }} /> : <Wand2 size={36} style={{ color: '#6366f1' }} />}
            </div>
          </div>
          
          <p style={{ fontSize: 20, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>
            {status === 'analyzing' ? '🧠 AI анализирует структуру' : 'Читаем файл...'}
          </p>
          <p style={{ color: '#6b7280' }}>{analysisStatus}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Main editor
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
      <Confetti active={showConfetti} />
      
      {/* Sidebar */}
      <div style={{ width: 320, background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              <FileText size={22} style={{ color: '#fff' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file?.name}</p>
              <p style={{ fontSize: 13, color: '#6b7280' }}>{formatSize(file?.size || 0)}</p>
            </div>
            <button onClick={resetFile} style={{ padding: 8, background: '#f3f4f6', border: 'none', cursor: 'pointer', borderRadius: 8, color: '#6b7280' }}>
              <X size={18} />
            </button>
          </div>
          
          {/* AI Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'linear-gradient(135deg, #eef2ff, #faf5ff)', borderRadius: 10, marginBottom: 16 }}>
            <Brain size={16} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#4f46e5' }}>Структура определена AI</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {[
              { value: stats.headings, label: 'Заг.' },
              { value: stats.paragraphs, label: 'Абз.' },
              { value: stats.lists, label: 'Спис.' },
              { value: stats.quotes, label: 'Цит.' }
            ].map(({ value, label }) => (
              <div key={label} style={{ background: '#f9fafb', borderRadius: 10, padding: '10px 6px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1f2937' }}>{value}</div>
                <div style={{ fontSize: 10, color: '#9ca3af' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Стиль оформления</h3>
            <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', padding: '4px 8px', borderRadius: 6 }}>← →</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(themes).map(([id, t]) => (
              <ThemeCard key={id} id={id} theme={t} active={theme === id} onClick={() => setTheme(id)} onHover={setPreviewTheme} />
            ))}
          </div>
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #e5e7eb', background: '#fafafa' }}>
          <button
            onClick={generatePDF}
            disabled={generating}
            style={{
              width: '100%', padding: '16px 20px', borderRadius: 14, border: 'none',
              cursor: generating ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontWeight: 600, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              opacity: generating ? 0.7 : 1, transition: 'all 0.2s'
            }}
          >
            {generating ? <><RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> Создаём PDF...</> : <><Download size={20} /> Скачать PDF</>}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12 }}>Нажмите <b>Space</b> для быстрого скачивания</p>
        </div>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Превью</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#f3f4f6', borderRadius: 8 }}>
              <span style={{ fontSize: 18 }}>{themes[activeTheme].emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#4b5563' }}>{themes[activeTheme].name}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f3f4f6', borderRadius: 10, padding: 4 }}>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} disabled={zoom <= 0.5} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: 6 }}>
              <ZoomOut size={18} />
            </button>
            <span style={{ padding: '0 12px', fontSize: 13, fontWeight: 500, color: '#374151', minWidth: 55, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.25))} disabled={zoom >= 1.5} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: 6 }}>
              <ZoomIn size={18} />
            </button>
            <div style={{ width: 1, height: 20, background: '#d1d5db', margin: '0 4px' }} />
            <button onClick={() => setZoom(1)} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: 6 }}>
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Preview content={content} theme={activeTheme} zoom={zoom} />
        </div>
      </div>

      <input ref={inputRef} type="file" accept=".txt,.md,.docx,.csv" onChange={(e) => e.target.files[0] && processFile(e.target.files[0])} style={{ display: 'none' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
