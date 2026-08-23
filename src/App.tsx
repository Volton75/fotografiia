import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDrag, usePinch } from '@use-gesture/react';
import { Stage } from 'react-konva';
import { Grid2x2, Eye } from 'lucide-react';
import { CameraView } from './components/CameraView';
import { TemplateLayer } from './components/TemplateLayer';
import { Toolbar } from './components/Toolbar';
import { GalleryDrawer } from './components/GalleryDrawer';
import { TEMPLATES } from './templates';
import type { LineColor } from './types';

const DEFAULT_TEMPLATE = TEMPLATES[0];

function App() {
  const [templateId, setTemplateId] = useState<string>(DEFAULT_TEMPLATE.id);
  const [color, setColor] = useState<LineColor>('#ffffff');
  const [opacity, setOpacity] = useState(0.9);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);

  // Transform state managed via refs for smooth gesture perf, mirrored to state for render
  const transformRef = useRef({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender((n) => n + 1), []);

  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
  const overlaySize = Math.min(stageSize.w, stageSize.h);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setStageSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setStageSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const resetTransform = useCallback(() => {
    transformRef.current = { x: 0, y: 0, scale: 1, rotation: 0 };
    setFlipH(false);
    setFlipV(false);
    rerender();
  }, [rerender]);

  const template = TEMPLATES.find((t) => t.id === templateId) ?? DEFAULT_TEMPLATE;

  const bind = usePinch(
    ({ delta: [dScale, dRot], origin: [ox, oy], event }) => {
      event.preventDefault();
      const t = transformRef.current;
      const cx = stageSize.w / 2;
      const cy = stageSize.h / 2;
      // rotate around gesture origin, but we keep simple: rotate around center
      t.scale = Math.min(5, Math.max(0.2, t.scale * (1 + dScale * 8)));
      t.rotation += dRot * 180;
      // shift toward pinch origin
      t.x += (ox - cx) * 0.02;
      t.y += (oy - cy) * 0.02;
      rerender();
    },
    { pointer: { touch: true }, eventOptions: { passive: false } },
  );

  const drag = useDrag(
    ({ delta: [dx, dy], event }) => {
      event.preventDefault();
      const t = transformRef.current;
      t.x += dx;
      t.y += dy;
      rerender();
    },
    { pointer: { touch: true }, eventOptions: { passive: false } },
  );

  const t = transformRef.current;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Camera background */}
      <CameraView className="absolute inset-0" />

      {/* Konva overlay — gesture surface */}
      <div
        ref={stageRef}
        className="absolute inset-0 touch-none"
        {...bind()}
        {...drag()}
      >
        {overlaySize > 0 && (
          <Stage width={stageSize.w} height={stageSize.h}>
            <TemplateLayer
              template={template}
              color={color}
              opacity={opacity}
              x={stageSize.w / 2 + t.x}
              y={stageSize.h / 2 + t.y}
              scale={t.scale}
              rotation={t.rotation}
              flipH={flipH}
              flipV={flipV}
              size={overlaySize}
            />
          </Stage>
        )}
      </div>

      {/* Top bar */}
      <AnimatePresence>
        {!uiHidden && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]"
          >
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3.5 py-2 backdrop-blur-xl">
              <Grid2x2 className="h-4 w-4 text-white/80" />
              <span className="text-sm font-medium text-white/90">{template.name}</span>
            </div>
            <button
              onClick={() => setGalleryOpen(true)}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/90 backdrop-blur-xl active:scale-95"
              aria-label="Otwórz galerię"
            >
              <Grid2x2 className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom toolbar */}
      <AnimatePresence>
        {!uiHidden && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center">
            <Toolbar
              opacity={opacity}
              setOpacity={setOpacity}
              color={color}
              setColor={setColor}
              onReset={resetTransform}
              flipH={flipH}
              flipV={flipV}
              onFlipH={() => setFlipH((v) => !v)}
              onFlipV={() => setFlipV((v) => !v)}
              onToggleGallery={() => setGalleryOpen(true)}
              onHideAll={() => setUiHidden(true)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Hidden UI — tap to restore */}
      <AnimatePresence>
        {uiHidden && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setUiHidden(false)}
            className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/90 backdrop-blur-xl active:scale-95"
            aria-label="Pokaż interfejs"
          >
            <Eye className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Gallery drawer */}
      <GalleryDrawer
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        selectedId={templateId}
        onSelect={(id) => {
          setTemplateId(id);
          resetTransform();
        }}
      />
    </div>
  );
}

export default App;
