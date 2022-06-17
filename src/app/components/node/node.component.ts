import { Component, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { Cluster, Sample } from 'src/app/models/pipeline-dto';
import { DisplayNode, DisplayVariant } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-node',
  templateUrl: './node.component.html',
  styleUrls: ['../../styles/styles.scss', './node.component.scss'],
})
export class NodeComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class.is_selected') isFirstSelected = false;
  @HostBinding('class.is_visible') isSelected = false;
  @HostBinding('style') cssStyles:{[key: string]: string} = {};

  @HostListener('click', ['$event'])
  onClick(e:any) {
     e.stopPropagation();
     this.onSelectBlock();
  }

  @Input()
  displayNode: DisplayNode|null = null;

  subscriptions: Subscription[] = [];

  consolidatedVariantInfo = getEmptyVariantInfo();
  sortedSummaryTableRows: SummaryTableRow[] = [];
  selectedNode: DisplayNode|null = null;
  selectedSample: Sample|null = null;
  showTable = false;

  clusterIdToCluster = new Map<number, Cluster>();
  snvIdToDisplayVariant = new Map<number, DisplayVariant>();

  gradientId = 'uninitialized';

  summaryColumns = [
    { label: 'Mutations', cssSuffix: 'mutations', accessor: (consequence: string, info: VariantInfo) => info.mutationsAll.size },
    { label: 'Consequence', cssSuffix: 'consequence', accessor: (consequence: string, info: VariantInfo) => consequence },
    { label: 'Type', cssSuffix: 'type', accessor: (consequence: string, info: VariantInfo) => 'SNV' },
    { label: 'CGC Genes', cssSuffix: 'cgc_genes', accessor: (consequence: string, info: VariantInfo) => info.genesCgc.size }
  ];

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([
        this.dataService.getSnvIdToDisplayVariant(),
        this.dataService.getClusterIdToCluster()
      ]).subscribe(([snvIdToDisplayVariant, clusterIdToCluster]) => {
      this.snvIdToDisplayVariant = snvIdToDisplayVariant;
      this.clusterIdToCluster = clusterIdToCluster;
      if (this.displayNode) {
        this.updateVariantsInfo();
      }
    }));
    this.subscriptions.push(this.selectionService.getShowTable().subscribe(showTable => {
      this.showTable = showTable;
    }));
    this.subscriptions.push(this.selectionService.getDisplayNode().subscribe(selectedNode => {
      this.selectedNode = selectedNode;
      // isFirstSelected: is this the node the user clicked on?
      this.isFirstSelected = selectedNode === this.displayNode;
      // isSelected: is this the node either the node the user clicked on or an ancestor of the
      // node the user clicked on?
      this.isSelected = false;
      let comparisonNode = this.selectedNode;
      while (comparisonNode) {
        if (comparisonNode === this.displayNode) {
          this.isSelected = true;
          break;
        }
        comparisonNode = comparisonNode.parent;
      }
      this.updateStyle();
    }));
    this.subscriptions.push(this.selectionService.getSample().subscribe(selectedSample => {
      this.selectedSample = selectedSample;
      this.updateVariantsInfo();
      this.updateStyle();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('displayNode' in changes && this.displayNode) {
      this.gradientId = 'gradient_' + this.displayNode!.node_name.replace(/\W/, '-');
      this.updateVariantsInfo();
      this.updateStyle();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getThisNode(): NodeComponent {
    return this;
  }

  updateVariantsInfo(): void {
    // clusterIds will contain the clusters whose variants we'll report
    let clusterIds: number[];
    if (this.displayNode!.cluster) {
      // DisplayNode represents a subclone, so we want to aggregate the subclone cluster variants along with all its parent cluster variants
      clusterIds = this.displayNode!.aggregateClusterIds;
    } else {
      // DisplayNode represents a subtree, so we want to show only the cluster associated with the next child subclone
      clusterIds = this.displayNode!.children.filter(node => node.cluster).map(node => node.cluster_id!);
    }
    // build variant info per consequence
    const consequenceToVariantInfo = new Map<string, VariantInfo>();
    clusterIds.forEach(clusterId => {
      const cluster = this.clusterIdToCluster.get(clusterId);
      cluster?.variants.forEach(variant => {
        const snp = this.snvIdToDisplayVariant.get(variant);
        if (snp) {
          const consequence = snp.consequence ?? '';
          if (!consequenceToVariantInfo.has(consequence)) {
            consequenceToVariantInfo.set(consequence, getEmptyVariantInfo());
          }
          const variantInfo = consequenceToVariantInfo.get(consequence)!;
          variantInfo.mutationsAll.add(variant);
          const geneName = snp.gene;
          if (geneName && geneName.length > 0) {
            variantInfo.genesAll.add(geneName);
            if (snp.cgcGeneInfo) {
              variantInfo.genesCgc.add(geneName);
              if (snp.cgcGeneInfo.tier === 1) {
                variantInfo.mutationsTier1.add(variant);
              }
            }
          }
          // TODO drugs
        } else {
          console.warn('Could not find SNP for variant ' + variant);
        }
      });
    });
    // consolidate variant info across consequences
    this.consolidatedVariantInfo = combineVariantInfos([...consequenceToVariantInfo.values()]);
    // sort for table
    this.sortedSummaryTableRows = [...consequenceToVariantInfo.entries()]
      .map(([consequence, variantInfo]) => ({ consequence, variantInfo }))
      .sort((a, b) => b.variantInfo.mutationsAll.size - a.variantInfo.mutationsAll.size);
  }

  updateStyle(): void {
    const startColor = this.displayNode!.color;
    //get children color (assume first is the same as all of them)
    const childrenColor = (this.displayNode?.children && this.displayNode.children[0]?.color) || startColor;
    let styles = {
      '--cell_block_color': startColor,
      '--gradient_start': startColor,
      '--gradient_end': childrenColor
    } as any;
    //only apply the height for the final tree end // TODO FIXME not what I'm doing at the moment; see next line
    if (true || this.displayNode?.cluster) { // TODO FIXME when should we set the flex style?
      const hasSelectedNode = !!this.selectedNode;
      const selectedBlockLevel = hasSelectedNode ? this.selectedNode!.level : 0;
      styles['flex'] = (hasSelectedNode && selectedBlockLevel >= this.displayNode!.level && !this.isSelected) ? '1' : '' + (this.displayNode!.prevalence * 1000); //proper value is 100, using 1000 to force this to shrink super small when selected
      //styles['flex'] = (has_selected_block && selected_block_level >= this.block_level && !this.is_selected) ? '1' : '' + (this.genes / this.parent_total * 1000); //proper value is 100, using 1000 to force this to shrink super small when selected
    }
    this.cssStyles = styles;
  }

  onToggleTable(row: SummaryTableRow|null): void {
    this.selectionService.setConsequence(row?.consequence ?? null);
    //toggle table
    this.selectionService.setShowTable(!this.showTable);
  };

  onSelectBlock(): void {
    //globally change the indicate which blocks are selected (or none at all)
    if (this.isFirstSelected) {
      //deselect this block
      this.selectionService.setDisplayNode(null);
    } else {
      this.selectionService.setDisplayNode(this.displayNode);
    }
  }

}

export interface SummaryTableRow {
  consequence: string;
  variantInfo: VariantInfo;
}

export function getEmptyVariantInfo(): VariantInfo {
  return {
    mutationsTier1: new Set<number>(),
    mutationsAll: new Set<number>(),
    genesCgc: new Set<string>(),
    genesAll: new Set<string>(),
    drugs: new Set<string>()
  };
}

export function combineVariantInfos(infos: VariantInfo[]): VariantInfo {
  const returnVal = getEmptyVariantInfo();
  infos.forEach(info => {
    (['mutationsTier1', 'mutationsAll', 'genesCgc', 'genesAll', 'drugs'] as Array<keyof VariantInfo>).forEach(key => {
      info[key].forEach(val => (returnVal[key] as Set<string|number>).add(val));
    });
  });
  return returnVal;
}

export interface VariantInfo {
  mutationsTier1: Set<number>; // values will be variant ids
  mutationsAll: Set<number>; // values will be variant ids
  genesCgc: Set<string>; // values will be gene symbols
  genesAll: Set<string>; // values will be gene symbols
  drugs: Set<string>; // values will be drug names
}