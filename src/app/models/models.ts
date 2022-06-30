import { Cluster, SNV } from "./pipeline-dto";

export interface DisplayNode {
  cluster_id?: number;
  cluster?: Cluster;
  color: string;
  node_name: string;
  prevalence: number;
  children: DisplayNode[];
  childClusterNodeNames: string[];
  parent: DisplayNode|null;
  aggregateClusterIds: number[]; // cluster_ids for all clusters whose variants appear in this node
  descendedClusterIds: number[]; // cluster_ids for all clusters descended from this node
  level: number;
}

export type SeverityKey = 'HIGH'|'MODERATE'|'LOW'|'MODIFIER'|'UNKNOWN';

export interface Severity {
  label: string;
  value: SeverityKey;
  sortOrder: number;
}

export interface DisplayVariant extends SNV {
  cgcGeneInfo: CgcGeneInfo|null;
  drugs: string[];
  severity: Severity;
}

export interface CgcGeneInfo {
  isHallmark: boolean;
  somaticTumorTypes: string[];
  tier: number|null;
  entrezGeneId: number|null;
}