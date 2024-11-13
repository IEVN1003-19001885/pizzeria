import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClienteDatosComponent } from './cliente-datos/cliente-datos.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { ResumenPedidoComponent } from './resumen-pedido/resumen-pedido.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClienteDatosComponent, PedidoDetalleComponent, ResumenPedidoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pizzeria';
}
