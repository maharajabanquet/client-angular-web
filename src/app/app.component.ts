import { Component } from '@angular/core';
import { TrafficService } from 'src/app/services/traffic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maharaja';
  constructor(private trafficService: TrafficService) {
    this.snapShot();
   
  }

  snapShot() {
    this.trafficService.getUserIp().subscribe((resp: any) => {
      this.trafficService.snapShot(resp).subscribe(res => {
        console.log('snapshot completed');
      })
    })
  }
}
