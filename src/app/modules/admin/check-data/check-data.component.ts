import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {TableColumn} from "../../../core/interfaces/table-column.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {FormControl} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {CheckCreateUpdateComponent} from "./check-create-update/check-create-update.component";
import {MatSelectChange} from "@angular/material/select";
import {CheckService} from "../../../core/service/check.service";
import {CheckModel} from "../../../core/model/check.model";
import {ConfirmationDialogComponent} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {CommonConstants} from "../../../core/constant/CommonConstants";
import {Pagination} from "../../../core/model/pagination.model";

@Component({
  selector: 'app-check-data',
  templateUrl: './check-data.component.html',
  styleUrls: ['./check-data.component.scss']
})
export class CheckDataComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  subjects;

  pageSize = CommonConstants.pageSize;
  pageIndex = CommonConstants.pageIndex;
  pageSizeOptions = CommonConstants.pageSizeOptions;
  length: number;
  tabs: any;

  @Input()
  columns: TableColumn<CheckModel>[] = [
    {label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true},
    {label: 'name', property: 'name', type: 'text', visible: true},
    {label: 'acronym', property: 'acronym', type: 'text', visible: true},
    {label: 'description', property: 'description', type: 'text', visible: true},
    {label: 'contactEmail', property: 'contactEmail', type: 'text', visible: true},
    {label: 'contactName', property: 'contactName', type: 'text', visible: true},
    {label: 'totalBudget', property: 'totalBudget', type: 'text', visible: true},
    {label: 'totalFunding', property: 'totalFunding', type: 'text', visible: true},
    {label: 'fundingValue', property: 'fundingValue', type: 'text', visible: true},
    {label: 'percentageOfFunding', property: 'percentageOfFunding', type: 'text', visible: true},
    {label: 'percentageOfIndirectCosts', property: 'percentageOfIndirectCosts', type: 'text', visible: true},
    {label: 'percentageOfIndirectCostsForEun', property: 'percentageOfIndirectCostsForEun', type: 'text', visible: true},
    {label: 'fundingExtraComment', property: 'fundingExtraComment', type: 'text', visible: true},
    // {label: 'Actions', property: 'actions', type: 'button', visible: true}
  ];

  /******* SYSTEM VARIABLES *******/
  layoutCtrl = new FormControl('boxed');

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private dialog: MatDialog,
              private checkService: CheckService) {
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
    this.checkService.getAllCategoriesPageable(pagination).subscribe(res => {
      this.dataSource.data = res.content;
      this.pageIndex = res.page;
      this.pageSize = res.size;
      this.length = res.total;
    });
  }

  saveCategory(categoryModel?: CheckModel) {
    this.dialog.open(CheckCreateUpdateComponent, {
      data: {
        categoryModel: categoryModel ? categoryModel : null,
        all: this.dataSource.data,
        tabs: this.tabs
      }
    }).afterClosed().subscribe((category: CheckModel) => {
      if (category) {
        this.getAllCategories(null);
      }
    });
  }

  deleteCategory(categoryModel: CheckModel) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        text: 'Are you sure to delete category '
            + categoryModel.id + '?'
      }
    }).afterClosed().subscribe(res => {
      if (res && res === 'OK') {
        this.delete(categoryModel);
      }
    });
  }

  delete(categoryModel: CheckModel) {
    this.checkService.deleteCategory(categoryModel.id).subscribe(res => {
      console.log('Category has been deleted successfully: ' + res);
    }, error => {
      console.log('There is an error with deletion: ' + error);
    });
    this.dataSource.data.splice(this.dataSource.data.indexOf(categoryModel), 1);
    this.dataSource.data = [...this.dataSource.data];
    this.selection.deselect(categoryModel);

  }

  deleteItems(categoryModel: CheckModel[]) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        text: 'You want to delete selected categories?'
      }
    }).afterClosed().subscribe(res => {
      if (res && res === 'OK') {
        categoryModel.forEach(c => this.delete(c));
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
