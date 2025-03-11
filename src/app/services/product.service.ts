import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IProduct, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<IProduct> {
  private productSignal = signal<IProduct[]>([]);
  private alertService: AlertService = inject(AlertService);
  protected override source: string = 'productos';

  get products$() {
    return this.productSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  };
  public totalItems: any = [];

  getAll() {
    this.findAllWithParams(this.search).subscribe({
      next: (response: IResponse<IProduct[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.productSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  save(item: IProduct) {
    console.log(item);
    this.add(item).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred while adding the product', 'center', 'top', ['error-snackbar']);
        console.error('Error saving product:', err);
      }
    });
  }

  update(item: IProduct) {
    this.editCustomSource('', item).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred while updating the product', 'center', 'top', ['error-snackbar']);
        console.error('Error updating product:', err);
      }
    });
  }

  delete(item: IProduct) {
    this.del(item.id).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred while deleting the product', 'center', 'top', ['error-snackbar']);
        console.error('Error deleting product:', err);
      }
    });
  }
}
