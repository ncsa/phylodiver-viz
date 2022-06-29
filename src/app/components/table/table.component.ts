import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateTableColumns(): void {
    const columns = [
      { label: 'Cluster', cssSuffix: 'cluster', accessor: (variant: DisplayVariant, clusterId: number) => clusterId },
      { label: 'Type', cssSuffix: 'type', accessor: (variant: DisplayVariant, clusterId: number) => 'SNP' },
      { label: 'Consequence', cssSuffix: 'consequence', accessor: (variant: DisplayVariant, clusterId: number) => variant.consequence ?? '' },
      { label: 'Severity', cssSuffix: 'severity', accessor: (variant: DisplayVariant, clusterId: number) => variant.severity?.label ?? '' },
      { label: 'chr', cssSuffix: 'chr', accessor: (variant: DisplayVariant, clusterId: number) => variant.chr ?? '' },
      { label: 'Start', cssSuffix: 'start', accessor: (variant: DisplayVariant, clusterId: number) => variant.start ?? '' },
      { label: 'Gene', cssSuffix: 'gene', accessor: (variant: DisplayVariant, clusterId: number) => variant.symbol ?? '' },
      { label: 'Amino Acid Change', cssSuffix: 'amino_acid_change', accessor: (variant: DisplayVariant, clusterId: number) => variant.amino_acid_change ?? '' },
      { label: 'Reference', cssSuffix: 'reference', accessor: (variant: DisplayVariant, clusterId: number) => variant.reference ?? '' },
      { label: 'Variant', cssSuffix: 'variant', accessor: (variant: DisplayVariant, clusterId: number) => variant.variant ?? '' },
      { label: 'Strand', cssSuffix: 'strand', accessor: (variant: DisplayVariant, clusterId: number) => variant.strand ?? '' },
    ];
    this.samples.forEach((sample, index) => {
      columns.push({ label: sample.name + ' All DNA VAF', cssSuffix: 'alldna_vaf', accessor: (variant: DisplayVariant, clusterId: number) => formatVaf(variant.vaf?.[index]) });
    });

    columns.push({ label: 'CGC Gene', cssSuffix: 'cgc_gene', accessor: (variant: DisplayVariant, clusterId: number) => variant.cgcGeneInfo ? '1' : '' });
    this.tableColumns = columns;
  }

  updateTableRows(): void {
    // clusterIds will contain the clusters whose variants we'll report
    let clusterIds: number[] = [];
    if (this.displayNode?.cluster) {
      // DisplayNode represents a cluster, so we want to aggregate the cluster variants along with all its parent cluster variants
      clusterIds = this.displayNode!.aggregateClusterIds;
    } else if (this.displayNode) {
      // DisplayNode represents a subclone, so we want to show only the next child cluster
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
}

export interface TableColumn {
  label: string;
  cssSuffix: string;
  accessor: (variant: DisplayVariant, clusterId: number) => string|number;
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