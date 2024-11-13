import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cliente-datos',
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cliente-datos.component.html',
  styleUrls: ['./cliente-datos.component.css']  // Cambiado a styleUrls
})
export class ClienteDatosComponent implements OnInit {
  ventasForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pizzeriaService: PedidosService
  ) {
    this.ventasForm = this.fb.group({
      name: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      pizzaSize: ['Chica', Validators.required],  // Ajusta aquí si es necesario
      ingredientes: this.fb.group({
        jamon: [false],
        pina: [false],
        champinones: [false],
      }),
      cantidad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      fecha: ['', Validators.required]
    });

    this.ventasForm.updateValueAndValidity(); // Asegura la validación completa
  }

  ngOnInit(): void {
    this.ventasForm.updateValueAndValidity();
  }

  agregarPedido(): void {
    if (this.ventasForm.valid) {
      const formData = this.ventasForm.value;
      const nuevoPedido = {
        name: formData.name,
        direccion: formData.direccion,
        pizzaSize: formData.pizzaSize,
        cantidad: Number(formData.cantidad),
        ingredientes: this.obtenerIngredientesSeleccionados(formData.ingredientes),
        fecha: formData.fecha,
        precio: this.pizzeriaService.calcularPrecio(
          formData.pizzaSize,
          Number(formData.cantidad),
          this.obtenerIngredientesSeleccionados(formData.ingredientes)
        ),
      };
      this.pizzeriaService.agregarPedido(nuevoPedido);
    } else {
      console.error('El formulario es inválido');
      // Desglosar los errores de cada control
      Object.keys(this.ventasForm.controls).forEach(key => {
        const controlErrors = this.ventasForm.get(key)?.errors;
        if (controlErrors != null) {
          console.log(`Error en el control ${key}:`, controlErrors);
        }
      });
    }
  }
  obtenerIngredientesSeleccionados(ingredientes: any): string[] {
    const ingredientesSeleccionados = [];
    if (ingredientes.jamon) ingredientesSeleccionados.push('Jamon');
    if (ingredientes.pina) ingredientesSeleccionados.push('Pina');
    if (ingredientes.champinones) ingredientesSeleccionados.push('Champiñones');
    return ingredientesSeleccionados;
  }
}
