import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  isMobile!: boolean;
  isReady!: boolean;
  constructor() { }

  ngOnInit(): void {
    
    let audio = new Audio();
    audio.src = "../assets/song.mp3";
    audio.load();
    audio.play();
    audio.volume = 10;
    console.log("audio",audio);
    
 
    

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log(window.innerWidth);
    
    if(window.innerWidth > 1500) {
      this.isMobile = false
    } else {
      this.isMobile = true
    }
    
}
isReadyToLoad(eventData: any) {
  this.isReady = eventData;
}

}
