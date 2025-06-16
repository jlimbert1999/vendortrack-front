import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { StallService } from '../../services';
import {
  CertificateHistoryComponent,
  GenerateCertificateDialogComponent,
  StallDialogComponent,
} from '../../dialogs';
import { Stall } from '../../../domain';
@Component({
  selector: 'app-stalls',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTableModule,
  ],
  template: `
    <mat-toolbar>
      <span>Puestos</span>
      <div class="flex-1"></div>
      <div>
        <button mat-flat-button (click)="create()">
          <mat-icon>add</mat-icon>
          Agregar
        </button>
      </div>
    </mat-toolbar>
    <table mat-table [dataSource]="dataSource()">
      <ng-container matColumnDef="market">
        <th mat-header-cell *matHeaderCellDef>Mercado</th>
        <td mat-cell *matCellDef="let element">
          {{ element.market.name }}
        </td>
      </ng-container>

      <ng-container matColumnDef="number">
        <th mat-header-cell *matHeaderCellDef>Numero</th>
        <td mat-cell *matCellDef="let element">
          {{ element.number }}
        </td>
      </ng-container>

      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef>Categoria</th>
        <td mat-cell *matCellDef="let element">
          {{ element.category.name }}
        </td>
      </ng-container>

      <ng-container matColumnDef="location">
        <th mat-header-cell *matHeaderCellDef>Ubicacion</th>
        <td mat-cell *matCellDef="let element">
          {{ element.location }}
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
            <button mat-menu-item (click)="generateCertificate(item)">
              <mat-icon>health_and_safety</mat-icon>
              <span>Generar Certificado</span>
            </button>
            <button mat-menu-item (click)="certificateHistory(item)">
              <mat-icon>health_and_safety</mat-icon>
              <span>Historial de certificados</span>
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
export default class StallsComponent {
  private dialogRef = inject(MatDialog);
  private stallService = inject(StallService);

  dataSource = signal<Stall[]>([]);
  limit = signal<number>(10);
  index = signal<number>(0);
  dataSize = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  readonly COLUMNS = ['market', 'number', 'category', 'location', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.stallService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ stalls, length }) => {
        this.dataSource.set(stalls);
        this.dataSize.set(length);
      });
  }

  create(): void {
    const dialogRef = this.dialogRef.open(StallDialogComponent, {
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
    const dialogRef = this.dialogRef.open(StallDialogComponent, {
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

  certificateHistory(item: Stall) {
    this.dialogRef.open(CertificateHistoryComponent, {
      width: '800px',
      maxWidth: '800px',
      data: item,
    });
  }

  async generateCertificate(item: any) {
    const dialogRef = this.dialogRef.open(GenerateCertificateDialogComponent, {
      width: '800px',
      maxWidth: '800px',
      data: item,
    });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.limit.set(pageSize);
    this.index.set(pageIndex);
    this.getData();
  }
}
