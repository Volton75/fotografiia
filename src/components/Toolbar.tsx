import { motion } from 'framer-motion';
import {
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Palette,
  Eye,
  Sliders,
} from 'lucide-react';
import type { LineColor } from '../types';

const COLORS: { value: LineColor; label: string; ring: string }[] = [
  { value: '#ffffff', label: 'Biały', ring: 'ring-white/70' },
  { value: '#000000', label: 'Czarny', ring: 'ring-white/70' },
  { value: '#ff3b30', label: 'Czerwony', ring: 'ring-white/70' },
  { value: '#ffd60a', label: 'Żółty', ring: 'ring-white/70' },
];

interface ToolbarProps {
  opacity: number;
  setOpacity: (v: number) => void;
  color: LineColor;
  setColor: (c: LineColor) => void;
  onReset: () => void;
  flipH: boolean;
  flipV: boolean;
  onFlipH: () => void;
  onFlipV: () => void;
  onToggleGallery: () => void;
  onHideAll: () => void;
}

export function Toolbar({
  opacity,
  setOpacity,
  color,
  setColor,
  onReset,
  flipH,
  flipV,
  onFlipH,
  onFlipV,
  onToggleGallery,
  onHideAll,
}: ToolbarProps) {
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className="pointer-events-auto w-full px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl">
        {/* Opacity slider */}
        <div className="flex items-center gap-3 px-4 pt-3">
          <Sliders className="h-4 w-4 shrink-0 text-white/70" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
            Przezroczystość
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className="ui-slider flex-1"
          />
          <span className="w-9 text-right text-xs tabular-nums text-white/80">
            {Math.round(opacity * 100)}%
          </span>
        </div>

        {/* Color + actions */}
        <div className="flex items-center gap-2 px-3 pb-3 pt-3">
          <div className="flex items-center gap-1.5">
            <Palette className="mr-0.5 h-4 w-4 text-white/70" />
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                aria-label={c.label}
                className={`h-7 w-7 rounded-full border border-white/30 ring-offset-2 ring-offset-black/60 transition ${
                  color === c.value ? `ring-2 ${c.ring}` : 'ring-0'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <ToolButton active={flipH} onClick={onFlipH} label="Odbicie pionowe">
              <FlipHorizontal className="h-5 w-5" />
            </ToolButton>
            <ToolButton active={flipV} onClick={onFlipV} label="Odbicie poziome">
              <FlipVertical className="h-5 w-5" />
            </ToolButton>
            <ToolButton onClick={onReset} label="Reset pozycji">
              <Maximize className="h-5 w-5" />
            </ToolButton>
            <ToolButton onClick={onHideAll} label="Ukryj UI">
              <Eye className="h-5 w-5" />
            </ToolButton>
          </div>
        </div>

        {/* Gallery trigger */}
        <button
          onClick={onToggleGallery}
          className="flex w-full items-center justify-center gap-2 rounded-b-2xl border-t border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/90 active:bg-white/10"
        >
          Szablony
          <span className="text-white/40">▾</span>
        </button>
      </div>
    </motion.div>
  );
}

function ToolButton({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition active:scale-95 ${
        active
          ? 'border-white/60 bg-white/20 text-white'
          : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}
