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

  updateBooking(payload: any, _id: any, bookingDate: any) {
    const URL = `api/v1/booking/update-booking?_id=${_id}&bookingDate=${bookingDate}`;
    return this.apiService.post(URL, payload);

  }

  deleteBooking(_id: any, bookingDate: any) {
    const URL = `api/v1/booking/delete-booking?_id=${_id}&bookingDate=${bookingDate}`;
    return this.apiService.get(URL);
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

  getAuth(username: string, password: string) {
    const URL = `api/v1/auth/security?username=${username}&password=${password}`;
    return this.apiService.get(URL);
  }

  generateInvoice(body: any) {
    const URL = `api/v1/invoice/generate_invoice`;
    return this.apiService.postPdf(URL, body);
  }

  getLagan() {
    const URL = `api/v1/lagan/get-lagan`;
    return this.apiService.get(URL);
  } 

  settleBooking(_id:string) {
    const url = 'api/v1/booking/settle-booking';
    return this.apiService.post(url, {'_id': _id});
  }

  getBookingList() {
    const url = 'api/v1/booking/get-booking-admin';
    return this.apiService.get(url);
  }

  uploadExpenseSheet(base64:any, fileName: any, ext: any) {
    const url = `api/v1/upload/upload-expense-excel`;
    return this.apiService.post(url, {file: base64, fileName: fileName, ext: ext})
  }

  addExpenseUrl(expenseSheetUrl:string, _id: string) {
    const url = `api/v1/booking/add-expense`;
    return this.apiService.post(url, {url: expenseSheetUrl, _id: _id})

  }

  assignDj(mobile: any, payload: any) {
    const url = `api/v1/app-user/assign-dj?mobile=${mobile}`;
    return this.apiService.post(url, payload);
  }

}
