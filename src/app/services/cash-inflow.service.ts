import { ApiServiceService } from './api-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CashInflowService {

  constructor(
    private apiService: ApiServiceService
  ) { }


  addCashInflow(body: any) {
    const url = `api/v1/cashinflow/add-cash-inflow`;
    return this.apiService.post(url, body);
  }

  getCashInflow() {
    const url = `api/v1/cashinflow/get-cash-inflow`;
    return this.apiService.get(url);
  }

  deleteCashFlow(id: any) {
    const url = `api/v1/cashinflow/deletecashflow?_id=${id}`;
    return this.apiService.get(url);
  }
}
