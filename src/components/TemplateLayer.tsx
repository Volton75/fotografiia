import { useMemo } from 'react';
import { Layer, Line, Path, Rect, Circle, Ellipse, Group, Text } from 'react-konva';
import type { CompositionTemplate, LineColor, TemplateElement } from '../types';

interface TemplateLayerProps {
  template: CompositionTemplate;
  color: LineColor;
  opacity: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  size: number;
}

export function TemplateLayer({
  template,
  color,
  opacity,
  x,
  y,
  scale,
  rotation,
  flipH,
  flipV,
  size,
}: TemplateLayerProps) {
  const strokeWidth = useMemo(() => Math.max(1, size * 0.004), [size]);
  const dash = useMemo<[number, number]>(() => [strokeWidth * 4, strokeWidth * 3], [strokeWidth]);
  const dotR = useMemo(() => strokeWidth * 2.5, [strokeWidth]);

  const renderElement = (el: TemplateElement, i: number) => {
    const isDashed = 'dashed' in el && el.dashed === true;
    const common = {
      stroke: color,
      strokeWidth,
      lineJoin: 'round' as const,
      lineCap: 'round' as const,
      dash: isDashed ? dash : undefined,
      shadowColor: color === '#000000' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)',
      shadowBlur: strokeWidth * 1.5,
      shadowEnabled: true,
    };

    switch (el.type) {
      case 'line':
        return (
          <Line
            key={i}
            points={el.points.map((p) => p * (size / 100))}
            closed={el.closed}
            {...common}
          />
        );
      case 'rect':
        return (
          <Rect
            key={i}
            x={el.x * (size / 100)}
            y={el.y * (size / 100)}
            width={el.w * (size / 100)}
            height={el.h * (size / 100)}
            {...common}
          />
        );
      case 'circle':
        return (
          <Circle
            key={i}
            x={el.cx * (size / 100)}
            y={el.cy * (size / 100)}
            radius={(el.filled ? dotR : el.r * (size / 100))}
            fill={el.filled ? color : undefined}
            stroke={el.filled ? undefined : color}
            strokeWidth={strokeWidth}
          />
        );
      case 'ellipse':
        return (
          <Ellipse
            key={i}
            x={el.cx * (size / 100)}
            y={el.cy * (size / 100)}
            radiusX={el.rx * (size / 100)}
            radiusY={el.ry * (size / 100)}
            {...common}
          />
        );
      case 'dot':
        return (
          <Circle
            key={i}
            x={el.cx * (size / 100)}
            y={el.cy * (size / 100)}
            radius={el.r ? el.r * (size / 100) : dotR}
            fill={color}
            shadowColor="rgba(0,0,0,0.5)"
            shadowBlur={strokeWidth}
          />
        );
      case 'path':
        return (
          <Path
            key={i}
            data={el.data.replace(/(\d+(?:\.\d+)?)/g, (m) =>
              String(parseFloat(m) * (size / 100)),
            )}
            {...common}
          />
        );
      case 'text':
        return (
          <Text
            key={i}
            x={el.x * (size / 100)}
            y={el.y * (size / 100)}
            text={el.text}
            fontSize={(el.size ?? 8) * (size / 100)}
            fill={color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layer listening={false}>
      <Group
        x={x}
        y={y}
        rotation={rotation}
        scaleX={scale * (flipH ? -1 : 1)}
        scaleY={scale * (flipV ? -1 : 1)}
        offsetX={size / 2}
        offsetY={size / 2}
        opacity={opacity}
      >
        {template.elements.map(renderElement)}
      </Group>
    </Layer>
  );
}
