import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private pedidosSubject = new BehaviorSubject<any[]>([]);
  pedios$ = this.pedidosSubject.asObservable();

  constructor() {
    this.pedidosSubject.next([]);
  }

  obtenerPedidos() {
    return JSON.parse(localStorage.getItem('pedidos') || '[]');
  }

  agregarPedido(nuevoPedido: any) {
    const pedidosActuales = this.pedidosSubject.value;
    const pedidoExistente = pedidosActuales.find(
      (pedido) =>
        pedido.name === nuevoPedido.name &&
        pedido.direccion === nuevoPedido.direccion &&
        pedido.pizzaSize === nuevoPedido.pizzaSize &&
        this.compararIngredientes(pedido.ingredientes, nuevoPedido.ingredientes)
    );

    if (pedidoExistente) {
      pedidoExistente.cantidad += nuevoPedido.cantidad;
      pedidoExistente.precio += nuevoPedido.precio;
    } else {
      pedidosActuales.push(nuevoPedido);
    }

    this.pedidosSubject.next([...pedidosActuales]);
  }

  eliminarPedido(pedido: any) {
    const pedidosActuales = this.pedidosSubject.value.filter(
      (p) => p !== pedido
    );
    this.pedidosSubject.next(pedidosActuales);
  }

  terminarPedido() {
    const pedidos = this.pedidosSubject.value;
    const total = pedidos.reduce((sum, pedido) => sum + pedido.precio, 0);

    if (confirm(`El total del pedido es $${total}. ¿Desea completar el pedido?`)) {
      
      const fecha = new Date(pedidos[0].fecha);
      const fechaUTC = new Date(
        fecha.getTime() + fecha.getTimezoneOffset() * 60000
      );
      const diasSemana = [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
      ];
      const diaSemana = diasSemana[fechaUTC.getUTCDay()];

      const detallesPedido = pedidos.map(pedido => ({
        cliente: pedido.name,
        direccion: pedido.direccion,
        telefono: pedido.telefono,
        pizza: pedido.pizzaSize,
        cantidad: pedido.cantidad,
        subtotal: pedido.precio,
        fecha: pedido.fecha
      }));

      const pedidoCompleto = {
        pedidos: detallesPedido,
        total: total,
        fecha: pedidos[0].fecha, // Usar la fecha del primer pedido
        diaSemana: diaSemana,
      };

      // Recuperamos los pedidos existentes desde el localStorage
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      pedidosGuardados.push(pedidoCompleto); // Añadimos el nuevo pedido como un ticket adicional
      localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));
      this.pedidosSubject.next([]); // Limpia los pedidos tras finalizar
    }
  }

  private compararIngredientes(ingredientes1: string[], ingredientes2: string[]): boolean {
    return (
      ingredientes1.length === ingredientes2.length &&
      ingredientes1.every((ing) => ingredientes2.includes(ing))
      
    );
  }

  calcularPrecio(pizzaSize: string, cantidad: number, ingredientes: string[]): number {
    let precioBase = 0;
    const costoIngrediente = 10;

    switch (pizzaSize) {
      case 'Chica':
        precioBase = 40;
        break;
      case 'Mediana':
        precioBase = 80;
        break;
      case 'Grande':
        precioBase = 120;
        break;
    }

    const costoIngredientes = ingredientes.length * costoIngrediente;
    return (precioBase + costoIngredientes) * cantidad;
  }

  obtenerVentasDia(dia: string): any[] {
    const pedidos = this.obtenerPedidos();
    const ventasDia = pedidos.filter((pedido: any) => pedido.diaSemana === dia);

    const ventasDetalladas = ventasDia.map((venta: any) => ({
      nombreCliente: venta.pedidos[0].cliente,
      total: venta.total,
    }));
    return ventasDetalladas;
  }







}
