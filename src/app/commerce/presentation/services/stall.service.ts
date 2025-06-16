import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { StallMapper, stallResponde } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class StallService {
  private readonly URL = `${environment.apiUrl}/stall`;
  private http = inject(HttpClient);

  create(form: Object) {
    return this.http
      .post<any>(this.URL, { ...form })
      .pipe
      // map((resp) => ({
      //   owner: OwnerMapper.fromResponse(resp),
      //   pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
      // }))
      ();
  }

  update(traderId: string, form: Object) {
    return this.http
      .patch<any>(`${this.URL}/${traderId}`, form)
      .pipe
      // map((resp) => ({
      //   owner: OwnerMapper.fromResponse(resp),
      //   pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
      // }))
      ();
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

  searchTraders(term?: string) {
    return this.http.get<any[]>(`${this.URL}/search/traders`).pipe(
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
