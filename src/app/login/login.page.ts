import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton
  ],
})
export class LoginPage implements OnInit {
  constructor(private firestore: Firestore) {}

  ngOnInit() {}

  nome: string = '';
  email: string = '';

  async salvarUsuario(nome: string, email: string) {
    const usuarioRef = collection(this.firestore, 'usuario');

    try {
      await addDoc(usuarioRef, {
        nome: nome,
        email: email,
        criadoEm: new Date(),
      });
      console.log('usuário criado com sucesso');
    } catch (error) {
      console.error('Erro ao salvar o usuário', error);
    }
  }
}
