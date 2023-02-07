import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {TableColumn} from "../../../core/interfaces/table-column.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {JournalModule} from "./journal.module";
import {FormControl} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Pagination} from "../../../core/model/pagination.model";
import {CheckModel} from "../../../core/model/check.model";
import {CheckCreateUpdateComponent} from "../check-data/check-create-update/check-create-update.component";
import {ConfirmationDialogComponent} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {MatSelectChange} from "@angular/material/select";
import {JournalService} from "../../../core/service/journal.service";
import {CommonConstants} from "../../../core/constant/CommonConstants";
import {JournalModel} from "../../../core/model/journal.model";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  subjects;

  pageSize = CommonConstants.pageSize;
  pageIndex = CommonConstants.pageIndex;
  pageSizeOptions = CommonConstants.pageSizeOptions;
  length: number;
  tabs: any;

  @Input()
  columns: TableColumn<JournalModel>[] = [
    {label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true},
    {label: 'Id', property: 'Id', type: 'text', visible: true},
    {label: 'status', property: 'status', type: 'text', visible: true},
    {label: 'officialName', property: 'officialName', type: 'text', visible: true},
    {label: 'type', property: 'type', type: 'text', visible: true},
    {label: 'description', property: 'description', type: 'text', visible: true},
    {label: 'address', property: 'address', type: 'text', visible: true},
    {label: 'numberOfStudents', property: 'numberOfStudents', type: 'text', visible: true},
    {label: 'website', property: 'website', type: 'text', visible: true},
    {label: 'email', property: 'email', type: 'text', visible: true},
    {label: 'organisationNumber', property: 'organisationNumber', type: 'text', visible: true},
  ];

  /******* SYSTEM VARIABLES *******/
  layoutCtrl = new FormControl('boxed');

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private dialog: MatDialog,
              private journalService: JournalService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.getAllCategories(null);
  }

  ngAfterViewInit() {}

  getAllCategories(searchValue: string, $event?: PageEvent) {
    const pagination = new Pagination();
    pagination.size = $event ? $event.pageSize : this.pageSize;
    pagination.page = $event ? $event.pageIndex : 0;
    if (searchValue) {
      pagination.searchString = searchValue;
    }
    this.journalService.getAllCategoriesPageable(pagination).subscribe(res => {
      this.dataSource.data = res.content;
      this.pageIndex = res.page;
      this.pageSize = res.size;
      this.length = res.total;
    });
  }

  saveCategory(journalModel?: JournalModel) {
    this.dialog.open(CheckCreateUpdateComponent, {
      data: {
        categoryModel: journalModel ? journalModel : null,
        all: this.dataSource.data,
        tabs: this.tabs
      }
    }).afterClosed().subscribe((category: JournalModel) => {
      if (category) {
        this.getAllCategories(null);
      }
    });
  }

  deleteCategory(journalModel: JournalModel) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        text: 'Are you sure to delete category '
            + journalModel.Id + '?'
      }
    }).afterClosed().subscribe(res => {
      if (res && res === 'OK') {
        this.delete(journalModel);
      }
    });
  }

  delete(journalModel: JournalModel) {
    this.journalService.deleteCategory(journalModel.Id).subscribe(res => {
      console.log('Category has been deleted successfully: ' + res);
    }, error => {
      console.log('There is an error with deletion: ' + error);
    });
    this.dataSource.data.splice(this.dataSource.data.indexOf(journalModel), 1);
    this.dataSource.data = [...this.dataSource.data];
    this.selection.deselect(journalModel);

  }

  deleteItems(journalModels: JournalModel[]) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        text: 'You want to delete selected categories?'
      }
    }).afterClosed().subscribe(res => {
      if (res && res === 'OK') {
        journalModels.forEach(c => this.delete(c));
      }
    });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: CheckModel) {
    // const index = this.categoryModels.findIndex(c => c === row);
    // this.categoryModels[index].id = change.value;
    // this.subject$.next(this.categoryModels);
  }
}
