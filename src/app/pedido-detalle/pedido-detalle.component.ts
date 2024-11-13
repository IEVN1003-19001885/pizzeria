import { Component} from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './pedido-detalle.component.html',
  styleUrl: './pedido-detalle.component.css'
})
export class PedidoDetalleComponent {
  pedidos: any[] = [];

  constructor(private pizzeriaService: PedidosService) {}

  ngOnInit() {
    // Se suscribe al servicio para recibir los pedidos cuando se actualicen
    this.pizzeriaService.pedios$.subscribe((pedidos) => {
      this.pedidos = pedidos.filter(
        (pedidos) => pedidos && Object.keys(pedidos).length > 0
      );
    });
  }

  // Método para eliminar un pedido
  eliminarPedido(pedido: any) {
    this.pizzeriaService.eliminarPedido(pedido); // Llama al servicio para eliminar el pedido
  }

  // Método para completar la orden
  terminarPedido() {
    this.pizzeriaService.terminarPedido();
  }

  // Método para calcular el total de los subtotales
  calcularTotal(): number {
    return this.pedidos.reduce((total, pedido) => total + pedido.precio, 0);
  }
}