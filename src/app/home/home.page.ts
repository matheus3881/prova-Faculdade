import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonButton,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton, RouterModule],
})
export class HomePage {
  contador = 0;
  constructor() {}

  incrementar() {
    this.contador++;
  }

  decrementar(){
    this.contador--;
  }
}
