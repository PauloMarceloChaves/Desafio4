import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  form: FormGroup;
  error = "Este campo é obrigatório"

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required])
    })
  }

  salvarDadosUsuario(){
    console.log('cadastrado!')
  }

  validaEmail(): String{
    if(this.form.controls["email"].hasError('required')){
      return this.error;
    }

    return this.form.controls["email"].hasError('email') ? "E-mail inválido" : '';
  }
}
