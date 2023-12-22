import { Component } from '@angular/core';
import { TrafficService } from 'src/app/services/traffic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maharaja';
  websiteRead!: boolean;
  constructor(private trafficService: TrafficService) {
    this.snapShot();
    if(localStorage.getItem('email') === 'support@maharajaraxaul.com') {
      localStorage.clear()
    }
  //   window.otpless = (otplessUser) => {
  //   alert(JSON.stringify(otplessUser));
  // };
    
  }

  snapShot() {
    this.trafficService.getUserIp().subscribe((resp: any) => {
      this.trafficService.snapShot(resp).subscribe(res => {
        console.log('snapshot completed');
        this.websiteRead = true;
      })
    })
  }
}
