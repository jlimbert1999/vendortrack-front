import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { TraderMapper, traderResponse } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class TraderService {
  private readonly URL = `${environment.apiUrl}/trader`;
  private http = inject(HttpClient);

  create(form: Object, imageUploadedName: string | null) {
    return this.http
      .post<traderResponse>(this.URL, { ...form, photo: imageUploadedName })
      .pipe(map((resp) => TraderMapper.fromResponse(resp)));
  }

  update(traderId: string, form: Object, imageUploadedName: string | null) {
    console.log(imageUploadedName);
    return this.http
      .patch<traderResponse>(`${this.URL}/${traderId}`, {
        ...form,
        photo: imageUploadedName,
      })
      .pipe(map((resp) => TraderMapper.fromResponse(resp)));
  }

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ traders: traderResponse[]; length: number }>(this.URL, {
        params,
      })
      .pipe(
        map(({ traders, length }) => ({
          traders: traders.map((resp) => TraderMapper.fromResponse(resp)),
          length,
        }))
      );
  }
}
