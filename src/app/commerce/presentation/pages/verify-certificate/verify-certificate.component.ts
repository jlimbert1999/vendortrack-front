import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  resource,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';

import { CertificateService } from '../../services';
@Component({
  selector: 'app-verify-certificate',
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl p-2 sm:p-8 sm:max-w-2xl w-11/12" >
        <div class="flex flex-col items-center mb-2">
          <img
            src="images/logos/gams-shield.png"
            alt="Institution logo"
            class="h-16 sm:h-24 mb-4"
          />
          <h1 class="text-xl sm:text-3xl font-bold text-gray-800 text-center">
            Verificación de Certificado
          </h1>
        </div>
        @if(certificate.isLoading()){
          <div class="flex justify-center mt-8">
            <mat-spinner [diameter]="150" />
          </div>
        }

        @else if(certificate.error()){
        <div class="text-center text-xl mt-6 py-4">
          <p class="mb-4">Ha ocurrido un error al verificar el certificado</p>
          <div class="bg-red-100 rounded-lg py-2 px-6 text-red-700 font-bold" >
             {{certificate.error()?.message}}
          </div>
        </div>
        } 

        @else if(certificate.hasValue()){
        <div class="space-y-2 text-center text-sm sm:text-xl">
          <div class="text-center text-xl">
            Codigo:
            <span class="font-bold">{{
              certificate.value().certificate.code
            }}</span>
          </div>
          <div>
            Valido de
            {{
              certificate.value().certificate.startDate | date : 'dd/MM/yyyy'
            }}
            a
            {{ certificate.value().certificate.endDate | date : 'dd/MM/yyyy' }}
          </div>

          @if(certificate.value().isValid){
            <div class="bg-green-100 rounded-lg py-2 px-6 text-green-700 mb-3" >
              El certificado es valido
            </div>
          }

          @else {
            <div class="bg-red-100 rounded-lg py-2 px-6 text-red-700 mb-3" >
              El certificado ha expirado
            </div>
          }
          </div>
          <div class="p-2">
            <h3 class="text-base/7 font-medium border-b border-gray-300">
              Descripcion concesionario
            </h3>
            <div class="flex flex-col sm:flex-row items-start gap-6 mt-2">
              <div class="flex justify-center w-full sm:w-[100px]">
                <img
                  alt="Trader image"
                  [src]="
                    certificate.value().certificate.trader.photo ??
                    'images/no-image.png'
                  "
                  class="size-22 rounded-lg object-cover"
                />
              </div>
              <div class="flex-1">
                <dl class="text-sm/6 space-y-1 sm:space-y-0">
                  <div class="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-gray-900">Nombre:</dt>
                    <dd class="text-gray-700 sm:col-span-2">
                      {{
                        certificate.value().certificate.trader.fullName
                          | titlecase
                      }}
                    </dd>
                  </div>
                  <div class="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-gray-900">Numero CI:</dt>
                    <dd class="text-gray-700 sm:col-span-2">
                      {{ certificate.value().certificate.trader.dni }}
                    </dd>
                  </div>
                  <div class="grid grid-cols-1 gap-1  sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-gray-900">Telefono:</dt>
                    <dd class="text-gray-700 sm:col-span-2">
                      {{ certificate.value().certificate.trader.phone }}
                    </dd>
                  </div>
                  <div class="grid grid-cols-1 gap-1  sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-gray-900">Fecha concesión:</dt>
                    <dd class="text-gray-700 sm:col-span-2">
                      {{
                        certificate.value().certificate.trader.grantDate
                          | date : 'dd/MM/yyyy'
                      }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <h3 class="text-base/7 font-medium border-b border-gray-300 mt-4">
              Descripcion puesto
            </h3>
            <div class="text-sm/6">
              <dl class="space-y-1 sm:space-y-0">
                <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-gray-900">Numero:</dt>
                  <dd class="mt-1 text-gray-700 sm:col-span-2 sm:mt-0">
                    {{ certificate.value().certificate.stall.number }}
                  </dd>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-gray-900">Área m2:</dt>
                  <dd class="mt-1  text-gray-700 sm:col-span-2 sm:mt-0">
                    {{ certificate.value().certificate.stall.area }}
                  </dd>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-gray-900">Rubro</dt>
                  <dd class="mt-1 text-gray-700 sm:col-span-2 sm:mt-0">
                    {{ certificate.value().certificate.stall.category }}
                  </dd>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-gray-900">Mercado</dt>
                  <dd class="mt-1  text-gray-700 sm:col-span-2 sm:mt-0">
                    {{ certificate.value().certificate.stall.market }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VerifyCertificateComponent{
  private certificateService = inject(CertificateService);
  id = input.required<string>();

  certificate = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) =>
      firstValueFrom(
        this.certificateService.verify(params.id).pipe(
          catchError((err) => {
            const message =
              err instanceof HttpErrorResponse
                ? this.hendleHttpError(err)
                : 'Error desconocido';
            return throwError(() => new Error(message));
          })
        )
      ),
  });

  private hendleHttpError(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404:
        return 'El certificado no existe';
      case 400:
        return 'Solicitud incorrecta';
      default:
        return 'El certificado no puede ser verificado en este momento';
    }
  }
}
