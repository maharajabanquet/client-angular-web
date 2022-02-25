import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class BookingServiceService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  add_booking(payload: any) {
    const URL = 'api/v1/booking/add-booking';
    return this.apiService.post(URL, payload);
  }

  getConfig() {
    const URL = 'api/v1/config/get-config';
    return this.apiService.get(URL);
  }

  getAllBookingDate() {
    const URL = 'api/v1/booking/get-booking-list?bookingDate=true';
    return this.apiService.get(URL);
  }

  getASpecificBooking(bookingDate: any) {
    const URL = `api/v1/booking/get-booking-list?bookingDateQuery=${bookingDate}`;
    return this.apiService.get(URL);
  }

  downloadInvoice(invoiceId: any) {
    const URL = `api/v1/invoice/invoice?id=${invoiceId}`;
    return this.apiService.get(URL);
  }

  getAuth() {
    const URL = 'api/v1/auth/security';
    return this.apiService.get(URL);
  }
}
