import { useState, useRef, useEffect } from 'react';

const EMOJIS = [
  '🦊','🐻','🐼','🦁','🐯','🐨','🐸','🦄','🐺','🦝',
  '🌟','🎨','🏠','🎯','🎭','🌺','🌙','⭐','🏆','🎪',
  '👩‍💼','👨‍💼','🧑‍💻','👩‍🎨','👨‍🎨','🧑‍🎨','🦋','🌈','🎸','🎮',
];

const BG_COLORS = [
  'bg-blue-500','bg-violet-500','bg-emerald-500',
  'bg-amber-500','bg-rose-500','bg-cyan-500','bg-indigo-500','bg-teal-500',
];

function getColor(email: string) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
}

interface Props {
  userId: string;
  name: string;
  email: string;
  size?: number;
  editable?: boolean;
}

export default function UserAvatar({ userId, name, email, size = 40, editable = false }: Props) {
  const [emoji, setEmoji] = useState(() => localStorage.getItem(`avatar_${userId}`) || '');
  const [pickerOpen, setPickerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const select = (e: string) => {
    localStorage.setItem(`avatar_${userId}`, e);
    setEmoji(e);
    setPickerOpen(false);
  };

  const clear = () => {
    localStorage.removeItem(`avatar_${userId}`);
    setEmoji('');
    setPickerOpen(false);
  };

  const bgColor = getColor(email);
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.36);
  const emojiSize = Math.round(size * 0.55);

  return (
    <div ref={ref} className="relative inline-block">
      <div
        onClick={() => editable && setPickerOpen(v => !v)}
        className={`rounded-full flex items-center justify-center select-none overflow-hidden ${
          emoji ? 'bg-surface-container' : bgColor
        } ${editable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        style={{ width: size, height: size }}
      >
        {emoji
          ? <span style={{ fontSize: emojiSize }}>{emoji}</span>
          : <span className="font-bold text-white" style={{ fontSize }}>{initials}</span>
        }
        {editable && (
          <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
            <span className="material-symbols-outlined text-white text-sm">edit</span>
          </div>
        )}
      </div>

      {editable && pickerOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl p-4">
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Choose Avatar</p>
          <div className="grid grid-cols-6 gap-1 mb-3">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => select(e)}
                className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center hover:bg-surface-container-high transition-colors ${emoji === e ? 'bg-primary/10 ring-2 ring-primary' : ''}`}
              >
                {e}
              </button>
            ))}
          </div>
          {emoji && (
            <button onClick={clear} className="w-full text-xs text-secondary hover:text-error text-center py-1 transition-colors">
              Remove & use initials
            </button>
          )}
        </div>
      )}
    </div>
  );
}
