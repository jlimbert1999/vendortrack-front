import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TraderService {
  private readonly URL = `${environment.apiUrl}/trader`;
  private http = inject(HttpClient);

  create(form: Object, imageUploadedName: string | null) {
    return this.http
      .post<any>(this.URL, { ...form, photo: imageUploadedName })
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
    return this.http.get<{ traders: any[]; length: number }>(this.URL, {
      params,
    });
    // .pipe(
    //   map(({ owners, length }) => ({
    //     data: owners.map((resp) => ({
    //       owner: OwnerMapper.fromResponse(resp),
    //       pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
    //     })),
    //     length,
    //   }))
    // );
  }
}
