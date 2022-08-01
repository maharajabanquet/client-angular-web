import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
   startPoint = environment.host
  constructor(
    private http: HttpClient
  ) { }


  get(url: any) {
    return this.http.get(this.startPoint + url)
  }

  getPdf(url: any, body: any) {

    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
        responseType : 'blob',
        Accept : 'application/pdf',
        observe : 'response'
      })
    };
    return this.http
      .post(this.startPoint + url,body, httpOptions);
  }

  postPdf(url: any, body: any) {

    const httpOptions = {
      responseType: 'blob' as 'json'
    };
  
    return this.http.post(this.startPoint + url,body, httpOptions);
  }

  getThirdParty(url: any) {
    return this.http.get(url)

  }

  post(url: any, body: any) {
    return this.http.post(this.startPoint + url, body);
  }
}
