import { Injectable } from '@angular/core';
import { ADD_PRODUCT, BASE_URL, DELETE_PRODUCT, GET_ALL_PRODUCT, GET_PRODUCT, LOGIN } from '../shared/const';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login, Product } from '../shared/userModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllProduct(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${BASE_URL}${GET_ALL_PRODUCT}${pageNumber}/${pageSize}`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${BASE_URL}${ADD_PRODUCT}`, product);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${BASE_URL}${GET_PRODUCT}${id}`);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}${DELETE_PRODUCT}${id}`);
  }

}
