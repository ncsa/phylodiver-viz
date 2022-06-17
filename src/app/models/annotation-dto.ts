export interface CgcGenes {
  [geneSymbol: string]: RawCgcGeneInfo 
}

export interface RawCgcGeneInfo {
  'Hallmark'?: 'Yes';
  'Tumour Types(Somatic)'?: string[];
  'Tier': number;
  'Entrez GeneId'?: number;
}
