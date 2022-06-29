export interface CgcGenes {
  [geneSymbol: string]: RawCgcGeneInfo 
}

export interface RawCgcGeneInfo {
  'Hallmark'?: 'Yes';
  'Tumour Types(Somatic)'?: string[];
  'Tier': number;
  'Entrez GeneId'?: number;
}

export type SeverityKey = 'HIGH'|'MODERATE'|'LOW'|'MODIFIER'|'UNKNOWN';

export interface ConsequenceSeverity {
  consequence: string;
  severity: SeverityKey;
}
