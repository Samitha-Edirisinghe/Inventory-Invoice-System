import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit {
  invoiceForm: FormGroup;
  items: Item[] = [];
  grandTotal = 0;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private invoiceService: InvoiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.invoiceForm = this.fb.group({
      customerName: ['', Validators.required],
      invoiceDate: [new Date(), Validators.required],
      invoiceItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.itemService.getAll().subscribe(items => {
      this.items = items;
      this.addItem();
    });
  }

  get invoiceItems(): FormArray {
    return this.invoiceForm.get('invoiceItems') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }]
    });
  }

  addItem(): void {
    this.invoiceItems.push(this.createItem());
  }

  removeItem(index: number): void {
    this.invoiceItems.removeAt(index);
    this.calculateGrandTotal();
  }

  onItemChange(index: number): void {
    const itemGroup = this.invoiceItems.at(index) as FormGroup;
    const itemId = itemGroup.get('itemId')?.value;
    const selectedItem = this.items.find(i => i.itemId === itemId);
    
    if (selectedItem) {
      itemGroup.patchValue({
        unitPrice: selectedItem.price
      });
      this.calculateLineTotal(index);
    }
  }

  calculateLineTotal(index: number): void {
    const itemGroup = this.invoiceItems.at(index) as FormGroup;
    const quantity = itemGroup.get('quantity')?.value;
    const unitPrice = itemGroup.get('unitPrice')?.value;
    const total = quantity * unitPrice;
    
    itemGroup.patchValue({ total });
    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    this.grandTotal = this.invoiceItems.controls.reduce((sum, control) => 
      sum + (control.get('total')?.value || 0), 0);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const rawForm = this.invoiceForm.getRawValue();
      const invoice: Invoice = {
        customerName: rawForm.customerName,
        invoiceDate: rawForm.invoiceDate,
        grandTotal: this.grandTotal,
        invoiceItems: rawForm.invoiceItems.map((item: any) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }))
      };

      this.invoiceService.create(invoice).subscribe({
        next: () => {
          this.snackBar.open('Invoice created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/items']);
        },
        error: err => {
          this.snackBar.open(`Error: ${err.error}`, 'Close', { duration: 5000 });
        }
      });
    }
  }
}