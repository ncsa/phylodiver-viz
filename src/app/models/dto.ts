export interface Aggregate {
  version: string;
  samples: Sample[];
  SNV: SNV[];
  clusters: Cluster[];
  trees: Tree[];
}

export interface Sample {
  sample_id: number;
  name: string;
  type: "normal" | "tumor";
}

export interface SNV {
  SNV_id: number;
  chr: string;
  start: number;
  reference: string;
  variant: string;
  strand?: string;
  consequence?: string;
  symbol?: string;
  gene?: string;
  vaf?: number[];
  vaf_counts?: number[][];
  amino_acid_change?: string;
}

export interface Cluster {
  cluster_id: number;
  sample_id: number;
  sample_name: string; // DON'T NEED
  variants: number[];
}

export interface Tree {
  tree_id: number;
  tree_name: string;
  tree_score: number|null; // CANNOT BE NaN
  nodes: Node[];
}

export interface Node {
  cluster_id?: number;
  node_name: string;
  prevalence: Prevalence[];
  children: string[];
}

export interface Prevalence {
  sample_id: number;
  value: number;
}
