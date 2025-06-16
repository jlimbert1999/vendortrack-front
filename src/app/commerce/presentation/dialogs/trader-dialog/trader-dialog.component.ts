import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, of, switchMap } from 'rxjs';
import {
  FileUploadService,
  SecureImageUploaderComponent,
} from '../../../../shared';
import { TraderService } from '../../services/trader.service';

@Component({
  selector: 'app-trader-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    SecureImageUploaderComponent,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Crear' }} Comerciante</h2>
    <mat-dialog-content>
      <div class="py-2">
        <form [formGroup]="traderForm">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
            <div>
              <mat-form-field>
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="firstName" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Apellido Paterno</mat-label>
                <input matInput formControlName="lastNamePaternal" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Apellido Materno</mat-label>
                <input matInput formControlName="lastNameMaternal" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>CI</mat-label>
                <input matInput formControlName="dni" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Telefono</mat-label>
                <input matInput formControlName="phone" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Fecha concesion</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  formControlName="grantDate"
                />
                <mat-datepicker-toggle
                  matIconSuffix
                  [for]="picker"
                ></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
            </div>
            <div class="sm:col-span-2">
              <mat-form-field>
                <mat-label>Direcion</mat-label>
                <input matInput formControlName="address" />
              </mat-form-field>
            </div>
          </div>
          <div class="mt-4">
            <secure-image-uploader
              label="Fotografia Comerciante"
              [(file)]="image"
              [uploadedImage]="data?.photo"
            />
          </div>
        </form>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="warn">Cancelar</button>
      <button mat-flat-button (click)="save()" [disabled]="traderForm.invalid">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraderDialogComponent implements OnInit {
  private fileUploadService = inject(FileUploadService);
  private traderService = inject(TraderService);
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);

  data = inject(MAT_DIALOG_DATA);

  traderForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastNamePaternal: ['', Validators.required],
    lastNameMaternal: [''],
    dni: ['', Validators.required],
    address: [''],
    phone: [''],
    grantDate: ['', Validators.required],
  });

  image = signal<File | null>(null);

  ngOnInit(): void {
    this.loadFormData();
  }

  save(): void {
    const subscription = this.buildFileUploadTask().pipe(
      switchMap((uploadedImageName) => {
        return this.data
          ? this.traderService.update(this.data.id, this.traderForm.value)
          : this.traderService.create(this.traderForm.value, uploadedImageName);
      })
    );
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  

  private buildFileUploadTask(): Observable<string | null> {
    return this.image()
      ? this.fileUploadService
          .uploadFile(this.image()!, 'trader')
          .pipe(map((file) => file.fileName))
      : of(null);
  }

  private loadFormData() {
    if (!this.data) return;
    this.traderForm.patchValue(this.data);
  }
}
