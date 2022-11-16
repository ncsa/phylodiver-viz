import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';

import { DisplayNode, DisplayVariant, Severity } from 'src/app/models/models';
import { Cluster, Sample } from 'src/app/models/pipeline-dto';
import { DataService } from 'src/app/services/data.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-table',
  templateUrl: './table.component.html',
  styleUrls: ['../../styles/styles.scss', './table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  label: string|null = null;

  severity: Severity|null = null;
  displayNode: DisplayNode|null = null;

  clusterIdToCluster = new Map<number, Cluster>();
  samples: Sample[] = [];
  snvIdToDisplayVariant = new Map<number, DisplayVariant>();

  tableColumns: TableColumn[] = [];
  tableRows: TableRow[] = [];

  @ViewChild(Table) pTable: Table|null = null;

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([
        this.dataService.getSamples(),
        this.dataService.getClusterIdToCluster(),
        this.dataService.getSnvIdToDisplayVariant()
      ]).subscribe(([samples, clusterIdToCluster, snvIdToDisplayVariant]) => {
        this.samples = samples;
        this.clusterIdToCluster = clusterIdToCluster;
        this.snvIdToDisplayVariant = snvIdToDisplayVariant;
        this.updateTableColumns();
        this.updateTableRows();
    }));
    this.subscriptions.push(this.selectionService.getDisplayNode().subscribe(displayNode => {
      this.label = null;
      if (displayNode) {
        this.label = displayNode.node_name;
      }
      this.displayNode = displayNode;
      this.updateTableRows();
    }));
    this.subscriptions.push(this.selectionService.getSeverity().subscribe(severity => {
      this.severity = severity;
      this.updateTableRows();
    }));
    this.subscriptions.push(this.selectionService.query$.subscribe(query => {
      this.pTable?.filterGlobal(query, 'contains');
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateTableColumns(): void {
    const columns: Array<TableColumn> = [
      { label: 'Cluster', id: 'cluster', field: ({ variant, clusterId }) => clusterId },
      { label: 'Type', id: 'type', field: ({ variant, clusterId }) => 'SNP' },
      { label: 'Consequence', id: 'consequence', field: ({ variant, clusterId }) => variant.consequence ?? '' },
      { label: 'Severity', id: 'severity', field: ({ variant, clusterId }) => variant.severity?.label ?? '' },
      { label: 'chr', id: 'chr', field: ({ variant, clusterId }) => variant.chr ?? '' },
      { label: 'Start', id: 'start', field: ({ variant, clusterId }) => variant.start ?? '' },
      { label: 'Gene', id: 'gene', field: ({ variant, clusterId }) => variant.symbol ?? '' },
      { label: 'Amino Acid Change', id: 'amino_acid_change', field: ({ variant, clusterId }) => variant.amino_acid_change ?? '' },
      { label: 'Reference', id: 'reference', field: ({ variant, clusterId }) => variant.reference ?? '' },
      { label: 'Variant', id: 'variant', field: ({ variant, clusterId }) => variant.variant ?? '' },
      { label: 'Strand', id: 'strand', field: ({ variant, clusterId }) => variant.strand ?? '' }
    ];
    this.samples.forEach((sample, index) => {
      columns.push({ label: sample.name + ' All DNA VAF', id: 'alldna_vaf', field: ({ variant, clusterId }) => formatVaf(variant.vaf?.[index]) });
    });

    columns.push({ label: 'CGC Gene', id: 'cgc_gene', field: ({ variant, clusterId }) => {
      let returnVal = '';
      if (variant.cgcGeneInfo) {
        returnVal = 'Tier ' + (variant.cgcGeneInfo.tier !== null ? variant.cgcGeneInfo.tier : 'unknown');
      }
      return returnVal;
    }});
    columns.push({ label: 'Drugs', id: 'drugs', field: ({ variant, clusterId }) => {
      let returnVal: string;
      if (variant.drugs.length === 0) {
        returnVal = '';
      } else if (variant.drugs.length === 1) {
        returnVal = variant.drugs[0];
      } else {
        returnVal = variant.drugs.length + '';
      }
      return returnVal;
    }});
    
    // Hidden column used for global filtering
    columns.push({ id: 'extra_filter_key', hidden: true, field: ({ variant, clusterId }) => {
      return variant.drugs.join('\n');
    }});

    this.tableColumns = columns;
  }

  updateTableRows(): void {
    // clusterIds will contain the clusters whose variants we'll report
    let clusterIds: number[] = [];
    if (this.displayNode?.cluster) {
      // DisplayNode represents a subclone, so we want to aggregate the subclone cluster variants along with all its parent cluster variants
      clusterIds = this.displayNode!.aggregateClusterIds;
    } else if (this.displayNode) {
      // DisplayNode represents the edge to a cluster, so we want to show only the next child cluster
      clusterIds = this.displayNode!.children.filter(node => node.cluster).map(node => node.cluster_id!);
    }
    const rows: TableRow[] = [];
    clusterIds.forEach(clusterId => {
      const cluster = this.clusterIdToCluster.get(clusterId);
      cluster?.variants.forEach(variant => {
        const snp = this.snvIdToDisplayVariant.get(variant);
        if (snp) {
          if (this.severity === null || this.severity === snp.severity) {
            rows.push({ variant: snp, clusterId: clusterId });
          }
        } else {
          console.warn('Could not find SNP for variant ' + variant);
        }
      });
    });
    this.tableRows = rows;
  }

  deselectSeverity() {
    this.selectionService.setSeverity(null);
  }

  closeTable() {
    this.selectionService.setShowTable(false);
  }

  selectRow(row: TableRow) {
    this.selectionService.setSeverity(row.variant.severity);
  }

  customSort(event: SortEvent) {
    if (event.mode != 'multiple') return;
    const { data, multiSortMeta } = event;
    if (!data || !multiSortMeta) return;
    (event.data as TableRow[]).sort((a, b) => {
      for (const meta of multiSortMeta) {
        const column = this.tableColumns.find(col => col.id == meta.field);
        if (!column) {
          console.warn(`No TableColumn with id ${meta.field}`)
          continue;
        }
        const aVal = column.field(a);
        const bVal = column.field(b);
        if (aVal != bVal) {
          return this.compare(aVal, bVal, column.id) * meta.order;
        }
      };
      return 0;
    });
  };

  private compare(a: string | number, b: string | number, columnId: string) {
    switch (columnId) {
      case 'chr': {
        const toNumber = (c: string | number) => {
          return c == 'X' ? 23 : c == 'Y' ? 24 : Number(c);
        };
        return toNumber(a) - toNumber(b);
      }
      default:
        return a < b ? -1 : 1;
    }
  }

}

export interface TableColumn {
  label?: string;
  id: string;
  /**
   * The name and type of this `field` property was designed to match PrimeNG's implementation of global filtering. 
   * See: [Table._filter()](https://github.com/primefaces/primeng/blob/03cf823c8e2eacd8df94d87af4fdc2c824a4a998/src/app/components/table/table.ts#L1611)
   * and [ObjectUtils.resolveFieldData](https://github.com/primefaces/primeng/blob/03cf823c8e2eacd8df94d87af4fdc2c824a4a998/src/app/components/utils/objectutils.ts#L57)
   */
  field: (record: TableRow) => string|number;
  hidden?: boolean;
}

export interface TableRow {
  variant: DisplayVariant;
  clusterId: number;
}

export function formatVaf(value: number|undefined): string {
  let returnVal: string;
  if (value === undefined) {
    returnVal = '';
  } else if (value === 0) {
    returnVal = '0';
  } else {
    returnVal = value.toExponential(2);
  }
  return returnVal;
}