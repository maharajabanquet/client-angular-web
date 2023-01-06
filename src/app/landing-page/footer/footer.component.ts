import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isProd!: any;
  constructor() { }

  ngOnInit(): void {
    this.isProd = environment.PROD
  }

}
