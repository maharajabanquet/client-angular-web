import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  type = 'Booking Cash Inflow'
  constructor() { }

  ngOnInit(): void {
  }

}
