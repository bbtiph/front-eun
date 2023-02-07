import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pagination} from "../model/pagination.model";

@Injectable({
    providedIn: 'root'
})
export class CheckService {

    private readonly CATEGORY_URL = '/catalog-service/category/';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) {
    }

    getAllCategories(): Observable<any> {
        return this.http.get(this.CATEGORY_URL + `all`);
    }

    createCategory(category): Observable<any> {
        return this.http.post(this.CATEGORY_URL, category, this.httpOptions);
    }

    deleteCategory(id): Observable<any> {
        return this.http.delete(this.CATEGORY_URL + id);
    }

    deleteAllCategories(): Observable<any> {
        return this.http.delete(this.CATEGORY_URL + `delete/all`);
    }

    getCategoryById(id): Observable<any> {
        return this.http.get(this.CATEGORY_URL + id);
    }

    requestConstructor(params: Pagination) {
        let requestParams = '?';
        for (const param in params) {
            requestParams += (params[param] === '' || params[param] === null)
                ? '' : (param + '=' + params[param] + '&');
        }
        return requestParams;
    }

    getAllCategoriesPageable(params: Pagination): Observable<any> {
        return this.http.get(`cameralcontrol/api/project` + this.requestConstructor(params));
    }

    getAllCategoriesFilter(value: string) {
        return this.http.get(`${this.CATEGORY_URL}filter?params=` + value);
    }

    downloadPDF(): void {
        this.http.get('cameralcontrol/report/op_mf?id=32&output=pdf&lang=ru', {
            responseType: 'blob'
        }).subscribe((response) => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(response);
            a.download = "sample_country_impact_report_spain";
            // start download
            a.click();
        });
    }

}
