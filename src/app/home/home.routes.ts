import { Routes } from '@angular/router';
import { SolicitarVehiculoComponent } from './solicitar-vehiculo/solicitar-vehiculo.component';
import { VehiculoConfirmadoComponent } from './vehiculo-confirmado/vehiculo-confirmado.component';

export const vehiculoRoutes: Routes = [
  { path: 'solicitar-vehiculo', component: SolicitarVehiculoComponent },
  { path: 'vehiculo-confirmado', component: VehiculoConfirmadoComponent },
];
