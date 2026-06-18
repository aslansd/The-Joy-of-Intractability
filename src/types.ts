export interface Node2D {
  id: string;
  x: number;
  y: number;
  color?: string; // For coloring graph: 'red', 'green', 'blue' or none
}

export interface Edge {
  u: string;
  v: string;
  conflict?: boolean; // For coloring graph conflicts
}

export type ActiveChapter = 'intro' | 'p' | 'np' | 'npc' | 'p_vs_np' | 'coping' | 'outro';
