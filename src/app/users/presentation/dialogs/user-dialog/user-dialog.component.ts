import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../services';
import { user } from '../../../infrastructure';

@Component({
  selector: 'app-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);

  data: user = inject(MAT_DIALOG_DATA);

  hidePassword: boolean = true;
  formUser: FormGroup = this.formBuilder.group({
    fullName: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', Validators.required],
    roles: ['', Validators.required],
    isActive: [true, Validators.required],
  });
  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'officer', label: 'Funcionario' },
  ];

  ngOnInit(): void {
    if (this.data) {
      this.formUser.patchValue(this.data);
      this.formUser.get('password')?.removeValidators([Validators.required]);
    }
  }

  save() {
    const subscription = this.data
      ? this.userService.update(this.data.id, this.formUser.value)
      : this.userService.create(this.formUser.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
