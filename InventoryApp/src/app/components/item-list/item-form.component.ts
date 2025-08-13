import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
})
export class ItemFormComponent {
  itemForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEdit;
    this.itemForm = this.fb.group({
      itemId: [data.item?.itemId || 0],
      name: [data.item?.name || '', Validators.required],
      price: [data.item?.price || 0, [Validators.required, Validators.min(0)]],
      stockQuantity: [data.item?.stockQuantity || 0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const item = this.itemForm.value;
      if (this.isEditMode) {
        this.itemService.update(item.itemId, item).subscribe({
          next: () => {
            this.snackBar.open('Item updated successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.snackBar.open(`Error: ${err.error}`, 'Close', { duration: 5000 });
          }
        });
      } else {
        this.itemService.create(item).subscribe({
          next: () => {
            this.snackBar.open('Item created successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.snackBar.open(`Error: ${err.error}`, 'Close', { duration: 5000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}