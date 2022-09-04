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
}

