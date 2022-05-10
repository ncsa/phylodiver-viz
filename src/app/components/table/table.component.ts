import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  label: string|null = null;
  edgeLabel: string|null = null;
  detailsData: any[] = []; // TODO FIXME
  phylogenySelectedTier: any;

  tableColumns = [
    { field: "tier", label:  "Tier" },
    { field: "type", label:  "Type" },
    { field: "trv_type", label:  "TRV Type" },
    { field: "chr", label:  "chr" },
    { field: "start", label:  "Start" },
    { field: "gene", label:  "Gene" },
    { field: "amino_acid_change", label:  "Amino Acid Change" },
    { field: "reference", label:  "Reference" },
    { field: "variant", label:  "Variant" },
    { field: "strand", label:  "Strand" },
    { field: "ucsc_cons", label:  "UCSC Cons" },
    { field: "NORMAL_ALLDNA_VAF", label:  "Normal All DNA VAF" },
    { field: "TUMOR_ALLDNA_VAF", label:  "Tumor All DNA VAF" },
    { field: "RELAPSE_ALLDNA_VAF", label:  "Relapse All DNA VAF" },
    { field: "cgc_gene", label:  "CGC Gene" },
    { field: "drug", label:  "Drug" },
    { field: "drug_pathway", label:  "Drug Pathway" }
  ];

  constructor(private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.selectionService.getSelectedBlocks().subscribe(blocks => {
      this.label = blocks[0]?._props?.jsonData?.label;
      this.edgeLabel = blocks[0]?._props?.jsonData?.edge_label;
      this.detailsData = blocks[0]?._props?.jsonData?.details;
    }));
    this.subscriptions.push(this.selectionService.getPhylogenySelectedTier().subscribe(tier => {
      this.phylogenySelectedTier = tier;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  deselectTier() {
    this.selectionService.setPhylogenySelectedTier(false);
  }

  closeTable() {
    this.selectionService.setPhylogenyShowTable(false);
  }

  selectRow(data: any) {
    this.selectionService.setPhylogenySelectedTier(data.tier);
  }
}
