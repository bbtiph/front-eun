import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pagination} from "../model/pagination.model";

@Injectable({
    providedIn: 'root'
})
export class JournalService {

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
        return this.http.get(`/cameralcontrol/api/organization` + this.requestConstructor(params));
    }

    getAllCategoriesFilter(value: string) {
        return this.http.get(`${this.CATEGORY_URL}filter?params=` + value);
    }
}
