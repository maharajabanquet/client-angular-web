import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
export interface DialogData {
  img: string;
}

@Component({
  selector: 'photogallery',
  templateUrl: './photogallery.component.html',
  styleUrls: ['./photogallery.component.css']
})
export class PhotogalleryComponent implements OnInit {
  marketingImage = [
    "https://res.cloudinary.com/maharaja-banquet/image/upload/v1665473549/webapp-assets/WhatsApp_Image_2022-10-11_at_1.02.18_PM_fgusyj.jpg",
    "https://res.cloudinary.com/maharaja-banquet/image/upload/v1665473343/webapp-assets/WhatsApp_Image_2022-10-11_at_12.58.52_PM_ze1nch.jpg",
    "https://res.cloudinary.com/maharaja-banquet/image/upload/v1665472903/webapp-assets/310256473_797691548149872_6211848659489756468_n_njmnx7.jpg",
    "https://res.cloudinary.com/maharaja-banquet/image/upload/v1665470585/webapp-assets/side_rwjl2o.jpg",
    "https://res.cloudinary.com/maharaja-banquet/image/upload/v1665470584/webapp-assets/hall_mfpydo.jpg",
    "https://res.cloudinary.com/maharaja-banquet/image/upload/v1665470583/webapp-assets/fall_celling_utdoaq.jpg"
  ]
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  
  openDialog(img: any) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {data: img });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
  }
}