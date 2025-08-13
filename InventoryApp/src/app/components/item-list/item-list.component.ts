import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  displayedColumns: string[] = ['itemId', 'name', 'price', 'stockQuantity', 'actions'];
  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getAll().subscribe(items => {
      this.dataSource.data = items;
      this.dataSource.paginator = this.paginator;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadItems();
    });
  }

  openEditDialog(item: Item): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '400px',
      data: { isEdit: true, item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadItems();
    });
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.delete(id).subscribe(() => this.loadItems());
    }
  }
}