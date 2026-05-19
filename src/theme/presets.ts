export type Preset = {
  id: string;
  label: string;
  vars: Record<string, string>;
};

export const presets: Preset[] = [
  {
    id: 'pink',
    label: '핑크 파스텔',
    vars: {
      '--bg-frame': '#fdf2f5',
      '--bg-frame-2': '#f8e8ee',
      '--text-body': '#2a2a2a',
      '--text-quote': '#b8a8e8',
      '--text-muted': '#6a6a6a',
    },
  },
  {
    id: 'navy',
    label: '네이비 글라스',
    vars: {
      '--bg-frame': '#281c59',
      '--bg-frame-2': '#4e8d9c',
      '--text-body': '#f5f4ff',
      '--text-quote': '#c8b8ff',
      '--text-muted': 'rgba(245, 244, 255, 0.65)',
      '--text-divider': 'rgba(245, 244, 255, 0.16)',
    },
  },
  {
    id: 'lime',
    label: '라임 크림',
    vars: {
      '--bg-frame': '#edf7bd',
      '--bg-frame-2': '#d5e8b0',
      '--text-body': '#1a1638',
      '--text-quote': '#7a5fbf',
      '--text-muted': '#4a3d6e',
    },
  },
];

export function applyPreset(frame: HTMLElement, id: string): void {
  const preset = presets.find((p) => p.id === id) ?? presets[0]!;
  for (const [k, v] of Object.entries(preset.vars)) {
    frame.style.setProperty(k, v);
  }
}
