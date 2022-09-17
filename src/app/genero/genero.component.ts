import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})

export class GeneroComponent implements OnInit {
  form: FormGroup;
  error = "Este campo é obrigatório"

  constructor( 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tituloFilmes: new FormControl('', [Validators.required])
    })
  }

  salvarDadosGenero(){
  console.log('Gênero salvo!')
  }
}