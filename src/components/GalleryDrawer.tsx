import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Stage, Layer, Group, Line, Path, Rect, Circle, Ellipse } from 'react-konva';
import { CATEGORIES, TEMPLATES } from '../templates';
import type { CompositionTemplate, TemplateCategory } from '../types';

interface GalleryDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const T = 72;

function Thumb({ template }: { template: CompositionTemplate }) {
  const sw = Math.max(0.6, T * 0.012);
  const dash: [number, number] = [sw * 3, sw * 2];

  const render = (el: CompositionTemplate['elements'][number], i: number) => {
    const isDashed = 'dashed' in el && el.dashed === true;
    const common = {
      stroke: 'rgba(255,255,255,0.9)',
      strokeWidth: sw,
      lineJoin: 'round' as const,
      lineCap: 'round' as const,
      dash: isDashed ? dash : undefined,
    };
    const s = T / 100;
    switch (el.type) {
      case 'line':
        return <Line key={i} points={el.points.map((p) => p * s)} closed={el.closed} {...common} />;
      case 'rect':
        return (
          <Rect
            key={i}
            x={el.x * s}
            y={el.y * s}
            width={el.w * s}
            height={el.h * s}
            {...common}
          />
        );
      case 'circle':
        return (
          <Circle
            key={i}
            x={el.cx * s}
            y={el.cy * s}
            radius={el.filled ? sw : el.r * s}
            fill={el.filled ? 'rgba(255,255,255,0.9)' : undefined}
            {...common}
          />
        );
      case 'ellipse':
        return (
          <Ellipse
            key={i}
            x={el.cx * s}
            y={el.cy * s}
            radiusX={el.rx * s}
            radiusY={el.ry * s}
            {...common}
          />
        );
      case 'dot':
        return (
          <Circle
            key={i}
            x={el.cx * s}
            y={el.cy * s}
            radius={el.r ? el.r * s : sw * 2}
            fill="rgba(255,255,255,0.9)"
          />
        );
      case 'path':
        return (
          <Path
            key={i}
            data={el.data.replace(/(\d+(?:\.\d+)?)/g, (m) => String(parseFloat(m) * s))}
            {...common}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stage width={T} height={T}>
      <Layer listening={false}>
        <Group>{template.elements.map(render)}</Group>
      </Layer>
    </Stage>
  );
}

export function GalleryDrawer({ open, onClose, selectedId, onSelect }: GalleryDrawerProps) {
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all');

  const filtered = useMemo(
    () =>
      category === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category),
    [category],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            className="absolute inset-x-0 bottom-0 z-40 max-h-[80%] rounded-t-3xl border-t border-white/10 bg-neutral-900/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <div>
                <h2 className="text-base font-semibold text-white">Szablony kompozycji</h2>
                <p className="text-xs text-white/40">{TEMPLATES.length} wzorów</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Zamknij"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category filter */}
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3">
              <CatChip active={category === 'all'} onClick={() => setCategory('all')}>
                Wszystkie
              </CatChip>
              {CATEGORIES.map((c) => (
                <CatChip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </CatChip>
              ))}
            </div>

            {/* Grid */}
            <div className="no-scrollbar max-h-[52vh] overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {filtered.map((t) => {
                  const selected = t.id === selectedId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelect(t.id)}
                      className="group relative flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition active:scale-95"
                      style={{
                        borderColor: selected ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.08)',
                        backgroundColor: selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {selected && (
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-neutral-900">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      )}
                      <div
                        className="flex h-[72px] w-[72px] items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
                      >
                        <Thumb template={t} />
                      </div>
                      <span className="line-clamp-1 text-center text-[10px] font-medium text-white/80">
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CatChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition active:scale-95 ${
        active
          ? 'bg-white text-neutral-900'
          : 'bg-white/10 text-white/70 hover:bg-white/15'
      }`}
    >
      {children}
    </button>
  );
}
