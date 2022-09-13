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
          this.checkComm();
          this.qrCode = ''
          this.isAuthenticated = true;
          
        })
      }
    })
  }

  checkComm() {
    this.ul.checkComm().subscribe((status: any) => {
      console.log(status);
      let commArray = status && status.docs || [];
      if(commArray && commArray.length === 0) {
        this.ul.checkComm().subscribe((status: any) => {
          let verifyCom = status && status.docs || [];
          if(verifyCom.length > 0) {
            verifyCom.forEach((element: any) => {
              this.connectedDevice.push({
                name: element.name,
                updated: new Date(element.updated)
              })
              this.isAuthenticated = true;
            }
            )}
        })
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
