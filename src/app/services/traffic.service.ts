import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
@Injectable({
  providedIn: 'root'
})
export class TrafficService {

  constructor(
    private apiService: ApiServiceService
  ) { }
  

  snapShot(body: any) {
    const URL = 'api/v1/traffic/snapshot';
    return this.apiService.post(URL, body);
  }

  getUserIp() {
    const URL = `https://api.freegeoip.app/json/?apikey=0052ba30-8f60-11ec-920d-6d8916257770`;
    return this.apiService.getThirdParty(URL)
  }
}
