import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CheckService} from "../../../../core/service/check.service";
import {CheckModel} from "../../../../core/model/check.model";

@Component({
    selector: 'vex-category-create-update',
    templateUrl: './check-create-update.component.html',
    styleUrls: ['./check-create-update.component.scss']
})
export class CheckCreateUpdateComponent implements OnInit {

    form: FormGroup;
    mode: 'create' | 'update' = 'create';
    allCategories;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<CheckCreateUpdateComponent>,
                private fb: FormBuilder,
                private checkService: CheckService) {
    }

    ngOnInit() {
        if (this.data && this.data.categoryModel) {
            this.mode = 'update';
        } else {
            this.data.categoryModel = {} as CheckModel;
        }

        this.form = this.fb.group({
            id: [this.data.categoryModel.id],
            parentId: [this.data.categoryModel.parentId],
            name: [this.data.categoryModel.name],
            categoryTabs: [this.data.categoryModel.categoryTabs]
        });
        this.getData();
    }

    save() {
        const category = this.form.value;

        this.checkService.createCategory(category).subscribe(res => {
            this.dialogRef.close(category);
        }, error => {
            console.log('Error occurred creating category :: ', error);
        });
    }

    isCreateMode() {
        return this.mode === 'create';
    }

    isUpdateMode() {
        return this.mode === 'update';
    }

    getData() {
        this.allCategories = this.data.all.filter(message =>
            this.mode === 'create' || (message.id !== this.data.categoryModel.id));
    }
}
