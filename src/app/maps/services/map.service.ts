import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: Map | undefined;
  private markers: Marker[] = [];

  get isMapReady(): boolean {
    return !!this.map;
  }

  constructor( private direcctionsApi: DirectionsApiClient) { }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike){
    if(!this.isMapReady) throw Error('El mapa no está inicializado');

    this.map?.flyTo({
      zoom: 18,
      center: coords
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]){
    
    if(!this.map) throw Error('El mapa no está inicializado');


    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for(const place of places){
      const [ lng, lat ] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text_es}</h6>
          <p>${place.place_name}</p>
          `)
      const newMarker = new Marker()
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(this.map);
        
      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if(places.length === 0) return;

    // Limites del mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding: 100
    });

  }

  getRouteBetweenPoints( start: [number, number], end: [number, number]){
    this.direcctionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => this.draWPolyline(resp.routes[0]));
  }

  private draWPolyline( route: Route){
    console.log({distance: route.distance / 1000, duration: route.duration / 60});

    if(!this.map) throw Error('El mapa no está inicializado');

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([ lng, lat ]);
    });


    this.map?.fitBounds(bounds,{
      padding: 200
    })

    // PolyLine LineString
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }
    // Para borrar la Polyline
    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }


    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'red',
        'line-width': 3
      }
    })

  }

}
