import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  RefreshCw, 
  BookOpen, 
  User, 
  Calendar, 
  Library,
  Sparkles,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import html2canvas from 'html2canvas';

// --- Types ---

interface SectionData {
  author: string;
  description: string;
  authorPic: string | null;
  bookCover: string | null;
}

interface PosterData {
  month: string;
  year: string;
  kids: SectionData;
  teens: SectionData;
}

interface PosterStyle {
  id: number;
  bgColor: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  shadow: string;
}

// --- Constants ---

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PALETTES = [
  { bg: '#ffffff', text: '#0f172a', accent: '#2563eb', border: '#e2e8f0' }, // Modern Blue
  { bg: '#fdfcf0', text: '#422006', accent: '#d97706', border: '#fef3c7' }, // Warm Amber
  { bg: '#f0fdf4', text: '#064e3b', accent: '#059669', border: '#d1fae5' }, // Fresh Green
  { bg: '#fff1f2', text: '#881337', accent: '#e11d48', border: '#ffe4e6' }, // Soft Rose
  { bg: '#faf5ff', text: '#581c87', accent: '#7c3aed', border: '#f3e8ff' }, // Royal Purple
  { bg: '#0f172a', text: '#f8fafc', accent: '#38bdf8', border: '#1e293b' }, // Dark Mode
  { bg: '#fff7ed', text: '#7c2d12', accent: '#ea580c', border: '#ffedd5' }, // Sunset Orange
  { bg: '#f8fafc', text: '#334155', accent: '#64748b', border: '#e2e8f0' }, // Slate Minimal
  { bg: '#ecfeff', text: '#164e63', accent: '#0891b2', border: '#cffafe' }, // Cyan Sea
  { bg: '#fffbeb', text: '#78350f', accent: '#d97706', border: '#fef3c7' }, // Golden
  { bg: '#f5f5f4', text: '#1c1917', accent: '#78716c', border: '#e7e5e4' }, // Stone
  { bg: '#fdf2f8', text: '#831843', accent: '#db2777', border: '#fce7f3' }, // Pink
];

const FONTS = [
  { heading: 'font-serif', body: 'font-sans' },
  { heading: 'font-outfit', body: 'font-sans' },
  { heading: 'font-space', body: 'font-space' },
  { heading: 'font-serif', body: 'font-serif' },
  { heading: 'font-sans', body: 'font-sans' },
  { heading: 'font-playfair', body: 'font-sans' },
  { heading: 'font-outfit', body: 'font-outfit' },
];

const RADII = ['rounded-none', 'rounded-lg', 'rounded-2xl', 'rounded-3xl'];
const BORDERS = ['border-0', 'border-2', 'border-4', 'border-8'];

// --- Main Component ---

export default function App() {
  const posterRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<PosterData>({
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear().toString(),
    kids: {
      author: 'Maurice Sendak',
      description: 'Famous for "Where the Wild Things Are", Sendak revolutionized children\'s literature with his honest portrayal of childhood emotions and wild imagination.',
      authorPic: 'https://picsum.photos/seed/author1/400/400',
      bookCover: 'https://picsum.photos/seed/book1/300/450',
    },
    teens: {
      author: 'Rick Riordan',
      description: 'The creator of the Percy Jackson series, Riordan brings Greek, Roman, and Egyptian mythology to life for modern readers with humor and heart.',
      authorPic: 'https://picsum.photos/seed/author2/400/400',
      bookCover: 'https://picsum.photos/seed/book2/300/450',
    }
  });

  const [style, setStyle] = useState<PosterStyle>({
    id: 0,
    bgColor: PALETTES[0].bg,
    textColor: PALETTES[0].text,
    accentColor: PALETTES[0].accent,
    headingFont: FONTS[0].heading,
    bodyFont: FONTS[0].body,
    borderRadius: RADII[1],
    borderWidth: BORDERS[1],
    borderColor: PALETTES[0].border,
    shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomStyle = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const font = FONTS[Math.floor(Math.random() * FONTS.length)];
      const radius = RADII[Math.floor(Math.random() * RADII.length)];
      const border = BORDERS[Math.floor(Math.random() * BORDERS.length)];
      
      setStyle({
        id: Math.random(),
        bgColor: palette.bg,
        textColor: palette.text,
        accentColor: palette.accent,
        headingFont: font.heading,
        bodyFont: font.body,
        borderRadius: radius,
        borderWidth: border,
        borderColor: palette.border,
        shadow: Math.random() > 0.5 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      });

      // Also randomize placeholder images if they haven't been changed
      const randomSeed = () => Math.floor(Math.random() * 1000);
      setData(prev => ({
        ...prev,
        kids: {
          ...prev.kids,
          authorPic: prev.kids.authorPic?.includes('picsum.photos') ? `https://picsum.photos/seed/auth${randomSeed()}/400/400` : prev.kids.authorPic,
          bookCover: prev.kids.bookCover?.includes('picsum.photos') ? `https://picsum.photos/seed/book${randomSeed()}/300/450` : prev.kids.bookCover,
        },
        teens: {
          ...prev.teens,
          authorPic: prev.teens.authorPic?.includes('picsum.photos') ? `https://picsum.photos/seed/auth${randomSeed()}/400/400` : prev.teens.authorPic,
          bookCover: prev.teens.bookCover?.includes('picsum.photos') ? `https://picsum.photos/seed/book${randomSeed()}/300/450` : prev.teens.bookCover,
        }
      }));

      setIsGenerating(false);
    }, 300);
  };

  const handleInputChange = (section: 'kids' | 'teens' | 'meta', field: string, value: string) => {
    if (section === 'meta') {
      setData(prev => ({ ...prev, [field]: value }));
    } else {
      setData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  const handleImageUpload = (section: 'kids' | 'teens', field: 'authorPic' | 'bookCover', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: url }
      }));
    }
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // Create a high-quality capture
      const canvas = await html2canvas(posterRef.current, {
        scale: 3, // Higher scale for better print quality
        useCORS: true,
        backgroundColor: style.bgColor,
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('poster-preview-element');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.position = 'relative';
            clonedElement.style.left = '0';
            clonedElement.style.top = '0';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `Library-Poster-${data.month.toLowerCase()}-${data.year}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Failed to generate poster image:', err);
      alert('There was an error generating the image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* --- Control Panel --- */}
      <aside className="w-full lg:w-[400px] bg-white border-r overflow-y-auto p-6 lg:h-screen sticky top-0 z-10" style={{ borderColor: '#e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg text-white" style={{ backgroundColor: '#2563eb' }}>
            <Library size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight" style={{ color: '#0f172a' }}>Poster Studio</h1>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748b' }}>Library Display Generator</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Meta Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold border-b pb-2" style={{ color: '#0f172a', borderColor: '#f1f5f9' }}>
              <Calendar size={18} style={{ color: '#2563eb' }} />
              <h2>Display Period</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Month</label>
                <select 
                  value={data.month}
                  onChange={(e) => handleInputChange('meta', 'month', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Year</label>
                <input 
                  type="number"
                  value={data.year}
                  onChange={(e) => handleInputChange('meta', 'year', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                />
              </div>
            </div>
          </section>

          {/* Section 1: Kids */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold border-b pb-2" style={{ color: '#0f172a', borderColor: '#f1f5f9' }}>
              <Sparkles size={18} style={{ color: '#f59e0b' }} />
              <h2>Kids & Young Readers</h2>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Author Name</label>
                <input 
                  type="text"
                  value={data.kids.author}
                  onChange={(e) => handleInputChange('kids', 'author', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  placeholder="Enter author name..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Description</label>
                <textarea 
                  value={data.kids.description}
                  onChange={(e) => handleInputChange('kids', 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  placeholder="Tell us about the author..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Author Photo</label>
                  <label className="flex items-center justify-center w-full h-10 border border-dashed rounded-md cursor-pointer hover:bg-slate-100 transition-colors" style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
                    <ImageIcon size={16} style={{ color: '#94a3b8' }} />
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload('kids', 'authorPic', e)} accept="image/*" />
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Book Cover</label>
                  <label className="flex items-center justify-center w-full h-10 border border-dashed rounded-md cursor-pointer hover:bg-slate-100 transition-colors" style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
                    <BookOpen size={16} style={{ color: '#94a3b8' }} />
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload('kids', 'bookCover', e)} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Teens */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold border-b pb-2" style={{ color: '#0f172a', borderColor: '#f1f5f9' }}>
              <ChevronRight size={18} style={{ color: '#a855f7' }} />
              <h2>Grade 6 & Up</h2>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Author Name</label>
                <input 
                  type="text"
                  value={data.teens.author}
                  onChange={(e) => handleInputChange('teens', 'author', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  placeholder="Enter author name..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Description</label>
                <textarea 
                  value={data.teens.description}
                  onChange={(e) => handleInputChange('teens', 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  placeholder="Tell us about the author..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Author Photo</label>
                  <label className="flex items-center justify-center w-full h-10 border border-dashed rounded-md cursor-pointer hover:bg-slate-100 transition-colors" style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
                    <ImageIcon size={16} style={{ color: '#94a3b8' }} />
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload('teens', 'authorPic', e)} accept="image/*" />
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>Book Cover</label>
                  <label className="flex items-center justify-center w-full h-10 border border-dashed rounded-md cursor-pointer hover:bg-slate-100 transition-colors" style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
                    <BookOpen size={16} style={{ color: '#94a3b8' }} />
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload('teens', 'bookCover', e)} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <button 
              onClick={generateRandomStyle}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: '#0f172a' }}
            >
              <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
              Generate Random Style
            </button>
            <button 
              onClick={downloadPoster}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: '#2563eb' }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download Poster
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* --- Live Preview Area --- */}
      <main className="flex-1 p-4 lg:p-12 flex items-center justify-center overflow-auto" style={{ backgroundColor: '#f1f5f9' }}>
        <div className="w-full max-w-[800px] aspect-[1/1.414] relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={style.id}
              ref={posterRef}
              id="poster-preview-element"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`w-full h-full p-10 flex flex-col ${style.borderRadius} ${style.borderWidth} overflow-hidden`}
              style={{ 
                backgroundColor: style.bgColor, 
                color: style.textColor,
                borderColor: style.borderColor,
                boxShadow: style.shadow
              }}
            >
              {/* Header */}
              <header className="text-center mb-8">
                <h3 className={`text-xs uppercase tracking-[0.3em] font-bold mb-1`} style={{ color: style.accentColor }}>
                  {data.month} {data.year}
                </h3>
                <h1 className={`text-5xl font-black ${style.headingFont} leading-tight mb-1`} style={{ color: style.textColor }}>
                  Author of the Month
                </h1>
                <p className="text-base font-medium italic" style={{ opacity: 0.7, color: style.textColor }}>
                  Junior Cambridge Branch Library
                </p>
                <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: style.accentColor }} />
              </header>

              {/* Sections Container */}
              <div className="flex-1 flex flex-col gap-8">
                {/* Section 1: Kids */}
                <section className="flex-1 flex gap-6 items-start">
                  <div className="w-[140px] flex flex-col gap-3 shrink-0">
                    <div className={`aspect-square overflow-hidden ${style.borderRadius} border-4`} style={{ borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' }}>
                      {data.kids.authorPic ? (
                        <img src={data.kids.authorPic} alt={data.kids.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e2e8f0' }}><User size={48} style={{ color: '#94a3b8' }} /></div>
                      )}
                    </div>
                    <div className={`aspect-[2/3] overflow-hidden ${style.borderRadius} border-2`} style={{ borderColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}>
                      {data.kids.bookCover ? (
                        <img src={data.kids.bookCover} alt="Book Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e2e8f0' }}><BookOpen size={32} style={{ color: '#94a3b8' }} /></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ color: style.accentColor, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        Kids & Young Readers
                      </span>
                    </div>
                    <h2 className={`text-3xl font-bold ${style.headingFont} mb-2`} style={{ color: style.textColor }}>
                      {data.kids.author || 'Author Name'}
                    </h2>
                    <p className={`text-base leading-relaxed ${style.bodyFont}`} style={{ opacity: 0.9, color: style.textColor }}>
                      {data.kids.description || 'Enter a description for the kids author section...'}
                    </p>
                  </div>
                </section>

                {/* Divider */}
                <div className="h-px w-full" style={{ backgroundColor: style.textColor, opacity: 0.1 }} />

                {/* Section 2: Teens */}
                <section className="flex-1 flex gap-6 items-start flex-row-reverse">
                  <div className="w-[140px] flex flex-col gap-3 shrink-0">
                    <div className={`aspect-square overflow-hidden ${style.borderRadius} border-4`} style={{ borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' }}>
                      {data.teens.authorPic ? (
                        <img src={data.teens.authorPic} alt={data.teens.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e2e8f0' }}><User size={48} style={{ color: '#94a3b8' }} /></div>
                      )}
                    </div>
                    <div className={`aspect-[2/3] overflow-hidden ${style.borderRadius} border-2`} style={{ borderColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}>
                      {data.teens.bookCover ? (
                        <img src={data.teens.bookCover} alt="Book Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e2e8f0' }}><BookOpen size={32} style={{ color: '#94a3b8' }} /></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pt-2 text-right">
                    <div className="flex items-center gap-3 mb-4 justify-end">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ color: style.accentColor, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        Grade 6 & Up
                      </span>
                    </div>
                    <h2 className={`text-3xl font-bold ${style.headingFont} mb-2`} style={{ color: style.textColor }}>
                      {data.teens.author || 'Author Name'}
                    </h2>
                    <p className={`text-base leading-relaxed ${style.bodyFont}`} style={{ opacity: 0.9, color: style.textColor }}>
                      {data.teens.description || 'Enter a description for the teen author section...'}
                    </p>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <footer className="mt-auto pt-12 flex justify-between items-end text-[10px] font-bold uppercase tracking-[0.2em]" style={{ opacity: 0.5, color: style.textColor }}>
                <div>Library Resource Center</div>
                <div>© {data.year} Junior Cambridge Branch</div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
