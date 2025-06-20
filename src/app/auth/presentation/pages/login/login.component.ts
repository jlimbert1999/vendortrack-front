import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="p-3 absolute top-0 left-0">
      <img src="images/logos/gams.png" class="h-12 sm:h-18" />
    </div>
    <div class="h-screen flex flex-col w-screen">
      <div class="flex-1 flex flex-col items-center justify-center">
        <div class="shadow-md border rounded-lg p-5 w-11/12 sm:w-[450px]">
          <div class="sm:mx-auto mb-6">
            <img class="mx-auto size-20 mb-2" src="images/icons/app.png" />
            <p class="text-center text-xl font-bold font-sans">
              Sistema de Registro y Certificación de Comerciantes
            </p>
            <p class="text-center mt-3">Inicio de sesion</p>
          </div>

          <form [formGroup]="loginForm" (submit)="login()" autocomplete="off">
            <div class="mb-2">
              <mat-form-field appearance="outline">
                <mat-label>Usuario</mat-label>
                <input
                  matInput
                  placeholder="Ingrese su usuario"
                  formControlName="login"
                />
              </mat-form-field>
            </div>
            <div class="mb-2">
              <mat-form-field appearance="outline">
                <mat-label>Contraseña</mat-label>
                <input
                  [autocomplete]="false"
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  placeholder="Ingrese su contraseña"
                  formControlName="password"
                />
                <button
                  type="button"
                  mat-icon-button
                  matSuffix
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword"
                >
                  <mat-icon>
                    {{ hidePassword ? 'visibility_off' : 'visibility' }}
                  </mat-icon>
                </button>
              </mat-form-field>
            </div>
            <div class="mb-4">
              <mat-checkbox formControlName="remember">
                Recordar nombre usuario
              </mat-checkbox>
            </div>
            <button
              type="submit"
              mat-flat-button
              class="w-full"
              [disabled]="loginForm.invalid"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  hidePassword = true;

  loginForm: FormGroup = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });

  login() {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
