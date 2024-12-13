import {
  Component,
  OnInit
} from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { MapComponent } from '../../components/map/map.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfirmacionService } from '../../services/confirmacion.service';
import { HeaderComponent } from 'src/app/header/header.component';

@Component({
  selector: 'app-solicitar-vehiculo',
  templateUrl: './solicitar-vehiculo.component.html',
  styleUrls: ['./solicitar-vehiculo.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, MapComponent, HeaderComponent],
})
export class SolicitarVehiculoComponent implements OnInit {
  vehiculoData = {
    userId: '', // Este campo lo vamos a obtener del servicio de autenticación
    origin: '',
    destination: '',
    cargoDetails: '',
    weight: null,
    status: 'pending', // Estado por defecto
  };

  originSuggestions: any[] = [];
  destinationSuggestions: any[] = [];
  isMapVisible = false;  // Controla la visibilidad del mapa

  private readonly originInput$ = new Subject<string>();  // Stream de entrada para origen
  private readonly destinationInput$ = new Subject<string>();  // Stream de entrada para destino

  constructor(
    private readonly vehiculoService: VehiculoService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly loadingController: LoadingController,
    private readonly confirmacionService: ConfirmacionService
  ) { }

  ngOnInit() {
    // Obtener el userId del token y asignarlo a vehiculoData
    const userId = this.authService.getUserId();
    if (userId) {
      this.vehiculoData.userId = userId;
    } else {
      this.vehiculoData.userId = ''; // O un valor predeterminado como 'unknown' o '0'
    }

    // Escuchar cambios en el campo de origen
    this.originInput$
      .pipe(debounceTime(1000), distinctUntilChanged())  // Esperar 300ms entre pulsaciones
      .subscribe((query) => this.getSuggestions(query, 'origin'));

    // Escuchar cambios en el campo de destino
    this.destinationInput$
      .pipe(debounceTime(1000), distinctUntilChanged())  // Esperar 300ms entre pulsaciones
      .subscribe((query) => this.getSuggestions(query, 'destination'));
  }
  // Método para manejar el autocompletado de origen
  onInputOrigin(event: any): void {
    const query = event.target.value;
    this.originInput$.next(query);
  }

  // Método para manejar el autocompletado de destino
  onInputDestination(event: any): void {
    const query = event.target.value;
    this.destinationInput$.next(query);
  }

  // Obtener sugerencias de la API de Nominatim
  private getSuggestions(query: string, type: string): void {
    if (query) {
      this.vehiculoService.obtenerSugerenciasDireccion(query).subscribe((resultados) => {
        if (type === 'origin') {
          this.originSuggestions = resultados;
        } else if (type === 'destination') {
          this.destinationSuggestions = resultados;
        }
      });
    } else {
      if (type === 'origin') {
        this.originSuggestions = [];
      } else if (type === 'destination') {
        this.destinationSuggestions = [];
      }
    }
  }

  // Seleccionar una sugerencia de origen
  selectOrigin(suggestion: any): void {
    this.vehiculoData.origin = suggestion.display_name;
    this.originSuggestions = []; // Limpiar las sugerencias
  }

  // Seleccionar una sugerencia de destino
  selectDestination(suggestion: any): void {
    this.vehiculoData.destination = suggestion.display_name;
    this.destinationSuggestions = []; // Limpiar las sugerencias
  }

  // Evento que se activa cuando el usuario sale del campo de destino
  onDestinationBlur(): void {
    console.log('Origen:', this.vehiculoData.origin);
    console.log('Destino:', this.vehiculoData.destination);
    // Verificar si ambos campos (origen y destino) están completos
    if (this.vehiculoData.origin && this.vehiculoData.destination) {
      this.isMapVisible = true;  // Hacer visible el mapa
    }
  }

  async onSubmit() {
    const loading = await this.loadingController.create({
      message: 'Enviando solicitud...',
    });
    await loading.present();

    this.vehiculoService.solicitarVehiculo(this.vehiculoData).subscribe(
      async (response) => {
        await loading.dismiss();
        // Navegar a la pantalla de confirmación con datos
        this.confirmacionService.setConfirmationData(response);
        this.router.navigate(['/home/vehiculo-confirmado']);
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error al enviar solicitud', error);
        // Manejar el error aquí (mostrar mensaje)
      }
    );
  }
}
