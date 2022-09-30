import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

interface generoInterface{
  id: number,
  genero: String
}

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})

export class GeneroComponent implements OnInit {
  public formGenero: FormGroup;
  error = "Este campo é obrigatório";
  public listaGenero: any;
  public generoId: number = 0;
  private url = "http://localhost:3000/genero";
  
  constructor( 
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  get genero(){
    return this.listaGenero
  }

  set genero(genero: generoInterface){
    this.listaGenero.push(genero)
  }

  lerGenero(): Observable<generoInterface[]>{
    return this.httpClient.get<generoInterface[]>(this.url)
  }

  salvarDadosGeneroAPI(objetoGenero: generoInterface): Observable<generoInterface>{
    return this.httpClient.post<generoInterface>(this.url, objetoGenero)
  }

  editarGeneroAPI(objetoGenero: generoInterface){
    return this.httpClient.put<generoInterface>(`${this.url}/${objetoGenero.id}`, objetoGenero)
  }

  excluirGeneroAPI(id: number){
    return this.httpClient.delete<generoInterface>(`${this.url}/${id}`)
  }

  ngOnInit(): void {
    this.lerGenero().subscribe({
      next: (genero: generoInterface[]) => {
        this.listaGenero = genero;
        console.log(this.listaGenero);
      },
      error: () => {
        console.log("Erro ao importar o gênero.");
      }
    })

    this.formGenero = this.formBuilder.group({
      tituloFilmes: new FormControl('', [Validators.required])
    })
  }

  editarGenero(genero: generoInterface){
    this.generoId = genero.id;
    const EditGenero = this.formGenero.controls['tituloFilmes'].setValue(genero.genero)
  }

  excluirGenero(id: number){
    this.excluirGeneroAPI(id).subscribe({
      next: () => {
        this.ngOnInit()
      },
      error: () => {
        console.log("Erro ao tentar excluir.");
      }
    })
  }

  updateGenero(){
    const id = this.generoId;
    const genero = this.formGenero.controls['tituloFilmes'].value;
    const objetoGenero: generoInterface = {id: id, genero: genero};
    this.editarGeneroAPI(objetoGenero).subscribe({
      next: () => {
        this.generoId = 0
        this.ngOnInit()
      },
      error: () => {
        console.log("Você não conseguiu fazer a alteração.");
      }
    })
  }

  salvarDadosGenero(){
    if(this.generoId > 0){
      this.updateGenero()
    }
    else{
      const id = (this.listaGenero[(this.listaGenero.length) - 1].id) + 1;
      const genero = this.formGenero.controls['tituloFilmes'].value;
      const objetoGenero: generoInterface = {id: id, genero: genero}

      this.salvarDadosGeneroAPI(objetoGenero).subscribe({
        next: () => {
          this.ngOnInit()
        },
        error: () => {
          console.log("Erro ao importar o gênero.");  
        }
      })
    }
  }
}