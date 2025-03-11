import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IProduct, ICategory } from '../../../interfaces';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  public fb: FormBuilder = inject(FormBuilder);

  @Input() form!: FormGroup;
  @Input() categorias: ICategory[] = []; // Para listar categorías en el select
  @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();


  
  callSave() {
    console.log(this.categorias);
    let item: IProduct = {
      nombre: this.form.controls['nombre'].value,
      descripcion: this.form.controls['descripcion'].value,
      precio: this.form.controls['precio'].value,
      cantidadStock: this.form.controls['cantidadStock'].value,
      categoria: this.form.controls['categoria'].value
    
    };
    
    if (this.form.controls['id'].value) {
      item.id = this.form.controls['id'].value;
    } 

    if (item.id) {
      this.callUpdateMethod.emit(item);
    } else {
      this.callSaveMethod.emit(item);
    }
  }

}
