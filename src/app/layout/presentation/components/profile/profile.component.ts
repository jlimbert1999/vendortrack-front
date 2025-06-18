import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../auth/presentation/services/auth.service';

@Component({
  selector: 'profile',
  imports: [CommonModule, MatListModule, MatIconModule],
  template: `
    <div class="py-6 px-3 pb-3 overlays">
      <div class="flex flex-col gap-y-2 items-center pb-4">
        <img
          class="h-auto rounded-full w-12"
          src="images/icons/user.png"
          alt="User image"
        />
        <span class="text-lg leading-8 mt-2">
          {{ user()?.fullName | titlecase }}
        </span>
      </div>

      <mat-action-list>
        <button mat-list-item routerLink="home" (click)="logout()">
          <mat-icon matListItemIcon>logout</mat-icon>
          <div matListItemTitle>Cerrar sesion</div>
        </button>
      </mat-action-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;
  isOpen = model.required<boolean>();

  logout() {
    this.authService.logout();
    this.isOpen.set(false);
    this.router.navigateByUrl('/login');
  }

  // get user() {
  //   return this.authService.user();
  // }
}
