import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';;
import {MatDividerModule} from '@angular/material/divider';
import {CheckCreateUpdateComponent} from './check-create-update.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatSelectModule,
        MatMenuModule,
        MatDividerModule,
        FormsModule,
        TranslateModule
    ],
    declarations: [CheckCreateUpdateComponent],
    entryComponents: [CheckCreateUpdateComponent],
    exports: [CheckCreateUpdateComponent]
})
export class CheckCreateUpdateModule {

}
