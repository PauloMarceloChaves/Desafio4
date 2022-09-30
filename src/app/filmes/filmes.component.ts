import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

interface filmeInterface{
  id: number,
  filme: String,
  genero: String
}

interface generoInterface{
  id: number,
  genero: String
}

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss']
})

export class FilmesComponent implements OnInit {
  public formFilmes: FormGroup;
  error = "Este campo é obrigatório";
  private url = "http://localhost:3000/filmes";
  private url_2 = "http://localhost:3000/genero";
  public listaFilme: any;
  public listaGenero: any;
  public filmeId: number = 0

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
  ) { }

  get filmes(){
    return this.listaFilme
  }

  set filmes(filme: filmeInterface){
    this.listaFilme.push(filme)
  }
  
  salvarDadosFilmeAPI(objetoFilme: filmeInterface): Observable<filmeInterface>{
    return this.httpClient.post<filmeInterface>(this.url, objetoFilme)
  }

  editarFilmeAPI(objetoFilme: filmeInterface){
    return this.httpClient.put<filmeInterface>(`${this.url}/${objetoFilme.id}`, objetoFilme)
  }
  
  excluirFilmeAPI(id: number){
    return this.httpClient.delete<filmeInterface>(`${this.url}/${id}`)
  }
  
  ngOnInit(): void {
    this.lerFilmes().subscribe({
      next:(generos: filmeInterface[]) => {
        this.listaFilme = generos;
        console.log(this.listaFilme);
      },
      error: () => {
        console.log("Erro ao importar o filme.");  
      }
    })
    
    this.formFilmes = this.formBuilder.group({
      tituloFilmes: new FormControl('', [Validators.required]),
      selectGenero: new FormControl('', [Validators.required])
    })
    
    this.lerGenero().subscribe({
      next: (generos: generoInterface[]) => {
        this.listaGenero = generos;
        console.log(this.listaGenero);
      },
      error: () => {
        console.log("Erro ao importar o gênero."); 
      }
    })
  }

  lerFilmes(): Observable<filmeInterface[]>{
    return this.httpClient.get<filmeInterface[]>(this.url)
  }

  lerGenero(): Observable<generoInterface[]> {
    return this.httpClient.get<generoInterface[]>(this.url_2)
  }

  editarFilme(filme: filmeInterface){
    this.filmeId = filme.id
    const EditFilme = this.formFilmes.controls['tituloFilmes'].setValue(filme.filme);
    const EditGenero = this.formFilmes.controls['selectGenero'].setValue(filme.genero);
  }
  
  excluirFilme(id: number) {
    this.excluirFilmeAPI(id).subscribe({
      next: () => {
        this.ngOnInit()
      },
      error: () => {
        console.log("Erro ao tentar excluir.");
      }
    })
  }
  
  updateFilme(){
    const id = this.filmeId;
    const filme = this.formFilmes.controls['tituloFilmes'].value;
    const genero = this.formFilmes.controls['selectGenero'].value;
    const objetoFilme: filmeInterface = {id: id, filme: filme, genero: genero};
    this.editarFilmeAPI(objetoFilme).subscribe({
      next: () => {
        this.filmeId = 0
        this.ngOnInit()
      },
      error: () => {
        console.log("Você não conseguiu fazer a alteração.");
      }
    })
  }
  
  salvarDadosFilme(){
    if (this.filmeId > 0){
      this.updateFilme()
    }
    else{
      const id = (this.listaFilme[(this.listaFilme.length) - 1].id) + 1;
      const filme = this.formFilmes.controls['tituloFilmes'].value;
      const genero = this.formFilmes.controls['selectGenero'].value;
      const objetoFilme: filmeInterface={id: id, filme: filme, genero: genero};

      this.salvarDadosFilmeAPI(objetoFilme).subscribe({
        next: () => {
          this.ngOnInit()
        },
        error: () => {
          console.log("Erro ao importar o filme");
        }
      })
    }
  }
}