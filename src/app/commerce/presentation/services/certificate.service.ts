import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { CertificateMapper, certificateResponse } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private readonly URL = `${environment.apiUrl}/certificate`;
  private http = inject(HttpClient);
  constructor() {}

  create(stallId: string, form: Object) {
    return this.http
      .post<certificateResponse>(this.URL, { ...form, stallId })
      .pipe(map((resp) => CertificateMapper.fromReponse(resp)));
  }

  getStallCertificates(stallId: string, offset: number) {
    const params = new HttpParams({ fromObject: { offset } });
    return this.http
      .get<certificateResponse[]>(`${this.URL}/history/${stallId}`, { params })
      .pipe(
        tap((resp) => console.log(resp)),
        map((resp) => resp.map((item) => CertificateMapper.fromReponse(item))),
        tap((resp) => console.log(resp))
      );
  }

  verify(id: string) {
    return this.http.get<certificateResponse>(`${this.URL}/verify/${id}`).pipe(
      map((resp) => CertificateMapper.fromReponse(resp)),
      catchError((error) => {
        // if (error instanceof HttpErrorResponse) {
        //   return of(400);
        // }
        return throwError(() => 400);
      })
    );
  }

  // private hendleVerfiicationErro(error: HttpErrorResponse) {
  //   if(error.status)
  // }
}
