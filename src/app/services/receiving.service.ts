import { ApiServiceService } from './api-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceivingService {

  constructor(
    private apiService: ApiServiceService
  ) { }


  create(payload:  any) {
    const url = 'api/v1/receiving/create';
    return this.apiService.post(url, payload);
  }

  get() {
    const url = 'api/v1/receiving/get';
    return this.apiService.get(url);
  }

  
  generateInvoice(body: any) {
    const URL = `api/v1/receiving/generate/create_receiving_slip`;
    return this.apiService.postPdf(URL, body);
  }
}
