import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  OnInit,
  resource,
} from '@angular/core';
import { CertificateService } from '../../services';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
import { Certificate } from '../../../domain';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-certificate',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <div class="flex flex-col items-center mb-6">
          <img
            src="images/logos/gams-shield.png"
            alt="Logo de la Institución"
            class="h-24 mb-6"
          />
          <h1 class="text-3xl font-bold text-gray-800 text-center">
            Verificación de Certificado
          </h1>
        </div>

        <div
          class="bg-green-100 rounded-lg py-5 px-6 mb-4 text-base text-green-700 mb-3"
          role="alert"
        >
          A simple success alert - check it out!
        </div>

        <div
          class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8"
        >
          <div class="flex-shrink-0">
            <img
              src="url-de-la-foto-del-usuario.jpg"
              alt="Foto del Usuario"
              class="w-32 h-32 rounded-full object-cover shadow-md border-4 border-blue-500"
            />
          </div>
          <div class="text-center md:text-left">
            <p class="text-lg font-semibold text-gray-700">
              Nombre del Titular:
            </p>
            <p class="text-2xl font-bold text-gray-900 mb-2">
              Juan Pérez García
            </p>
            <p class="text-lg text-gray-600">
              ID del Certificado:
              <span class="font-medium text-gray-800">ABC-123-XYZ-456</span>
            </p>
            <p class="text-lg text-gray-600">
              Documento de Identidad:
              <span class="font-medium text-gray-800">12345678-9</span>
            </p>
          </div>
        </div>

        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <p class="text-lg font-semibold text-gray-700">
              Tipo de Certificado:
            </p>
            <p class="text-xl text-gray-900">
              Curso de Desarrollo Web Avanzado
            </p>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-700">Fecha de Emisión:</p>
            <p class="text-xl text-gray-900">15 de Junio de 2025</p>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-700">
              Institución Emisora:
            </p>
            <p class="text-xl text-gray-900">Academia de Programación</p>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-700">Duración / Horas:</p>
            <p class="text-xl text-gray-900">120 horas</p>
          </div>
        </div> -->
        @if(certificate.error()){
        <p>hay errro</p>
        <pre> Cauase: {{ certificate.error()?.cause | json }} </pre>

        <pre> Messae: {{ certificate.error()?.message | json }} </pre>

        <pre> Name: {{ certificate.error()?.name | json }} </pre>
        <pre> Stack: {{ certificate.error()?.stack | json }}</pre>
        }

        <!-- <div class="mt-6 p-4 rounded-lg text-center">
          <p class="text-xl font-bold" *ngIf="certificadoValido">
            <i class="fas fa-check-circle mr-2"></i> ¡Certificado Válido!
          </p>
          <p class="text-xl font-bold" *ngIf="!certificadoValido">
            <i class="fas fa-times-circle mr-2"></i> Certificado Inválido o No
            Encontrado
          </p>
          <p class="text-md mt-2" *ngIf="certificadoValido">
            Este certificado ha sido emitido y verificado correctamente por
            nuestra institución.
          </p>
          <p class="text-md mt-2" *ngIf="!certificadoValido">
            Si cree que esto es un error, por favor contacte a soporte.
          </p>
        </div>

        <div class="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Gobierno Autonomo Municipal de Sacaba</p>
        </div> -->
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VerifyCertificateComponent implements OnInit {
  private certificateService = inject(CertificateService);
  id = input.required<string>();

  certificate = resource({
    // Define a reactive computation.
    // The params value recomputes whenever any read signals change.
    params: () => ({ id: this.id() }),
    // Define an async loader that retrieves data.
    // The resource calls this function every time the `params` value changes.
    loader: ({ params }) =>
      firstValueFrom(this.certificateService.verify(params.id)),
  });

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
}
