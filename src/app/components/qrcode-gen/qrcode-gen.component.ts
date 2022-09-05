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
  connectedDevice : any = [];

  constructor(
    private ul: UtilityService
  ) { }

  ngOnInit(): void {
    this.checkComm();
 
  
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
        this.ul.updateComm({status: true, name: 'whatsapp'}).subscribe(res => {
          this.qrCode = ''
          this.isAuthenticated = true;
          this.checkComm();
        })
      }
    })
  }

  checkComm() {
    this.ul.checkComm().subscribe((status: any) => {
      let commArray = status && status.docs || [];
      if(commArray && commArray.length === 0) {
        this.isAuthenticated = false;
       this.generate();
      } else {
        commArray.forEach((element: any) => {
          this.connectedDevice.push({
            name: element.name,
            updated: new Date(element.updated)
          })
          this.isAuthenticated = true;
        })
      }
    })
  }

}
