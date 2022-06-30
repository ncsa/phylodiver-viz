import { SeverityKey } from "./models";

export interface CgcGenes {
  [geneSymbol: string]: RawCgcGeneInfo;
}

export interface RawCgcGeneInfo {
  'Hallmark'?: 'Yes';
  'Tumour Types(Somatic)'?: string[];
  'Tier': number;
  'Entrez GeneId'?: number;
}

export interface ConsequenceSeverities {
  [consequence: string]: SeverityKey;
}

export interface DrugInfo {
  [geneSymbol: string]: {
    interactions: {[drugName: string]: {}},
    entrez_id: number;
  }
}