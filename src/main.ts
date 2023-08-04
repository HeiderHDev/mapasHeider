import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
Mapboxgl.accessToken = 'pk.eyJ1IjoiaGVpZGVyaDk5IiwiYSI6ImNsanloaWpnZTAydnEzZG10MXZ5NG40d2YifQ.jdq5uWxdEy1v85zhN2oLYA';


if(!navigator.geolocation){
  alert('Navegador no soporta geolocalización');
  throw new Error('Navegador no soporta geolocalización');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
