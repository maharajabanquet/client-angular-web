import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnquiryServiceService {
  visitorCode = new Subject();
  constructor(
    private apiService: ApiServiceService
  ) { }

  addEnquiry(payload: {}) {
    const URL = 'api/v1/enquiry/add-enquiry';
    return this.apiService.post(URL, payload);
  }

  getAllEnquiry(pageNo=1, pageSize: any) {
    const URL = `api/v1/enquiry/view-all-enquiry?pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.apiService.get(URL);
  }

  sendMail(payload: any) {
    const URL = `api/v1/enquiry/contact-us`;
    return this.apiService.post(URL, payload);
  }

  verifyVisitorCode(payload: any) {
    const URL = 'api/v1/enquiry/validate-visitor-code';
    return this.apiService.post(URL, payload);
  }
}
