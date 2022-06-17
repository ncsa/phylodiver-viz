import { Component, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Sample } from 'src/app/models/dto';
import { DisplayNode } from 'src/app/models/models';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-node',
  templateUrl: './node.component.html',
  styleUrls: ['../../styles/styles.scss', './node.component.scss'],
})
export class NodeComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class.is_selected') isFirstSelected:boolean = false;
  @HostBinding('class.is_visible') isSelected:boolean = false;
  @HostBinding('style') cssStyles:{[key: string]: string} = {};

  @HostListener('click', ['$event'])
  onClick(e:any) {
     e.stopPropagation();
     this.onSelectBlock();
  }

  @Input()
  displayNode: DisplayNode|null = null;

  subscriptions: Subscription[] = [];

  parentsAggregate = {
    't1_mutations': 0,
    'mutations': 0,
    't1_cgc_genes': 0,
    'genes': 0,
    'drugs': 0,
  };
  selectedSample: Sample|null = null;
  showTable = false;
  selectedNodes: DisplayNode[] = [];

  gradientId = 'uninitialized';

  summaryColumns = [
    { field: "tier", label: "Tier" },
    { field: "type", label: "Type" },
    { field: "mutations", label: "Mutations" },
    { field: "cgc_genes", label: "CGC Genes" },
    { field: "drugs", label: "Drugs" }
  ];

  constructor(
    private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.selectionService.getShowTable().subscribe(showTable => {
      this.showTable = showTable;
    }));
    this.subscriptions.push(this.selectionService.getSelectedNodes().subscribe(nodes => {
      //determine if this is the first in the selected array (which is the one clicked on)
      this.isFirstSelected = nodes.length > 0 && nodes[0] === this.displayNode;
      //consider it selected if in the selected array (selected or parent of)
      this.isSelected = nodes.find(node => node === this.displayNode) !== undefined;
      this.selectedNodes = nodes;
    }));
    this.subscriptions.push(this.selectionService.getSample().subscribe(selectedSample => {
      this.selectedSample = selectedSample;
      this.getChildrenTotal();
      this.updateStyle();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('displayNode' in changes && this.displayNode) {
      this.gradientId = 'gradient_' + this.displayNode!.node_name.replace(/\W/, '-');
      this.updateParentsAggregate();
      this.updateStyle();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getThisNode(): NodeComponent {
    return this;
  }

  getChildrenTotal(): number {
    return this.displayNode?.children?.map(child => child.prevalence).reduce((prev, cur) => prev + cur, 0) || 0;
  }

  getAllParents(): DisplayNode[] {
    const returnVal: DisplayNode[] = [];
    let currentNode = this.displayNode;
    while (currentNode) {
      let parent = currentNode.parent;
      if (parent) {
        returnVal.push(parent);
      }
      currentNode = parent;
    }
    return returnVal;
  }

  updateParentsAggregate(): void {
    const totals = {
      't1_mutations': 0,
      'mutations': 0,
      't1_cgc_genes': 0,
      'genes': 0,
      'drugs': 0,
    };
    //walk up each parent and create aggregate
    this.getAllParents().forEach(node => {
      totals['t1_mutations'] += 0; // node?.cluster?.variants?. || 0;
      totals['mutations'] += 0; //parent_data.jsonData?.mutations || 0;
      totals['t1_cgc_genes'] += 0; //parent_data.jsonData?.t1_cgc_genes || 0;
      totals['genes'] += 0; //parent_data.genes;
      totals['drugs'] += 0; //parent_data.jsonData?.drugs || 0;
    });
    this.parentsAggregate = totals;
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
    //only apply the height for the final tree end
    if (true || this.displayNode?.cluster) { // TODO FIXME when should we set the flex style?
      const hasSelectedNode = this.selectedNodes.length > 0;
      const selectedBlockLevel = hasSelectedNode ? this.selectedNodes[0].level : 0;
      styles['flex'] = (hasSelectedNode && selectedBlockLevel >= this.displayNode!.level && !this.isSelected) ? '1' : '' + (this.displayNode!.prevalence * 1000); //proper value is 100, using 1000 to force this to shrink super small when selected
      //styles['flex'] = (has_selected_block && selected_block_level >= this.block_level && !this.is_selected) ? '1' : '' + (this.genes / this.parent_total * 1000); //proper value is 100, using 1000 to force this to shrink super small when selected
    }
    this.cssStyles = styles;
  }

  onToggleTable(tier: any): void { // TODO FIXME
    //update tier (if supplied)
    this.selectionService.setPhylogenySelectedTier(tier);
    //toggle table
    this.selectionService.setShowTable(!this.showTable);
  };

  onSelectBlock(): void {
    //globally change the indicate which blocks are selected (or none at all)
    if (this.isFirstSelected) {
      //deselect this block
      this.selectionService.setSelectedNodes([]);
    } else {
      this.selectionService.setSelectedNodes([this.displayNode!, ...this.getAllParents()]);
    }
  }

}
