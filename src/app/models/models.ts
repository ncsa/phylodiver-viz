import { Cluster } from "./dto";

export interface DisplayNode {
  cluster_id?: number;
  cluster?: Cluster;
  color: string;
  node_name: string;
  prevalence: number;
  children: DisplayNode[];
  childClusterNodeNames: string[];
  parent: DisplayNode|null;
  level: number;
}