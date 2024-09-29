import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PlacesService } from '../../services';
import { Map, Marker, Popup } from 'mapbox-gl';
import { MapService } from '../../services/map.service';
import { geojson } from '../../interfaces/school-classrooms';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  ngAfterViewInit(): void {
    if (!this.placesService.userLocation)
      throw Error('No hay placesService.userLocation');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      // style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
      // style: 'mapbox://styles/mapbox/streets-v12',
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-72.2749325, 11.3632056], // starting position [lng, lat]
      zoom: 18, // starting zoom
    });

    const popup = new Popup().setHTML(`
        <h6>Aquí estoy</h6>
        <span>Puedes ir al colegio de Taloulumana al dar clik al botón de la derecha</span>
        `);

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

    geojson.features.forEach((feature: any) => {
      const coordinates = feature.geometry.coordinates;
      const properties = feature.properties;

      const markerElement = document.createElement('div');
      markerElement.className = 'animated-marker';

      const popupContent = `
  <div style="text-align: center; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.3); max-width: 500px; width: 100%;">
    <h4 style="margin: 0; font-size: 18px;">${properties.title}</h4>
    ${
      properties.image
        ? `<img src="${properties.image}" alt="${properties.title}" style="width: 100%; max-height: 400px; border-radius: 10px; margin-top: 10px;">`
        : ''
    }
    ${
      properties.docente
        ? `<p style="font-size: 14px; margin: 10px 0;"><strong>Docente:</strong> ${properties.docente}</p>`
        : ''
    }
    ${
      properties.materia
        ? `<p style="font-size: 14px; margin: 10px 0;"><strong>Materia:</strong> ${properties.materia}</p>`
        : ''
    }
    ${
      properties.horario
        ? `<p style="font-size: 14px; margin: 10px 0;"><strong>Horario:</strong> ${properties.horario}</p>`
        : ''
    }
  </div>
`;
      const popup = new Popup().setHTML(popupContent);

      let iconSrc; // Esta variable contendrá la ruta del ícono a usar
      switch (properties.iconType) {
        case 'classroom':
          iconSrc = '../../../../assets/salon-de-clases.png';
          break;
        case 'safe_zone':
          iconSrc = '../../../../assets/zona-segura.png';
          break;
        case 'unsafe_zone':
          iconSrc = '../../../../assets/advertencia.png';
          break;
        case 'zone_green':
          iconSrc = '../../../../assets/parque.png';
          break;
        case 'baños':
          iconSrc = '../../../../assets/bano-publico.png';
          break;
        case 'biblioteca':
          iconSrc = '../../../../assets/libreria-digital.png';
          break;
        case 'comedor':
          iconSrc = '../../../../assets/comedor.png';
          break;
        case 'enramada':
          iconSrc = '../../../../assets/choza.png';
          break;
      }

      const customMarker = new Image(35, 35); // Puedes ajustar el tamaño aquí
      customMarker.src = iconSrc ?? '';
      markerElement.appendChild(customMarker);

      new Marker({ element: markerElement })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);
    });

    this.mapService.setMap(map);
  }
}
