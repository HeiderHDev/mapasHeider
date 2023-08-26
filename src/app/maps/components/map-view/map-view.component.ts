import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PlacesService } from '../../services';
import {Map, Marker, Popup} from 'mapbox-gl';
import { MapService } from '../../services/map.service';
import { geojson } from '../../interfaces/school-classrooms';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor( 
      private placesService: PlacesService,
      private mapService: MapService
    ) { }

  ngAfterViewInit(): void {
    if(!this.placesService.userLocation) throw Error('No hay placesService.userLocation');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14 // starting zoom
    });

    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Puedes ir al colegio de Taloulumana al dar clik al botón de la derecha</span>
        `);

    new Marker({color: 'red'})
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

      geojson.features.forEach((feature: any) => {
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties;
        
        const markerElement = document.createElement('div');
        markerElement.className = 'animated-marker';

        const popupContent = `
          <div style="text-align: center; background-color: #ffffff; padding: 10px; border-radius: 10px; box-shadow: 0px 0px 5px rgba(0,0,0,0.2);">
            <h6 style="margin: 0;">${properties.title}</h6>
            ${properties.image ? `<img src="${properties.image}" alt="${properties.title}" style="width: 100%; max-height: 150px; border-radius: 10px; margin-top: 10px;">` : ''}
            ${properties.docente ? `<p style="font-size: 12px; margin: 5px 0;"><strong>Docente:</strong> ${properties.docente}</p>` : ''}
            ${properties.materia ? `<p style="font-size: 12px; margin: 5px 0;"><strong>Materia:</strong> ${properties.materia}</p>` : ''}
            ${properties.horario ? `<p style="font-size: 12px; margin: 5px 0;"><strong>Horario:</strong> ${properties.horario}</p>` : ''}
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
        }

        const customMarker = new Image(30, 30); // Puedes ajustar el tamaño aquí
        customMarker.src = iconSrc || '';
        markerElement.appendChild(customMarker);
        
        new Marker({element: markerElement})
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);
      });

    this.mapService.setMap(map);
    
  }
  

}
