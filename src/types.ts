export type Point = { x: number; y: number };

export type TemplateElement =
  | { type: 'path'; data: string }
  | { type: 'line'; points: number[]; closed?: boolean; dashed?: boolean }
  | { type: 'rect'; x: number; y: number; w: number; h: number; dashed?: boolean }
  | { type: 'circle'; cx: number; cy: number; r: number; filled?: boolean; dashed?: boolean }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; dashed?: boolean }
  | { type: 'dot'; cx: number; cy: number; r?: number }
  | { type: 'text'; x: number; y: number; text: string; size?: number };

export type TemplateCategory =
  | 'Klasyczne'
  | 'Geometria'
  | 'Portret'
  | 'Architektura'
  | 'Minimalizm';

export interface CompositionTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  elements: TemplateElement[];
}

export interface TemplateTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type LineColor = '#ffffff' | '#000000' | '#ff3b30' | '#ffd60a';
