import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  isMobile!: boolean;
  constructor() { }

  ngOnInit(): void {
    
   

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log(window.innerWidth);
    
    if(window.innerWidth > 1800) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    
}

}
