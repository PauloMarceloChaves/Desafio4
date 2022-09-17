import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss']
})
export class FilmesComponent implements OnInit {
  form: FormGroup;
  error = "Este campo é obrigatório";


  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tituloFilmes: new FormControl('', [Validators.required]),
    })
  }

  salvarDadosFilme(){
    console.log('Filme salvo!');
  }
}