import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TraderDialogComponent } from '../../dialogs';
import { TraderService } from '../../services';

@Component({
  selector: 'app-traders',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  template: `
    <mat-toolbar>
      <span>Comerciantes</span>
      <div class="flex-1"></div>
      <div>
        <button mat-flat-button (click)="create()">
          <mat-icon>add</mat-icon>
          Agregar
        </button>
      </div>
    </mat-toolbar>
    <table mat-table [dataSource]="dataSource()">
      <ng-container matColumnDef="fullName">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let element">
          {{ element.firstName | titlecase }}    {{ element.lastNamePaternal | titlecase }}
        </td>
      </ng-container>

      <ng-container matColumnDef="dni">
        <th mat-header-cell *matHeaderCellDef>CI</th>
        <td mat-cell *matCellDef="let element">
          {{ element.dni }}
        </td>
      </ng-container>

      <ng-container matColumnDef="grantDate">
        <th mat-header-cell *matHeaderCellDef>Fecha </th>
        <td mat-cell *matCellDef="let element">
          <!-- {{ element.breed.species }} - {{ element.breed.name }} -->
        </td>
      </ng-container>

      <ng-container matColumnDef="options">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item" class="w-8">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="update(item)">
              <mat-icon>edit</mat-icon>
              <span>Editar</span>
            </button>
            <button mat-menu-item>
              <mat-icon>health_and_safety</mat-icon>
              <span>Historial de capturas</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="COLUMNS"></tr>
      <tr mat-row *matRowDef="let row; columns: COLUMNS"></tr>
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell p-3" colspan="4">No se encontraron resultados</td>
      </tr>
    </table>
    <mat-paginator
      aria-label="Select page of users search results"
      showFirstLastButtons
      [length]="dataSize()"
      [pageIndex]="index()"
      [pageSize]="10"
      (page)="onPageChange($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TradersComponent implements OnInit {
  private dialogRef = inject(MatDialog);
  private traderService = inject(TraderService);

  dataSource = signal<any[]>([]);
  limit = signal<number>(10);
  index = signal<number>(0);
  dataSize = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  readonly COLUMNS = ['fullName', 'dni', 'grantDate', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.traderService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ traders, length }) => {
        this.dataSource.set(traders);
        this.dataSize.set(length);
        console.log(traders);
      });
  }

  create(): void {
    const dialogRef = this.dialogRef.open(TraderDialogComponent, {
      width: '800px',
      maxWidth: '800px',
    });
    dialogRef.afterClosed().subscribe((result?) => {
      if (!result) return;
      // this.dataSource.update((values) => {
      //   if (values.length === this.limit()) {
      //     values.pop();
      //   }
      //   return [result, ...values];
      // });
      // this.datasize.update((value) => (value += 1));
      // this.treatments(result);
    });
  }

  update(element: any) {
    const dialogRef = this.dialogRef.open(TraderDialogComponent, {
      width: '800px',
      maxWidth: '800px',
      data: element,
    });
    // dialogRef.afterClosed().subscribe((result: datasource) => {
    //   if (!result) return;
    //   this.datasource.update((values) => {
    //     const index = values.findIndex((el) => el.owner.id === result.owner.id);
    //     values[index] = result;
    //     return [...values];
    //   });
    // });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.limit.set(pageSize);
    this.index.set(pageIndex);
    this.getData();
  }
}
