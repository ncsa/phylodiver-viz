import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChildFIXME } from 'src/app/models/models';

import { DataService } from 'src/app/services/data.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  blockLabel = '';

  @Input()
  blockLevel = 1;

  @Input()
  blockList: any[] = []; // TODO FIXME

  @Input()
  children: ChildFIXME[] = []; // TODO FIXME

  @Input()
  color: string = '#555';

  @Input()
  genes = 0;

  @Input()
  ignoreScaling = false;

  @Input()
  jsonData: any; // TODO FIXME

  @Input()
  key = 0;

  @Input()
  label = '';

  @Input()
  parent: NodeComponent|undefined;

  @Input()
  parentTotal = 0;

  @Input()
  sample = '';

  @Input()
  showEndBlock = false;

  @Input()
  showStats = true;

  @Input()
  showPrimaryBlocks = true;

  @Input()
  showStripes = true;


  subscriptions: Subscription[] = [];

  cssStyles: {[key: string]: string} = {};
  isFirstSelected = false;
  isSelected = false;
  parentsAggregate = {
    't1_mutations': 0,
    'mutations': 0,
    't1_cgc_genes': 0,
    'genes': 0,
    'drugs': 0,
  };
  phylogenyProportionId: any; // TODO FIXME
  phylogenyShowTable = false;
  selectedBlocks: NodeComponent[] = [];

  summaryColumns = [
    { field: "tier", label: "Tier" },
    { field: "type", label: "Type" },
    { field: "mutations", label: "Mutations" },
    { field: "cgc_genes", label: "CGC Genes" },
    { field: "drugs", label: "Drugs" }
  ];

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.selectionService.getPhylogenyShowTable().subscribe(showTable => {
      this.phylogenyShowTable = showTable;
    }));
    this.subscriptions.push(this.selectionService.getSelectedBlocks().subscribe(blocks => {
      //determine if this is the first in the selected array (which is the one clicked on)
      //reference this variable so this computed value will update when this variable does
      //https://logaretm.com/blog/2019-10-11-forcing-recomputation-of-computed-properties
      this.isFirstSelected = blocks.length > 0 && blocks[0] == this;
      //consider it selected if in the selected array (selected or parent of)
      //reference this variable so this computed value will update when this variable does
      //https://logaretm.com/blog/2019-10-11-forcing-recomputation-of-computed-properties
      this.isSelected = blocks.indexOf(this) > -1;
      this.selectedBlocks = blocks;
    }));
    this.subscriptions.push(this.selectionService.getPhylogenyProportionId().subscribe(proportionId => {
      this.phylogenyProportionId = proportionId;
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('jsonData' in changes || 'children' in changes) {
      this.updatePhylogenyProportionSets();
    }
    if ('parent' in changes) {
      this.updateParentsAggregate();
    }
    if ('selected' in changes || 'parentTotal' in changes) {
      this.updateStyle();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getThisNode(): NodeComponent {
    return this;
  }

  getProportion(): number {
    return this.jsonData?.proportion ? (this.jsonData.proportion[this.phylogenyProportionId] || 0) : 0;
  }

  getChildrenTotal(): number {
    let total = 0;
    if (this.children) {
      for (let i=0; i < this.children.length; i++) {
        if (typeof this.children[i].proportion[this.phylogenyProportionId] != 'undefined') {
          total += this.children[i].proportion[this.phylogenyProportionId];
        }
      }
    }
    //return the total OR the number of genes specified
    return total; //(this.children) ? total : this.genes;
  }

  getAllParents(list: NodeComponent[]): NodeComponent[] {
    if (this.parent) {
      //add this parent reference
      list.push(this.parent);
      return this.parent.getAllParents(list);
    } else {
      //return the final list
      return list;
    }
  }

  updatePhylogenyProportionSets(): void {
    //update phylogeny_proportion_sets (but only if this is an end block)
    if (this.jsonData && (typeof this.children == 'undefined' || this.children.length == 0)) {
      Object.entries(this.jsonData.proportion as {[setName: string]: number}).forEach(([setName, proportion]) => {
        //add entry for this block
        this.dataService.addPhylogenyProportionSet(setName, {
          color: this.color,
          proportion: proportion || 0,
          endBlock: this
        });
      });
    }
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
    let parents = this.getAllParents([]);
    for(let i=0; i<parents.length; i++) {
      let parent_data = parents[i];
      totals['t1_mutations'] += parent_data.jsonData.t1_mutations;
      totals['mutations'] += parent_data.jsonData.mutations;
      totals['t1_cgc_genes'] += parent_data.jsonData.t1_cgc_genes;
      totals['genes'] += parent_data.genes;
      totals['drugs'] += parent_data.jsonData.drugs;
    }
    this.parentsAggregate = totals;
  }

  updateStyle(): void {
    //get children color (assume first is the same as all of them)
    const startColor = this.color || '#555';
    const childrenColor = (this.children && this.children[0]?.color) || startColor;
    let styles = {
      '--cell_block_color': startColor,
      '--gradient_start': startColor,
      '--gradient_end': childrenColor
    } as any;
    //only apply the height for the final tree end
    if (this.parentTotal) {
      const hasSelectedBlock = this.selectedBlocks.length > 0;
      const selectedBlockLevel = hasSelectedBlock ? this.selectedBlocks[0].blockLevel : 0;
      styles['flex'] = (!this.ignoreScaling && hasSelectedBlock && selectedBlockLevel >= this.blockLevel && !this.isSelected) ? '1' : '' + (this.getProportion() * 1000); //proper value is 100, using 1000 to force this to shrink super small when selected
      //styles['flex'] = (has_selected_block && selected_block_level >= this.block_level && !this.is_selected) ? '1' : '' + (this.genes / this.parent_total * 1000); //proper value is 100, using 1000 to force this to shrink super small when selected
    }
    this.cssStyles = styles;
  }

  onToggleTable(tier: any): void { // TODO FIXME
    //update tier (if supplied)
    this.selectionService.setPhylogenySelectedTier(tier);
    //toggle table
    this.selectionService.setPhylogenyShowTable(!this.phylogenyShowTable);
  };

  onSelectBlock(): void {
    //determine if we override the on_click
    /* TODO FIXME
    if (this.on_click) {
      this.on_click((this.callback_value) ? this.callback_value : this);
      return;
    }
    */
    //globally change the indicate which blocks are selected (or none at all)
    if (this.isFirstSelected) {
      //deselect this block
      this.selectionService.setSelectedBlocks([]);
    } else {
      //walk through and find any parent blocks for this selected block
      let selectedBlocks: NodeComponent[] = [];
      //make sure this is added (and first in the array)
      selectedBlocks.push(this);
      //recursively walk through parents
      selectedBlocks = selectedBlocks.concat(this.getAllParents([]));
      this.selectionService.setSelectedBlocks(selectedBlocks);
    }
  }

}
