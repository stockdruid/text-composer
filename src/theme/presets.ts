export type Preset = {
  id: string;
  label: string;
  vars: Record<string, string>;
};

export const presets: Preset[] = [
  {
    id: 'aurora',
    label: '오로라 (기본)',
    vars: {
      '--frame-c1': '#281c59',
      '--frame-c2': '#4e8d9c',
      '--frame-c3': '#85c79a',
      '--frame-c4': '#edf7bd',
      '--text-body': '#ffffff',
      '--text-quote': '#d8c4ec',
      '--text-strong': '#ffffff',
      '--text-italic': 'rgba(255, 255, 255, 0.7)',
      '--text-divider': 'rgba(255, 255, 255, 0.22)',
    },
  },
  {
    id: 'rose',
    label: '로즈 글라스',
    vars: {
      '--frame-c1': '#4a2a4a',
      '--frame-c2': '#c87a9c',
      '--frame-c3': '#f4c8d8',
      '--frame-c4': '#fde8ec',
      '--text-body': '#ffffff',
      '--text-quote': '#e8c8ec',
      '--text-strong': '#ffffff',
      '--text-italic': 'rgba(255, 255, 255, 0.72)',
      '--text-divider': 'rgba(255, 255, 255, 0.22)',
    },
  },
  {
    id: 'arctic',
    label: '아크틱 (라이트)',
    vars: {
      '--frame-c1': '#a8c8ee',
      '--frame-c2': '#c8d8f0',
      '--frame-c3': '#e8e0f0',
      '--frame-c4': '#ffffff',
      '--text-body': '#1a1638',
      '--text-quote': '#7a5fbf',
      '--text-strong': '#0a0828',
      '--text-italic': 'rgba(26, 22, 56, 0.62)',
      '--text-divider': 'rgba(26, 22, 56, 0.18)',
      '--glass-bg': 'rgba(255, 255, 255, 0.35)',
      '--glass-border': 'rgba(255, 255, 255, 0.7)',
      '--glass-border-top': 'rgba(255, 255, 255, 0.95)',
      '--glass-border-bottom': 'rgba(255, 255, 255, 0.4)',
    },
  },
  {
    id: 'sunset',
    label: '선셋',
    vars: {
      '--frame-c1': '#3a1a4a',
      '--frame-c2': '#c84a6a',
      '--frame-c3': '#f4a868',
      '--frame-c4': '#fce4a8',
      '--text-body': '#ffffff',
      '--text-quote': '#fde0c8',
      '--text-strong': '#ffffff',
      '--text-italic': 'rgba(255, 255, 255, 0.72)',
      '--text-divider': 'rgba(255, 255, 255, 0.22)',
    },
  },
];

export function applyPreset(frame: HTMLElement, id: string): void {
  const preset = presets.find((p) => p.id === id) ?? presets[0]!;
  const glassKeys = [
    '--glass-bg',
    '--glass-border',
    '--glass-border-top',
    '--glass-border-bottom',
  ];
  for (const k of glassKeys) frame.style.removeProperty(k);
  for (const [k, v] of Object.entries(preset.vars)) {
    frame.style.setProperty(k, v);
  }
}
