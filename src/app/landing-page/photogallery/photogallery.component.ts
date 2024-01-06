import { Component, OnInit, Inject, Sanitizer } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

export interface DialogData {
  img: string;
}

@Component({
  selector: 'photogallery',
  templateUrl: './photogallery.component.html',
  styleUrls: ['./photogallery.component.css']
})
export class PhotogalleryComponent implements OnInit {
  marketingImage: any  = []
  constructor(
    public dialog: MatDialog,
    private ut: UtilityService,
    protected _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
      this.ut.getMedia().subscribe((resp: any) => {
        this.marketingImage = resp;
      })
  }

  

  getVideoLink(source: any) {
    var link = this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${source}`)
    return link
  }
  
  openDialog(img: any) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: img ,
      autoFocus: true,
      maxHeight: '100vh'

    });
    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
})

export class DialogContentExampleDialog {
  imgUrl!: any;
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.imgUrl = data;
    console.log(this.imgUrl);
    
  }
}