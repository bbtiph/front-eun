import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {TableColumn} from "../../../core/interfaces/table-column.interface";
import {Router} from "@angular/router";
import {FuseLoadingService} from "../../../../@fuse/services/loading";
import {MatDialog} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";
import {Sort} from "@angular/material/sort";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  subjects;

  @Input()
  columns: TableColumn<any>[] = [
    {label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true},
    {label: 'BIN', property: 'bin', type: 'text', visible: true},
    {label: 'Region', property: 'region', type: 'text', visible: true},
    {label: 'Area', property: 'area', type: 'text', visible: true},
    {label: 'Organization name', property: 'orgName', type: 'text', visible: true},
    {label: 'Organization type', property: 'orgType', type: 'text', visible: true},
    {label: 'Organization form', property: 'orgForm', type: 'text', visible: true},
    {label: 'Opening date', property: 'openingDate', type: 'date', visible: true},
    {label: 'Address', property: 'address', type: 'text', visible: true},
    {label: 'Date of primary state attestations', property: 'primaryAttestationsDate', type: 'date', visible: true},
    {label: 'Results', property: 'results', type: 'text', visible: true},
    {label: 'Date of secondary state attestations', property: 'secondaryAttestationsDate', type: 'date', visible: true},
    {label: 'Results', property: 'results2', type: 'text', visible: true},
    {label: 'Date of professional control', property: 'profControlDate', type: 'date', visible: true},
    {label: 'Results of professional control', property: 'profControlResult', type: 'text', visible: true},
  ];

  /**
   * Constructor
   */
  constructor(
      private router: Router,
      private loadingService: FuseLoadingService,
      private dialog: MatDialog,
      private sanitizer: DomSanitizer
  ) {
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  sortData($event: Sort) {
    console.log($event)
  }
}
