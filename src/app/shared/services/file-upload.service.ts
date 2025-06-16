import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

type fileGroup = 'trader';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly url = `${environment.apiUrl}/files`;
  constructor(private http: HttpClient) {}

  getFile(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }

  uploadFile(file: File, group: fileGroup) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileName: string }>(
      `${this.url}/${group}`,
      formData
    );
  }
}
