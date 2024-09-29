import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css'],
})
export class BtnMyLocationComponent {
  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  goToMyLocation() {
    if (!this.placesService.isUserLocatioReady)
      throw Error('No hay ubicación del usuario');
    if (!this.mapService.isMapReady) throw Error('No hay mapa disponible');
    this.mapService.flyTo(this.placesService.userLocation!);
  }

  goToMyComunitySchool() {
    const schoolLocation: [number, number] = [-72.2749325, 11.3632056];
    if (!this.mapService.isMapReady) throw Error('No hay mapa disponible');
    this.mapService.flyTo(schoolLocation);
  }
}
