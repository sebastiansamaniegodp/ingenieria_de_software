import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => string; // Custom rendering function
}

export interface TableAction {
  label: string;
  icon?: string;
  class?: string;
  handler: (row: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No hay datos disponibles';

  @Output() rowClick = new EventEmitter<any>();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  onSort(column: TableColumn) {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      const valueA = this.getNestedValue(a, column.key);
      const valueB = this.getNestedValue(b, column.key);

      if (valueA === valueB) return 0;

      const comparison = valueA > valueB ? 1 : -1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
  }

  getCellValue(row: any, column: TableColumn): string {
    const value = this.getNestedValue(row, column.key);

    if (column.render) {
      return column.render(value, row);
    }

    return value !== undefined && value !== null ? String(value) : '-';
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
