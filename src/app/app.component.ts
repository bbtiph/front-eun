import {Component, Inject, LOCALE_ID} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Settings} from 'luxon';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(
        public translate: TranslateService,
        @Inject(LOCALE_ID) private localeId: string)
    {
        Settings.defaultLocale = this.localeId;
        translate.addLangs(['ru', 'kz']);
        translate.setDefaultLang('ru');
    }
}
