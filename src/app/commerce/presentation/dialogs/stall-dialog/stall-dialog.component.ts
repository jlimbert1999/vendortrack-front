import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { selectOption, SelectSearchComponent } from '../../../../shared';
import { StallService } from '../../services';

@Component({
  selector: 'app-stall-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    SelectSearchComponent,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Crear' }} Puesto</h2>
    <mat-dialog-content>
      <div class="py-2">
        <form [formGroup]="stallForm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="col-span-2">
              <select-search
                title="Seleccionar Mercado"
                [items]="markets()"
                (onSelect)="onSelect($event, 'marketId')"
                [required]="true"
              />
            </div>
            <div class="col-span-2">
              <select-search
                title="Seleccionar Categoria"
                [items]="categories()"
                (onSelect)="onSelect($event, 'categoryId')"
                [required]="true"
              />
            </div>
            <div class="col-span-2">
              <select-search
                title="Zona tibutaria"
                [items]="taxZones()"
                (onSelect)="onSelect($event, 'taxZoneId')"
                [required]="true"
              />
            </div>
            <div class="col-span-2">
              <select-search
                (onTyped)="searchTraders($event)"
                title="Seleccionar Comerciante"
                placeholderLabel="Nombre o Numero de CI"
                [items]="traders()"
                [autoFilter]="false"
                (onSelect)="onSelect($event, 'traderId')"
                [required]="true"
              />
            </div>
            <div>
              <mat-form-field>
                <mat-label>Numero Puesto</mat-label>
                <input matInput formControlName="number" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Area / m2</mat-label>
                <input matInput formControlName="area" />
              </mat-form-field>
            </div>
            <div class="col-span-2">
              <mat-form-field>
                <mat-label>Ubicacion puesto</mat-label>
                <input
                  matInput
                  formControlName="location"
                  placeholder="Ejemplo: Numero de piso"
                />
              </mat-form-field>
            </div>
          </div>
        </form>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="warn">Cancelar</button>
      <button mat-flat-button (click)="save()" [disabled]="stallForm.invalid">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StallDialogComponent {
  private formBuilder = inject(FormBuilder);
  private stallService = inject(StallService);
  private dialogRef = inject(MatDialogRef);

  data = inject(MAT_DIALOG_DATA);

  stallForm = this.formBuilder.group({
    number: ['', Validators.required],
    area: ['', Validators.required],
    location: ['', Validators.required],
    traderId: ['', Validators.required],
    marketId: ['', Validators.required],
    categoryId: ['', Validators.required],
    taxZoneId: ['', Validators.required],
  });

  traders = signal<selectOption<string>[]>([]);
  markets = toSignal(this.stallService.getMarkets(), { initialValue: [] });
  taxZones = toSignal(this.stallService.getTaxZones(), { initialValue: [] });
  categories = toSignal(this.stallService.getCategories(), {
    initialValue: [],
  });
  taxZone = ['Distrito 1 ', 'Distrito 2', 'Distrito 3'];

  save(): void {
    const subscription = this.data
      ? this.stallService.update(this.data.id, this.stallForm.value)
      : this.stallService.create(this.stallForm.value);

    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  searchTraders(term: string) {
    return this.stallService.searchTraders(term).subscribe((resp) => {
      this.traders.set(resp);
    });
  }

  onSelect(
    value: string,
    formProperty: 'traderId' | 'marketId' | 'categoryId' | 'taxZoneId'
  ) {
    this.stallForm.get(formProperty)?.setValue(value);
  }
}
