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
import { OverlayModule } from '@angular/cdk/overlay';

import { AuthService } from '../../../../auth/presentation/services/auth.service';

@Component({
  selector: 'profile',
  imports: [CommonModule, MatListModule, MatIconModule, OverlayModule],
  template: `
    <button
      class="w-10 h-10 rounded-full bg-slate-400 text-white font-medium text-lg hover:ring-2 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Perfil"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      (click)="toggleProfile()"
    >
      {{ userInitial }}
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      (overlayOutsideClick)="isOpen.set(false)"
    >
      <div class="overlay w-full sm:w-[380px] rounded-xl">
        <div class="py-6 px-3 pb-3 overlays">
          <div class="flex flex-col gap-y-2 items-center pb-4">
            <img
              class="h-auto rounded-full w-12"
              src="images/icons/user.png"
              alt="User image"
            />
            <span class="text-lg leading-8 mt-2">
              {{ fullName }}
            </span>
          </div>

          <mat-action-list>
            <button mat-list-item routerLink="home" (click)="logout()">
              <mat-icon matListItemIcon>logout</mat-icon>
              <div matListItemTitle>Cerrar sesion</div>
            </button>
          </mat-action-list>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  fullName = this.authService.user()?.fullName || 'Usuario';
  userInitial = this.fullName.split(' ')[0].charAt(0).toUpperCase();

  isOpen = model.required<boolean>();

  logout() {
    this.authService.logout();
    this.isOpen.set(false);
    this.router.navigateByUrl('/login');
  }

  toggleProfile() {
    this.isOpen.update((value) => !value);
  }
}
