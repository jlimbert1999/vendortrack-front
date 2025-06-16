import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { switchMap } from 'rxjs';

import { CertificateService } from '../../services';
import { PdfService } from '../../../../shared';
import { Stall } from '../../../domain';

@Component({
  selector: 'app-generate-certificate-dialog',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Generacion Certificado</h2>
    <mat-dialog-content>
      <div class="py-2">
        <article class="rounded-xl border-2 border-gray-100 bg-white">
          <div class="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
            <a href="#" class="block shrink-0">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                class="size-24 rounded-lg object-cover"
              />
            </a>

            <div>
              <h3 class="font-medium sm:text-lg">
                <a href="#" class="hover:underline">
                  Question about Livewire Rendering-3 and Alpine JS
                </a>
              </h3>

              <p class="line-clamp-2 text-sm text-gray-700">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Accusamus, accusantium temporibus iure delectus ut totam natus
                nesciunt ex? Ducimus, enim.
              </p>

              <div class="mt-2 sm:flex sm:items-center sm:gap-2">
                <div class="flex items-center gap-1 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>

                  <p class="text-xs">14 comments</p>
                </div>

                <span class="hidden sm:block" aria-hidden="true">&middot;</span>

                <p class="hidden sm:block sm:text-xs sm:text-gray-500">
                  Posted by
                  <a href="#" class="font-medium underline hover:text-gray-700">
                    John
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <strong
              class="-me-[2px] -mb-[2px] inline-flex items-center gap-1 rounded-ss-xl rounded-ee-xl bg-green-600 px-3 py-1.5 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>

              <span class="text-[10px] font-medium sm:text-xs">Solved!</span>
            </strong>
          </div>
        </article>

        <div class="flow-root">
          <dl class="-my-3 divide-y divide-gray-200 text-sm">
            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Comerciante</dt>

              <dd class="text-gray-700 sm:col-span-2">
                <!-- {{ data.trader.firstName | titlecase }}
                {{ data.trader.lastNamePaternal | titlecase }}
                {{ data.trader.lastNameMaternal | titlecase }} -->
              </dd>
            </div>

            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Fecha concesion</dt>

              <dd class="text-gray-700 sm:col-span-2">
                <!-- {{ data.trader.grantDate | date : 'shortDate' }} -->
              </dd>
            </div>

            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Numero de puesto</dt>

              <dd class="text-gray-700 sm:col-span-2">
                {{ data.number }}
              </dd>
            </div>

            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Mercado</dt>

              <dd class="text-gray-700 sm:col-span-2">
                <!-- {{ data.market.name }} -->
              </dd>
            </div>

            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Salary</dt>

              <dd class="text-gray-700 sm:col-span-2">$1,000,000+</dd>
            </div>
          </dl>
        </div>
        <form [formGroup]="certificateForm" class="mt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <mat-form-field>
                <mat-label>Codigo</mat-label>
                <input matInput formControlName="code" formControlName="code" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Meotodo de Pago</mat-label>
                <mat-select
                  [value]="paymentMethods[0]"
                  formControlName="paymentMethod"
                >
                  @for (method of paymentMethods; track $index) {
                  <mat-option [value]="method.value">
                    {{ method.label }}
                  </mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </form>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="warn">Cancelar</button>
      <button
        mat-flat-button
        [disabled]="certificateForm.invalid"
        (click)="save()"
      >
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateCertificateDialogComponent {
  private dialogRef = inject(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  private pdfService = inject(PdfService);
  private certificateService = inject(CertificateService);

  data: Stall = inject(MAT_DIALOG_DATA);

  readonly paymentMethods = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'transfer', label: 'Transferencia bancaria' },
  ];

  certificateForm = this.formBuilder.group({
    code: ['', Validators.required],
    paymentMethod: ['', Validators.required],
  });

  save() {
    this.certificateService
      .create(this.data.id, this.certificateForm.value)
      .pipe(switchMap((certiicate) => this.pdfService.generate(certiicate)))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
