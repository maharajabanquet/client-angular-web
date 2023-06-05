import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private apiService: ApiServiceService
  ) { }


  addEmployee(payload: any) {
    const url = 'api/v1/employee/add-employee';
    return this.apiService.post(url, payload);
  } 

  getEmployeeList() {
    const url = 'api/v1/employee/get-employee-list';
    return this.apiService.get(url);
  }

  deleteEmployee(contact: any) {
    const url = `api/v1/employee/delete-employee?contact=${contact}`;
    return this.apiService.get(url);
  }

  addHotelActivities(payload: any) {
    const url = 'api/v1/hotel/add-hotel-activities';
    return this.apiService.post(url, payload);
  } 

  addUser(payload: any) {
    const url = 'api/v1/app-user/add-user';
    return this.apiService.post(url, payload);
    
  }

  getHotelActivityList() {
    const url = 'api/v1/hotel/get-hotel-activities-list';
    return this.apiService.get(url);
  }

  getUser() {
    const url = 'api/v1/app-user/get-user';
    return this.apiService.get(url);
    
  }
  removeUser(mobile: string) {
    const url = `api/v1/app-user/remove-user?mobile=${mobile}`;
    return this.apiService.get(url);
    
  }


  deleteHotelActivites(contactNumber: any) {
    const url = `api/v1/hotel/delete-activities?contactNumber=${contactNumber}`;
    return this.apiService.get(url);
  }

  
}
