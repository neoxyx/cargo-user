import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ConfirmacionService } from '../../services/confirmacion.service';
import { HeaderComponent } from 'src/app/header/header.component';

@Component({
  selector: 'app-vehiculo-confirmado',
  templateUrl: './vehiculo-confirmado.component.html',
  styleUrls: ['./vehiculo-confirmado.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class VehiculoConfirmadoComponent implements OnInit {
  cargoRequest: any;

  constructor(private readonly router: Router, private readonly confirmacionService: ConfirmacionService) { }

  ngOnInit() {
    this.cargoRequest = this.confirmacionService.getConfirmationData()?.cargoRequest;

    if (!this.cargoRequest) {
      // Si no hay datos, redirigir al usuario
      console.error('No confirmation data found!');
    }
  }

  solicitarVehiculo() {
    // Navegar a la pantalla de solicitud
    this.router.navigate(['/solicitar-vehiculo']);
  }

}
