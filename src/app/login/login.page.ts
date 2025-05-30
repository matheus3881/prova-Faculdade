import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
} from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { deleteDoc, updateDoc, doc } from '@angular/fire/firestore';

import { FormGroup, FormControl } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonText,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';

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
    IonButton,
    ReactiveFormsModule,
    IonText,
    IonList,
    IonItem,
    IonLabel,
  ],
  providers: [CurrencyPipe],
})
export class LoginPage implements OnInit {
  constructor(
    private firestore: Firestore,
    private currencyPipe: CurrencyPipe
  ) {}

  produtos$!: Observable<any[]>;

  ngOnInit() {
    const produtosLista = collection(this.firestore, 'produtos');
    this.produtos$ = collectionData(produtosLista, { idField: 'id' });
  }

  teste = new FormGroup({
    nome_produto: new FormControl('', Validators.required),
    valor_produto: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
  });

  async salvarUsuario(teste: FormGroup) {
    if (this.teste.valid) {
      const usuarioRef = collection(this.firestore, 'produtos');

      try {
        await addDoc(usuarioRef, {
          nome_produto: teste.value.nome_produto,
          valor_produto: teste.value.valor_produto,
          criadoEm: new Date(),
        });
        this.teste.reset();
      } catch (error) {
        console.error('deu ruim', error);
      }
    } else {
      this.teste.markAllAsTouched();
      console.warn('formulário inválido');
    }
  }

  formatarMoeda() {
    const control = this.teste.get('valor_produto');
    const valor = control?.value;

    if (valor) {
      const numero = parseFloat(
        valor.replace(/[^\d,-]/g, '').replace('.', ',')
      );

      const formatado = this.currencyPipe.transform(
        numero,
        'BRL',
        'symbol-narrow',
        '1.2-2',
        'pt-BR'
      );

      control?.setValue(formatado, { emitEvent: false });
    }
  }

  async excluirProduto(id: string) {
    try {
      const produtoRef = doc(this.firestore, `produtos/${id}`);
      await deleteDoc(produtoRef);
    } catch (error) {
      console.error(error);
    }
  }

  produtoEditando: string | null = null;
  formularioEdicao = new FormGroup({
    nome_produto: new FormControl('', Validators.required),
    valor_produto: new FormControl('', Validators.required),
  });

  editarProduto(produto: any) {
    this.produtoEditando = produto.id;
    this.formularioEdicao.setValue({
      nome_produto: produto.nome_produto,
      valor_produto: produto.valor_produto,
    });
  }

  async salvarEdicao(produtoId: string) {
    if (this.formularioEdicao.valid) {
      const ref = doc(this.firestore, 'produtos', produtoId);
      await updateDoc(ref, this.formularioEdicao.value);
      this.produtoEditando = null;
    }
  }

  cancelarEdicao() {
    this.produtoEditando = null;
  }
}
