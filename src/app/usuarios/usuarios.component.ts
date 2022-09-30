import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

interface UsuarioInterface{
  id: number,
  nome: String,
  email: String,
  tel: String
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {
  public formUsuario: FormGroup;
  error = "Este campo é obrigatório";
  public usuarioId: number = 0;
  public listaUsuario: any;
  private url = "http://localhost:3000/usuarios";
  private usuario: UsuarioInterface[]

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) { }

  get usuarios(){
    return this.listaUsuario
  }

  set usuarios(usuario: UsuarioInterface){
    this.listaUsuario.push(usuario)
  }

  salvarUsuarioAPI(objetoUsuario: UsuarioInterface): Observable<UsuarioInterface>{
    return this.httpClient.post<UsuarioInterface>(this.url, objetoUsuario)
  }

  editarUsuarioAPI(objetoUsuario: UsuarioInterface){
    return this.httpClient.put<UsuarioInterface>(`${this.url}/${objetoUsuario.id}`, objetoUsuario)
  }

  excluirUsuarioAPI(id: number){
    return this.httpClient.delete<UsuarioInterface>(`${this.url}/${id}`)
  }

  ngOnInit(): void {
    this.lerUsuarios().subscribe({
      next: (usuario: UsuarioInterface[]) => {
        this.listaUsuario = usuario;
        console.log(usuario);
      },
      error: () => {
        console.log("Erro ao importar o usuário.");
      }
    })

    this.formUsuario = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required])
    })
  }

  lerUsuarios(): Observable<UsuarioInterface[]>{
    return this.httpClient.get<UsuarioInterface[]>(this.url)    
  }

  editarUsuario(usuario: UsuarioInterface){
    this.usuarioId = usuario.id;
    const EditNome = this.formUsuario.controls['nome'].setValue(usuario.nome);
    const EditEmail = this.formUsuario.controls['email'].setValue(usuario.email);
    const EditTel = this.formUsuario.controls['telefone'].setValue(usuario.tel);
  }

  excluirUsuario(id: number){
    this.excluirUsuarioAPI(id).subscribe({
      next: () => {
        this.ngOnInit()
      },
      error: () => {
        console.log("Erro ao tentar excluir.");
      }
    })
  }

  updateUsuario(){
    const id = this.usuarioId;
    const nome = this.formUsuario.controls['nome'].value;
    const email = this.formUsuario.controls['email'].value;
    const tel = this.formUsuario.controls['telefone'].value;
    const objetoUsuario: UsuarioInterface = {id: id, nome: nome, email: email, tel: tel};
    this.editarUsuarioAPI(objetoUsuario).subscribe({
      next: () => {
        this.usuarioId = 0;
        this.ngOnInit();
      },
      error: () => {
        console.log("Você não conseguiu fazer a alteração.");
      }
    })
  }

  cadastrarDadosUsuario(){
    console.log(this.usuarioId);
    
    if (this.usuarioId > 0){
      this.updateUsuario()
    }
    else{
      const id = (this.listaUsuario[(this.listaUsuario.length) - 1].id) + 1;
      const nome = this.formUsuario.controls['nome'].value;
      const email = this.formUsuario.controls['email'].value;
      const tel = this.formUsuario.controls['telefone'].value;
      const objetoUsuario: UsuarioInterface = {id: id, nome: nome, email: email, tel: tel};

      this.salvarUsuarioAPI(objetoUsuario).subscribe({
        next: () => {
          this.ngOnInit()
        },
        error: () => {
          console.log("Erro ao importar o usuário.");
        }
      })
    }
  }

  validaEmail(): String{
    if(this.formUsuario.controls["email"].hasError('required')){
      return this.error;
    }
    else{
    return this.formUsuario.controls["email"].hasError('email') ? "E-mail inválido" : '';
    }
  }
}
