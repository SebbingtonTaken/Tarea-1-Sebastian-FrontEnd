import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ProductService } from "../../services/product.service";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ProductListComponent } from "../../components/product/product-list/product-list.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { ModalService } from "../../services/modal.service";
import { FormBuilder, Validators } from "@angular/forms";
import { IProduct, ICategory } from "../../interfaces";
import { ProductFormComponent } from "../../components/product/product-form/product-form.component";

@Component({
  standalone: true,
  selector: 'app-product-page',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    ProductListComponent,
    ModalComponent,
    ProductFormComponent
  ]
})
export class ProductPageComponent {
  public productService: ProductService = inject(ProductService);
  public modalService: ModalService = inject(ModalService);
  public fb: FormBuilder = inject(FormBuilder);
  @ViewChild('addProductModal') public addProductModal: any;
  public title: string = 'Lista de Productos';

  public categorias: ICategory[] = [
    { id: 1, nombre: "Cuidado Bucal", descripcion: "Productos para el cuidado dental" },
    { id: 2, nombre: "Electrónica", descripcion: "Dispositivos electrónicos" }
  ];

  public productForm = this.fb.group({
    id: [''],
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(1)]],
    cantidadStock: [0, [Validators.required, Validators.min(0)]],
    categoria: [null]
  });

  constructor() {
    this.productService.getAll();
  }

  saveProduct(item: IProduct) {
    this.productService.save(item);
    this.modalService.closeAll();
  }

  updateProduct(item: IProduct) {
    this.productService.update(item);
    this.modalService.closeAll();
  }

  callEdition(item: IProduct) {
    this.productForm.patchValue({
      id: item.id ? JSON.stringify(item.id) : '',
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      precio: item.precio || 0,
      cantidadStock: item.cantidadStock || 0,
      categoria:  null 
    });
    this.modalService.displayModal('md', this.addProductModal);
  }

  deleteProduct(item: IProduct) {
    this.productService.delete(item);
  }
}
