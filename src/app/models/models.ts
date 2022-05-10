import { NodeComponent } from "../components/node/node.component";

export interface PhylogenyProportionSet {
  color: string;
  proportion: number;
  endBlock: NodeComponent;
}

export interface ChildFIXME {
  color: string;
  edge_label: string;
  label: string;
  proportion: {[sampleName: string]: number};
  sample: string;
  children?: ChildFIXME[];
  genes?: number;
}