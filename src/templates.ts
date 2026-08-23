import type { CompositionTemplate, TemplateElement } from './types';

const M = 100;

const curve = (
  from: [number, number],
  ctrl: [number, number],
  to: [number, number],
): string =>
  `M ${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`;

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
): string => {
  const sx = cx + r * Math.cos(start);
  const sy = cy + r * Math.sin(start);
  const ex = cx + r * Math.cos(end);
  const ey = cy + r * Math.sin(end);
  const large = Math.abs(end - start) > Math.PI ? 1 : 0;
  const sweep = end > start ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} ${sweep} ${ex} ${ey}`;
};

const grid: TemplateElement[] = [
  { type: 'line', points: [M / 3, 0, M / 3, M], dashed: true },
  { type: 'line', points: [(2 * M) / 3, 0, (2 * M) / 3, M], dashed: true },
  { type: 'line', points: [0, M / 3, M, M / 3], dashed: true },
  { type: 'line', points: [0, (2 * M) / 3, M, (2 * M) / 3], dashed: true },
];

const pp = (x: number, y: number): TemplateElement => ({
  type: 'dot',
  cx: x,
  cy: y,
  r: 3,
});

export const TEMPLATES: CompositionTemplate[] = [
  {
    id: 'rule-of-thirds',
    name: 'Trójpodział',
    category: 'Klasyczne',
    description: 'Siatka 3x3 z mocnymi punktami',
    elements: [
      ...grid,
      pp(M / 3, M / 3),
      pp((2 * M) / 3, M / 3),
      pp(M / 3, (2 * M) / 3),
      pp((2 * M) / 3, (2 * M) / 3),
    ],
  },
  {
    id: 'golden-spiral',
    name: 'Złota Spirala',
    category: 'Klasyczne',
    description: 'Fibonacci — krzywa prowadząca wzrok',
    elements: [
      { type: 'rect', x: 0, y: 0, w: M, h: M },
      {
        type: 'path',
        data: curve([M, M], [M, 0], [0, M / 1.618]),
      },
      { type: 'rect', x: 0, y: 0, w: M / 1.618, h: M, dashed: true },
      { type: 'rect', x: M / 1.618, y: 0, w: M - M / 1.618, h: M / 1.618, dashed: true },
    ],
  },
  {
    id: 'golden-ratio',
    name: 'Złoty Podział',
    category: 'Klasyczne',
    description: 'Proporcja 1:1.618',
    elements: [
      { type: 'rect', x: 0, y: 0, w: M, h: M },
      { type: 'line', points: [M / 1.618, 0, M / 1.618, M], dashed: true },
      { type: 'line', points: [0, M / 1.618, M, M / 1.618], dashed: true },
      pp(M / 1.618, M / 1.618),
    ],
  },
  {
    id: 'golden-triangle',
    name: 'Złoty Trójkąt',
    category: 'Klasyczne',
    description: 'Przekątne tworzące trójkąty',
    elements: [
      { type: 'line', points: [0, 0, M, M] },
      { type: 'line', points: [M, 0, 0, M] },
      { type: 'line', points: [M / 2, 0, 0, M / 2] },
      { type: 'line', points: [M / 2, 0, M, M / 2] },
      pp(M / 2, M / 2),
    ],
  },
  {
    id: 'harmonic-triangle',
    name: 'Trójkąt Harmoniczny',
    category: 'Klasyczne',
    description: 'Równoramienny trójkąt podstawowy',
    elements: [
      { type: 'line', points: [0, M, M, M], closed: false },
      { type: 'line', points: [0, M, M / 2, 0], closed: false },
      { type: 'line', points: [M, M, M / 2, 0], closed: false },
      pp(M / 2, 0),
      pp(M / 2, M),
    ],
  },
  {
    id: 'symmetry-v',
    name: 'Symetria pionowa',
    category: 'Klasyczne',
    description: 'Pionowa oś symetrii',
    elements: [
      { type: 'line', points: [M / 2, 0, M / 2, M] },
      { type: 'line', points: [M / 4, 0, M / 4, M], dashed: true },
      { type: 'line', points: [(3 * M) / 4, 0, (3 * M) / 4, M], dashed: true },
    ],
  },
  {
    id: 'symmetry-h',
    name: 'Symetria pozioma',
    category: 'Klasyczne',
    description: 'Pozioma oś symetrii',
    elements: [
      { type: 'line', points: [0, M / 2, M, M / 2] },
      { type: 'line', points: [0, M / 4, M, M / 4], dashed: true },
      { type: 'line', points: [0, (3 * M) / 4, M, (3 * M) / 4], dashed: true },
    ],
  },

  {
    id: 'frame-in-frame',
    name: 'Ramka w ramce',
    category: 'Geometria',
    description: 'Zagnieżdżone prostokąty',
    elements: [
      { type: 'rect', x: 0, y: 0, w: M, h: M },
      { type: 'rect', x: M * 0.15, y: M * 0.15, w: M * 0.7, h: M * 0.7 },
      { type: 'rect', x: M * 0.3, y: M * 0.3, w: M * 0.4, h: M * 0.4, dashed: true },
    ],
  },
  {
    id: 'diagonal-lr',
    name: 'Przekątna LR',
    category: 'Geometria',
    description: 'Linia z lewa-góra do prawa-dół',
    elements: [
      { type: 'line', points: [0, 0, M, M] },
      { type: 'line', points: [0, M * 0.15, M * 0.85, M], dashed: true },
      { type: 'line', points: [M * 0.15, 0, M, M * 0.85], dashed: true },
    ],
  },
  {
    id: 'diagonal-rl',
    name: 'Przekątna RL',
    category: 'Geometria',
    description: 'Linia z prawa-góra do lewa-dół',
    elements: [
      { type: 'line', points: [M, 0, 0, M] },
      { type: 'line', points: [M * 0.85, 0, 0, M * 0.85], dashed: true },
      { type: 'line', points: [M, M * 0.15, M * 0.15, M], dashed: true },
    ],
  },
  {
    id: 'dynamic-triangles',
    name: 'Trójkąty dynamiczne',
    category: 'Geometria',
    description: 'Wiele trójkątów dla dynamiki',
    elements: [
      { type: 'line', points: [0, M, M / 2, 0, M, M], closed: true },
      { type: 'line', points: [M / 4, M, M / 2, M / 2, (3 * M) / 4, M], closed: true, dashed: true },
    ],
  },
  {
    id: 'converging-lines',
    name: 'Linie zbieżne',
    category: 'Geometria',
    description: 'Linie zbiegające się w środku',
    elements: [
      { type: 'dot', cx: M / 2, cy: M / 2, r: 4 },
      { type: 'line', points: [0, 0, M / 2, M / 2] },
      { type: 'line', points: [M, 0, M / 2, M / 2] },
      { type: 'line', points: [0, M, M / 2, M / 2] },
      { type: 'line', points: [M, M, M / 2, M / 2] },
      { type: 'line', points: [M / 2, 0, M / 2, M / 2] },
      { type: 'line', points: [M / 2, M, M / 2, M / 2] },
    ],
  },
  {
    id: 'circular',
    name: 'Kompozycja okrągła',
    category: 'Geometria',
    description: 'Koncentryczne okręgi',
    elements: [
      { type: 'circle', cx: M / 2, cy: M / 2, r: M * 0.45 },
      { type: 'circle', cx: M / 2, cy: M / 2, r: M * 0.3, dashed: true },
      { type: 'circle', cx: M / 2, cy: M / 2, r: M * 0.15, dashed: true },
      pp(M / 2, M / 2),
    ],
  },
  {
    id: 'radial',
    name: 'Kompozycja promienista',
    category: 'Geometria',
    description: 'Promienie z centrum',
    elements: [
      { type: 'circle', cx: M / 2, cy: M / 2, r: M * 0.4, dashed: true },
      { type: 'line', points: [M / 2, M / 2, M / 2, 0] },
      { type: 'line', points: [M / 2, M / 2, M / 2, M] },
      { type: 'line', points: [M / 2, M / 2, 0, M / 2] },
      { type: 'line', points: [M / 2, M / 2, M, M / 2] },
      { type: 'line', points: [M / 2, M / 2, 0, 0] },
      { type: 'line', points: [M / 2, M / 2, M, 0] },
      { type: 'line', points: [M / 2, M / 2, 0, M] },
      { type: 'line', points: [M / 2, M / 2, M, M] },
    ],
  },
  {
    id: 's-curve',
    name: 'Krzywa S',
    category: 'Geometria',
    description: 'Elegancka krzywa prowadząca wzrok',
    elements: [
      { type: 'path', data: `${curve([0, M], [M / 2, 0], [M, M])}` },
      { type: 'path', data: `${curve([0, M * 0.1], [M / 2, M * 0.9], [M, M * 0.1])}`, },
    ],
  },

  {
    id: 'portrait-mask',
    name: 'Złota Maska portretowa',
    category: 'Portret',
    description: 'Proporcje twarzy (maska Fibonacci)',
    elements: [
      { type: 'ellipse', cx: M / 2, cy: M * 0.42, rx: M * 0.22, ry: M * 0.3 },
      { type: 'line', points: [M / 2, M * 0.12, M / 2, M * 0.72], dashed: true },
      { type: 'line', points: [M * 0.28, M * 0.42, M * 0.72, M * 0.42], dashed: true },
      { type: 'ellipse', cx: M * 0.4, cy: M * 0.38, rx: M * 0.04, ry: M * 0.02 },
      { type: 'ellipse', cx: M * 0.6, cy: M * 0.38, rx: M * 0.04, ry: M * 0.02 },
      { type: 'line', points: [M * 0.42, M * 0.52, M * 0.58, M * 0.52], dashed: true },
      { type: 'ellipse', cx: M / 2, cy: M * 0.6, rx: M * 0.05, ry: M * 0.03 },
      { type: 'line', points: [M * 0.35, M * 0.68, M * 0.65, M * 0.68], dashed: true },
    ],
  },
  {
    id: 'portrait-head',
    name: 'Owal głowy',
    category: 'Portret',
    description: 'Centralny owal na twarz',
    elements: [
      { type: 'ellipse', cx: M / 2, cy: M / 2, rx: M * 0.28, ry: M * 0.38 },
      { type: 'line', points: [M * 0.22, M * 0.45, M * 0.78, M * 0.45], dashed: true },
      { type: 'line', points: [M / 2, M * 0.12, M / 2, M * 0.88], dashed: true },
      pp(M / 2, M * 0.12),
      pp(M / 2, M * 0.88),
    ],
  },
  {
    id: 'portrait-eyes',
    name: 'Linia oczu',
    category: 'Portret',
    description: 'Linia oczu w 1/3 wysokości',
    elements: [
      { type: 'line', points: [0, M / 3, M, M / 3] },
      { type: 'line', points: [M / 3, M / 3, M / 3, M / 2.5], dashed: true },
      { type: 'line', points: [(2 * M) / 3, M / 3, (2 * M) / 3, M / 2.5], dashed: true },
      pp(M / 3, M / 3),
      pp((2 * M) / 3, M / 3),
    ],
  },
  {
    id: 'portrait-third',
    name: 'Twarz w trójpodziale',
    category: 'Portret',
    description: 'Twarz na przecięciu siatki',
    elements: [
      ...grid,
      { type: 'ellipse', cx: M / 3, cy: M / 3, rx: M * 0.18, ry: M * 0.24 },
      pp(M / 3, M / 3),
    ],
  },
  {
    id: 'portrait-silhouette',
    name: 'Sylwetka pionowa',
    category: 'Portret',
    description: 'Pionowa linia sylwetki',
    elements: [
      { type: 'line', points: [M / 2, M * 0.1, M / 2, M * 0.9] },
      { type: 'circle', cx: M / 2, cy: M * 0.18, r: M * 0.08 },
      { type: 'line', points: [M / 2, M * 0.26, M / 2, M * 0.6] },
      { type: 'line', points: [M / 2, M * 0.35, M * 0.35, M * 0.5] },
      { type: 'line', points: [M / 2, M * 0.35, M * 0.65, M * 0.5] },
    ],
  },

  {
    id: 'arch-one-point',
    name: 'Perspektywa 1-punktowa',
    category: 'Architektura',
    description: 'Zbieg do jednego punktu',
    elements: [
      pp(M / 2, M / 2),
      { type: 'line', points: [0, 0, M / 2, M / 2] },
      { type: 'line', points: [M, 0, M / 2, M / 2] },
      { type: 'line', points: [0, M, M / 2, M / 2] },
      { type: 'line', points: [M, M, M / 2, M / 2] },
      { type: 'line', points: [0, M / 2, M / 2, M / 2], dashed: true },
      { type: 'line', points: [M / 2, 0, M / 2, M / 2], dashed: true },
    ],
  },
  {
    id: 'arch-two-point',
    name: 'Perspektywa 2-punktowa',
    category: 'Architektura',
    description: 'Dwa punkty zbiegu na horyzoncie',
    elements: [
      { type: 'line', points: [0, M * 0.55, M, M * 0.55], dashed: true },
      pp(M * 0.1, M * 0.55),
      pp(M * 0.9, M * 0.55),
      { type: 'line', points: [M * 0.1, M * 0.55, M / 2, M * 0.15] },
      { type: 'line', points: [M * 0.9, M * 0.55, M / 2, M * 0.15] },
      { type: 'line', points: [M * 0.1, M * 0.55, M / 2, M * 0.85] },
      { type: 'line', points: [M * 0.9, M * 0.55, M / 2, M * 0.85] },
      { type: 'line', points: [M * 0.3, M * 0.35, M * 0.7, M * 0.35], dashed: true },
    ],
  },
  {
    id: 'arch-horizon',
    name: 'Linia horyzontu',
    category: 'Architektura',
    description: 'Pozioma linia horyzontu',
    elements: [
      { type: 'line', points: [0, M / 3, M, M / 3] },
      { type: 'line', points: [0, (2 * M) / 3, M, (2 * M) / 3], dashed: true },
      { type: 'line', points: [M / 2, 0, M / 2, M], dashed: true },
    ],
  },
  {
    id: 'arch-vanishing',
    name: 'Punkt zbiegu dolny',
    category: 'Architektura',
    description: 'Zbieg w dolnej trzeciej',
    elements: [
      pp(M / 2, (2 * M) / 3),
      { type: 'line', points: [0, 0, M / 2, (2 * M) / 3] },
      { type: 'line', points: [M, 0, M / 2, (2 * M) / 3] },
      { type: 'line', points: [0, M / 2, M / 2, (2 * M) / 3], dashed: true },
      { type: 'line', points: [M, M / 2, M / 2, (2 * M) / 3], dashed: true },
    ],
  },
  {
    id: 'arch-columns',
    name: 'Siatka kolumn',
    category: 'Architektura',
    description: 'Pionowe linie rytmu',
    elements: [
      { type: 'line', points: [M * 0.15, 0, M * 0.15, M] },
      { type: 'line', points: [M * 0.38, 0, M * 0.38, M] },
      { type: 'line', points: [M * 0.61, 0, M * 0.61, M] },
      { type: 'line', points: [M * 0.84, 0, M * 0.84, M] },
      { type: 'line', points: [0, M * 0.3, M, M * 0.3], dashed: true },
    ],
  },
  {
    id: 'arch-arch',
    name: 'Łuk architektoniczny',
    category: 'Architektura',
    description: 'Łuk i pionowe kolumny',
    elements: [
      { type: 'path', data: arcPath(M / 2, M * 0.4, M * 0.3, Math.PI, 0) },
      { type: 'line', points: [M * 0.2, M * 0.4, M * 0.2, M] },
      { type: 'line', points: [M * 0.8, M * 0.4, M * 0.8, M] },
      { type: 'line', points: [0, M * 0.7, M, M * 0.7], dashed: true },
    ],
  },

  {
    id: 'min-center',
    name: 'Centralna kropka',
    category: 'Minimalizm',
    description: 'Sam środek kadru',
    elements: [
      pp(M / 2, M / 2),
      { type: 'circle', cx: M / 2, cy: M / 2, r: M * 0.02 },
    ],
  },
  {
    id: 'min-cross',
    name: 'Krzyż środkowy',
    category: 'Minimalizm',
    description: 'Minimalny krzyż w centrum',
    elements: [
      { type: 'line', points: [M * 0.45, M / 2, M * 0.55, M / 2] },
      { type: 'line', points: [M / 2, M * 0.45, M / 2, M * 0.55] },
    ],
  },
  {
    id: 'min-third-dot',
    name: 'Punkt w trójpodziale',
    category: 'Minimalizm',
    description: 'Jeden mocny punkt',
    elements: [
      { type: 'line', points: [M / 3, 0, M / 3, M], dashed: true },
      { type: 'line', points: [0, M / 3, M, M / 3], dashed: true },
      pp(M / 3, M / 3),
    ],
  },
  {
    id: 'min-h-line',
    name: 'Linia pozioma',
    category: 'Minimalizm',
    description: 'Jedna pozioma linia',
    elements: [{ type: 'line', points: [0, M / 2, M, M / 2] }],
  },
  {
    id: 'min-v-line',
    name: 'Linia pionowa',
    category: 'Minimalizm',
    description: 'Jedna pionowa linia',
    elements: [{ type: 'line', points: [M / 2, 0, M / 2, M] }],
  },
  {
    id: 'min-diagonal',
    name: 'Pojedyncza przekątna',
    category: 'Minimalizm',
    description: 'Jedna linia ukośna',
    elements: [{ type: 'line', points: [M * 0.2, M * 0.8, M * 0.8, M * 0.2] }],
  },
  {
    id: 'min-frame',
    name: 'Minimalna ramka',
    category: 'Minimalizm',
    description: 'Cienka ramka wokół kadru',
    elements: [{ type: 'rect', x: M * 0.05, y: M * 0.05, w: M * 0.9, h: M * 0.9 }],
  },
];

export const CATEGORIES: CompositionTemplate['category'][] = [
  'Klasyczne',
  'Geometria',
  'Portret',
  'Architektura',
  'Minimalizm',
];
