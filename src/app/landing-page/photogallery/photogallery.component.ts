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
    "../../../assets/images/main.jpeg",
    "../../../assets/images/barat.jpeg",
    "../../../assets/images/mandap.jpeg",
    "../../../assets/images/main2.jpeg",
    "../../../assets/images/room.jpeg",
    "../../../assets/images/minihall.jpeg"
  ]
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
  }

  

  
  openDialog(img: any) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: img ,
      autoFocus: true,
      maxHeight: '100vh'

    });

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