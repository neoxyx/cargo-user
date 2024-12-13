import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  template: `<div id="map" style="height: 400px;"></div>`,
  standalone: true
})
export class MapComponent implements AfterViewInit {
  @Input() origin!: string;
  @Input() destination!: string;

  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    // Inicializa el mapa centrado en una ubicación predeterminada
    this.map = L.map('map').setView([4.60971, -74.08175], 13); // Bogotá como predeterminado

    // Añade capas de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    if (this.origin && this.destination) {
      this.plotRoute();
    }
  }

  private async plotRoute(): Promise<void> {
    try {
      // Convertir las direcciones a coordenadas usando un servicio de geocodificación
      const [originCoords, destinationCoords] = await Promise.all([
        this.geocodeAddress(this.origin),
        this.geocodeAddress(this.destination),
      ]);

      // Añade marcadores para origen y destino
      L.marker(originCoords).addTo(this.map).bindPopup('Origen').openPopup();
      L.marker(destinationCoords).addTo(this.map).bindPopup('Destino').openPopup();

      // Centra el mapa en el trayecto
      this.map.fitBounds([originCoords, destinationCoords]);

      // Traza la ruta
      const route = L.polyline([originCoords, destinationCoords], { color: 'blue' });
      route.addTo(this.map);
    } catch (error) {
      console.error('Error al trazar la ruta:', error);
    }
  }

  private async geocodeAddress(address: string): Promise<[number, number]> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const results = await response.json();
    if (results.length > 0) {
      return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
    } else {
      throw new Error(`No se encontró la dirección: ${address}`);
    }
  }
}
