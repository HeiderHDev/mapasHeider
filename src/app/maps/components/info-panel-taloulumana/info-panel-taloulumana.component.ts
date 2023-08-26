import { Component } from '@angular/core';

@Component({
  selector: 'app-info-panel-taloulumana',
  templateUrl: './info-panel-taloulumana.component.html',
  styleUrls: ['./info-panel-taloulumana.component.css'],
})
export class InfoPanelTaloulumanaComponent {
  isOverlayVisible = false;
  currentLargeImage!: string;

  isInfoPanelVisible = window.innerWidth > 960; // Por defecto, mostrará el panel en pantallas grandes
  isMobileScreen = window.innerWidth <= 960; // Detecta si es una pantalla móvil

  constructor() {
    // Listener para cambios en el tamaño de la ventana
    window.addEventListener('resize', () => {
      this.isMobileScreen = window.innerWidth <= 960;
      this.isInfoPanelVisible = window.innerWidth > 960;
    });
  }

  toggleInfoPanel() {
    this.isInfoPanelVisible = !this.isInfoPanelVisible;
  }

  showLargeImage(imagePath: string) {
    this.currentLargeImage = imagePath;
    this.isOverlayVisible = true;
  }

  hideLargeImage() {
    this.isOverlayVisible = false;
  }
}
