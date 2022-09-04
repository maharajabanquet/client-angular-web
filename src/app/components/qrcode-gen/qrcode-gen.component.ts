import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'qrcode-gen',
  templateUrl: './qrcode-gen.component.html',
  styleUrls: ['./qrcode-gen.component.css']
})
export class QrcodeGenComponent implements OnInit {
  qrCode =  '';
  isAuthenticated = false;
  constructor(
    private ul: UtilityService
  ) { }

  ngOnInit(): void {
    this.generate();
  }


  generate() {
   this.ul.getWhatsappQrCode().subscribe((data: any) => {
    this.qrCode = data && data.qr_code || undefined;
    this.checkAuth();
   })
  }

  checkAuth() {
    this.ul.getWhatsappAuth().subscribe((authStatus: any) => {
      if(authStatus && authStatus.status === 'authenticated') {
        this.qrCode = ''
        this.isAuthenticated = true;
      }
    })
  }

}
