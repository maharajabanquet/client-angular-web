import { ApiServiceService } from './api-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private apiService: ApiServiceService
  ) { }


  getWhatsappQrCode() {
    const url = 'api/v1/whatsapp/generate-qr';
    return this.apiService.get(url);
  }

  getWhatsappAuth() {
    const url = 'api/v1/whatsapp/check-auth';
    return this.apiService.get(url);
  }

  updateComm(body:any) {
    const url = `api/v1/coms/update-com`;
    return this.apiService.post(url, body);

  }

  checkComm() {
    const url = `api/v1/coms/check-com`;
    return this.apiService.get(url)
  }
}

