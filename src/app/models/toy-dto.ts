export interface PhylogenyData {
  cell_data: CellData[];
}

export interface CellData {
  label: string;
  edge_label: string;
  sample: string;
  proportion: Proportion;
  color: string;
  t1_mutations?: number;
  mutations?: number;
  t1_cgc_genes?: number;
  genes?: number;
  drugs?: number;
  show_end_block?: boolean; // TODO FIXME never used?
  show_summary?: boolean;
  summary?: SummaryItem[];
  details?: DetailItem[];
  children?: CellData[];
}

export type Proportion = {[sampleId: string]: number};

export interface SummaryItem {
  tier: string;
  type: string;
  mutations: string;
  cgc_genes: string;
  drugs: string;
}

export interface DetailItem {
  tier: string;
  type: string;
  trv_type: string;
  chr: string;
  start: string;
  gene: string;
  amino_acid_change: string;
  reference: string;
  variant: string;
  strand: string;
  ucsc_cons: string;
  NORMAL_ALLDNA_VAF: string;
  TUMOR_ALLDNA_VAF: string;
  RELAPSE_ALLDNA_VAF: string;
  cgc_gene: string;
  drug: string;
  drug_pathway: string;
}