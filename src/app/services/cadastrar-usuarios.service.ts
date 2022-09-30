import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CadastrarUsuario } from '../models/cadastrar.models';

@Injectable({
  providedIn: 'root'
})
export class cadastrarDadosUsuario {
  private listaUsuarios: any[];
  private url = 'http://localhost:3000/usuarios';

  constructor(private httpClient: HttpClient) { 
    this.listaUsuarios = []
   }

   get usuarios(){
    return this.listaUsuarios;
   }

   lerUsuarios(): Observable<CadastrarUsuario[]>{
    return this.httpClient.get<CadastrarUsuario[]>(this.url);
   }
}
