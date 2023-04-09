import { HttpClient, HttpParams, JsonpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGIFResponse } from '../interface/serachGifResponse.interface';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private _servicioUri: string = 'https://api.giphy.com/v1/gifs'
  private _apiKey: string = 'wjIgQN67JdGsPOXr5GDS7Ek65vMrMdF0';
  private _limit: number = 10;
  public resultados: Gif[] = [];

  private _historial: string[] = [];
  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('gifResponse')!) || [];
  }

  buscarGifs(query: string){
    if (query.trim() != ''){
      query = query.trim().toUpperCase();
      if (!this._historial.includes(query)) {
        this._historial.unshift(query);
        this._historial = this._historial.splice(0, 10);
        
        localStorage.setItem('historial', JSON.stringify(this._historial));
      }

      const params = new HttpParams()
      .set('api_key',this._apiKey)
      .set('limit',this._limit.toString())
      .set('q',query);
      
      this.http.get<SearchGIFResponse>(`${this._servicioUri}/search`, {params})
      .subscribe(resp => {
        this.resultados = resp.data;
        localStorage.setItem('gifResponse', JSON.stringify(this.resultados));
      });
    }
  }
}
