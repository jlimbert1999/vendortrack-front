import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  StallMapper,
  stallResponde,
  traderResponse,
} from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class StallService {
  private readonly URL = `${environment.apiUrl}/stall`;
  private http = inject(HttpClient);

  create(form: Object) {
    return this.http
      .post<stallResponde>(this.URL, { ...form })
      .pipe(map((resp) => StallMapper.fromResponse(resp)));
  }

  update(traderId: string, form: Object) {
    return this.http
      .patch<stallResponde>(`${this.URL}/${traderId}`, form)
      .pipe(map((resp) => StallMapper.fromResponse(resp)));
  }

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ stalls: stallResponde[]; length: number }>(this.URL, {
        params,
      })
      .pipe(
        map(({ stalls, length }) => ({
          stalls: stalls.map((item) => StallMapper.fromResponse(item)),
          length,
        }))
      );
  }

  searchTraders(term: string) {
    return this.http
      .get<traderResponse[]>(`${this.URL}/search/traders/${term}`)
      .pipe(
        map((resp) =>
          resp.map((item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastNamePaternal} ${item.lastNameMaternal} - ${item.dni}`,
          }))
        )
      );
  }

  getMarkets(term?: string) {
    return this.http.get<any[]>(`${this.URL}/search/markets`).pipe(
      map((resp) =>
        resp.map((item) => ({
          value: item.id,
          label: `${item.name}`,
        }))
      )
    );
  }

  getTaxZones() {
    return this.http.get<any[]>(`${this.URL}/search/tax-zones`).pipe(
      map((resp) =>
        resp.map((item) => ({
          value: item.id,
          label: `${item.name}`,
        }))
      )
    );
  }

  getCategories(term?: string) {
    return this.http.get<any[]>(`${this.URL}/search/categories`).pipe(
      map((resp) =>
        resp.map((item) => ({
          value: item.id,
          label: `${item.name}`,
        }))
      )
    );
  }
}
