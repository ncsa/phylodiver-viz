import { Component, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Sample } from 'src/app/models/dto';
import { CellData } from 'src/app/models/toy-dto';
import { DataService } from 'src/app/services/data.service';
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
  blockLabel = '';

  @Input()
  blockLevel = 1;

  @Input()
  blockList: any[] = []; // TODO FIXME

  @Input()
  children: CellData[] = [];

  @Input()
  color: string = '#555';

  @Input()
  genes = 0;

  @Input()
  ignoreScaling = false;

  @Input()
  jsonData?: CellData;

  @Input()
  key = '';

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

  subscriptions: Subscription[] = [];

  parentsAggregate = {
    't1_mutations': 0,
    'mutations': 0,
    't1_cgc_genes': 0,
    'genes': 0,
    'drugs': 0,
  };
  selectedSample: Sample|null = null;
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
    this.subscriptions.push(this.selectionService.getSample().subscribe(selectedSample => {
      this.selectedSample = selectedSample;
      this.getChildrenTotal();
      this.updateStyle();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('parent' in changes) {
      this.updateParentsAggregate();
    }
    if ('selected' in changes || 'parentTotal' in changes || 'jsonData' in changes) {
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
    return this.jsonData?.proportion ? (this.jsonData.proportion[this.selectedSample!.sample_id] || 0) : 0;
  }

  getChildrenTotal(): number {
    let total = 0;
    if (this.children) {
      for (let i=0; i < this.children.length; i++) {
        if (typeof this.children[i].proportion[this.selectedSample!.sample_id] != 'undefined') {
          total += this.children[i].proportion[this.selectedSample!.sample_id];
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
      totals['t1_mutations'] += parent_data.jsonData?.t1_mutations || 0;
      totals['mutations'] += parent_data.jsonData?.mutations || 0;
      totals['t1_cgc_genes'] += parent_data.jsonData?.t1_cgc_genes || 0;
      totals['genes'] += parent_data.genes;
      totals['drugs'] += parent_data.jsonData?.drugs || 0;
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
