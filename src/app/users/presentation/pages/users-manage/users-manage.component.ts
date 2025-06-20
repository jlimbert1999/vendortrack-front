import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { SearchInputComponent } from '../../../../shared';
import { UserService } from '../../services/user.service';
import { UserDialogComponent } from '../../dialogs';
import { user } from '../../../infrastructure';

@Component({
  selector: 'app-users-manage',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatIconModule,
    SearchInputComponent,
  ],
  template: `
    <div class="flex px-4 py-3 items-center">
      <div class="text-2xl">Usuarios</div>
      <div class="flex-1"></div>
      <div>
        <button mat-flat-button (click)="create()">
          <mat-icon>add</mat-icon>
          Agregar
        </button>
      </div>
    </div>
    <div class="flex justify-end py-3">
      <div class="w-full px-2 sm:w-1/4 h-11">
        <search-input
          (onSearch)="search($event)"
          placeholder="Nombre de usuario"
        />
      </div>
    </div>
    <div class="px-2">
      <div class="relative mat-elevation-z8">
        <table mat-table [dataSource]="datasource()">
          <ng-container matColumnDef="login">
            <th mat-header-cell *matHeaderCellDef>Login</th>
            <td mat-cell *matCellDef="let element">{{ element.login }}</td>
          </ng-container>

          <ng-container matColumnDef="fullname">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let element">
              {{ element.fullName | titlecase }}
            </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Creacion</th>
            <td mat-cell *matCellDef="let element">
              {{ element.createdAt | date : 'short' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let element" class="w-32">
              @if (element.isActive) {
              <span
                class="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20"
                >Activo
              </span>
              } @else {
              <span
                class="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
              >
                Inactivo
              </span>
              }
            </td>
          </ng-container>

          <ng-container matColumnDef="options">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element" class="w-8">
              <button
                mat-icon-button
                aria-label="Edit user"
                (click)="update(element)"
              >
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="p-3" colspan="4">Sin resultados</td>
          </tr>
        </table>
        @if (datasize() > limit()){
        <mat-paginator
          aria-label="Select page of users search results"
          showFirstLastButtons
          [length]="datasize()"
          [pageSize]="10"
          [pageIndex]="index()"
          (page)="onPageChange($event)"
        />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersManageComponent implements OnInit {
  private userService = inject(UserService);
  readonly dialogRef = inject(MatDialog);

  datasource = signal<user[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  displayedColumns: string[] = [
    'login',
    'fullname',
    'createdAt',
    'status',
    'options',
  ];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.userService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ users, length }) => {
        this.datasource.set(users);
        this.datasize.set(length);
      });
  }

  create() {
    const dialogRef = this.dialogRef.open(UserDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => [result, ...values]);
      this.datasize.update((value) => (value += 1));
    });
  }

  update(user: user) {
    const dialogRef = this.dialogRef.open(UserDialogComponent, {
      width: '600px',
      data: user,
    });
    dialogRef.afterClosed().subscribe((result?: user) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((value) => value.id === result.id);
        values[index] = result;
        return [...values];
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this.getData();
  }

  search(term: string) {
    this.index.set(0);
    this.term.set(term);
    this.getData();
  }
}
