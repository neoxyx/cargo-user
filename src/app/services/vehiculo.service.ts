import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private apiUrl = environment.apiUrlCargoRequest;
  private apiUrlDir = environment.apiUrlNominatim;

  constructor(private http: HttpClient) { }

  // Método para enviar la solicitud de vehículo
  solicitarVehiculo(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Método para obtener sugerencias de dirección desde Nominatim
  obtenerSugerenciasDireccion(query: string): Observable<any[]> {
    const url = `${this.apiUrlDir}${encodeURIComponent(query)}`;
    return this.http.get<any[]>(url);
  }
}
