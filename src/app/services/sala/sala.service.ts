import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  url = environment.api.url + '/api/Sala'
  constructor(protected http: HttpClient) { }

  public post(data): Observable<any> {
    return this.http.post<any>(this.url + '/Inserir', data);
  }

  public put(data): Observable<any> {
    return this.http.put<any>(this.url + '/Editar', data);
  }

  public get(): Observable<any> {
    return this.http.get<any>(this.url + '/Buscar');
  }

  public getOne(query = ''): Observable<any> {
    return this.http.get<any>(this.url + '/BuscarPorId?' + query);
  }

  public delete(id): Observable<any> {
    return this.http.delete<any>(this.url + '/Deletar?id=' + id);
  }
}
