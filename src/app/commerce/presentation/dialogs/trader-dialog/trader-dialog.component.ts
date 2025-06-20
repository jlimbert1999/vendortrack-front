import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { TraderService } from '../../services';
import { Trader } from '../../../domain';

@Component({
  selector: 'app-trader-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    SecureImageUploaderComponent,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Crear' }} Comerciante</h2>
    <mat-dialog-content>
      <form [formGroup]="traderForm" class="mt-2">
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
              <mat-label>Apellido de casada</mat-label>
              <input matInput formControlName="apellidoCasada" />
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
              <mat-label>Direccion</mat-label>
              <input matInput formControlName="address" />
            </mat-form-field>
          </div>
        </div>
      </form>
      <div class="flex justify-center w-full">
        <div class="w-full sm:w-[350px]">
          <secure-image-uploader
            label="Seleccionar foto"
            [(file)]="image"
            [(uploadedImage)]="this.currentFileUrl"
          />
        </div>
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

  data: Trader | undefined = inject(MAT_DIALOG_DATA);

  traderForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastNamePaternal: ['', Validators.required],
    lastNameMaternal: [''],
    apellidoCasada: [''],
    dni: ['', Validators.required],
    address: [''],
    phone: [''],
    grantDate: ['', Validators.required],
  });

  image = signal<File | null>(null);
  currentFileUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFormData();
  }

  save(): void {
    const subscription = this.buildFileUploadTask().pipe(
      switchMap((photo) => {
        if (!this.data) {
          return this.traderService.create(this.traderForm.value, photo);
        }
        return this.traderService.update(
          this.data.id,
          this.traderForm.value,
          photo ?? this.currentFileUrl()?.split('/').pop() ?? null
        );
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
    this.traderForm.patchValue(this.data ?? {});
    this.currentFileUrl.set(this.data.photo);
  }
}
