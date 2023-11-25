import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
@Injectable({
  providedIn: 'root'
})
export class CashInFlowNewService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  addExpense(payload: any) {
    const url = 'api/v2/cash-in-flow/add-cash-inflow';
    return this.apiService.post(url, payload);
  }

  getExpenses(query: any) {
    const url = 'api/v2/cash-in-flow/get-cash-flow';
    return this.apiService.post(url, query);
  }

  deleteCashFlow(id: any) {
    const url = `api/v2/cash-in-flow/deletecashflow?_id=${id}`;
    return this.apiService.get(url);
  }

}
