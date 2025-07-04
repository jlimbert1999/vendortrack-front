import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { finalize, firstValueFrom } from 'rxjs';

import { CertificateService } from '../../services';
import { Certificate, Stall } from '../../../domain';
import { InfiniteScrollWrapperComponent, PdfService } from '../../../../shared';

@Component({
  selector: 'app-certificate-history',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    InfiniteScrollWrapperComponent,
  ],
  template: `
    <h2 mat-dialog-title>Historial de Certificados</h2>
    <mat-dialog-content>
      <div class="py-2 w-full"></div>
      @if(isLoading()){
      <div class="flex flex"></div>
      } @else { @if(certificates().length>0){
      <div class="h-[400px] overflow-y-auto" #containerRef>
        <infinite-scroll-wrapper
          [containerRef]="containerRef"
          (onScroll)="loadMore()"
        >
          <div class="flex flex-col gap-y-2">
            @for (cert of certificates(); track $index) {
            <div class="p-4 sm:flex-row flex flex-col sm:items-center justify-between border rounded-lg">
              <div class="text-gray-700">
                <p class="font-medium text-lg text-blue-600">
                  Código: {{ cert.code }}
                </p>
                <p class="text-sm text-gray-500">
                  Vigencia: {{ cert.startDate | date : 'shortDate' }} -
                  {{ cert.endDate | date : 'shortDate' }}
                </p>
                <p class="text-sm text-gray-500">
                  Método de pago: {{ cert.paymentMethodLabel | uppercase }}
                </p>
              </div>

              <div class="mt-3 sm:mt-0 sm:ml-6 flex gap-2">
                <button
                  (click)="print(cert)"
                  class="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  🖨️ Reimprimir
                </button>
              </div>
            </div>
          }
          </div>
        </infinite-scroll-wrapper>
      </div>
      } @else {
      <div class="p-4">SIN CERTIFICADOS</div>
      } }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="warn">Cerrar</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateHistoryComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private pdfService = inject(PdfService);

  data: Stall = inject(MAT_DIALOG_DATA);
  offset = signal<number>(0);

  certificates = signal<Certificate[]>([]);
  isLoading = signal(false);

  constructor() {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.isLoading.set(true);
    this.certificateService
      .getStallCertificates(this.data.id, this.offset())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((certificates) => {
        this.certificates.update((values) => [...values, ...certificates]);
      });
  }

  loadMore() {
    if (this.isLoading()) return;
    this.offset.update((value) => (value += 10));
    this.getData();
  }

  print(cert: Certificate) {
    this.pdfService.generate(cert).subscribe();
  }
}
