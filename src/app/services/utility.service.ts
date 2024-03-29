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

  getDepartment() {
    const url = 'api/v1/department/get-department';
    return this.apiService.get(url);
  }

  uploadFile(base64:any, empName: any, ext: any){
    const url = `api/v1/upload/upload-proof?ext=${ext}`;
    return this.apiService.post(url, {file: base64, fileName: empName, ext: ext})
  }
  uploadCustomerIdProof(base64:any, empName: any, ext: any) {
    const url = `api/v1/upload/upload-customer-id-proof?ext=${ext}`;
    return this.apiService.post(url, {file: base64, employeeName: empName, ext: ext})
  }

  login(payload: any) {
    const url = 'api/v1/user/login';
    return this.apiService.post(url, payload);
  }

  sendNotification(payload: any, mobile: any) {
    const url = `api/v1/app-user/send_notification?mobile=${mobile}`;
    return this.apiService.post(url, payload);
  }

  getMedia() {
    const url = `api/v1/media/get-all-media`;
    return this.apiService.get(url);
  }

  addMedia(payload: any) {
    const url = `api/v1/media/add-media`;
    return this.apiService.post(url, payload)
  }

  addDebt(payload: any) {
    const url = 'api/v1/debt/add-debt';
    return this.apiService.post(url, payload);
  }

  getDebt() {
    const url = 'api/v1/debt/get-debt';
    return this.apiService.get(url);

  }
  
  updatePayment(payload: any, name: any) {
    const url = `api/v1/debt/update-payment?name=${name}`;
    return this.apiService.post(url, payload);
    
  }

}

