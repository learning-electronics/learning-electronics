import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { account_response, SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss']
})
export class EditPhotoComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string, 
    private _service: SharedService, 
    private _snackBar: MatSnackBar, 
    private _router: Router,
    private dialogRef: MatDialogRef<EditPhotoComponent>
  ) { }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  /* Transform the base64 to a blob */
  convertDataUrlToBlob(dataUrl:any): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }

  /* Upload the user's photo */
  uploadPhoto() {
    if (this.croppedImage != "") {
      var photo;

      if (this.imageChangedEvent == "") {
        photo = this.data;
      } else {
        photo = this.imageChangedEvent.target.files[0].name;
      }

      var arr: string[] = photo.split('.');
      var ext: string = arr[arr.length - 1];
      var name: string = photo;

      const file = new File([this.convertDataUrlToBlob(this.croppedImage)], name, {type: 'image/' + ext});
      
      const formData: FormData = new FormData();
      formData.append('avatar', file, file.name);

      this._service.uploadPhoto(formData).subscribe((data:any)=>{
        data as account_response;

        if (data.v == true) {
          /* Realod the Profile Component */
          let currentUrl = this._router.url;
          this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this._router.navigate([currentUrl]);
          });
          this.dialogRef.close();

          this._snackBar.open('Imagem Atualizada!', 'Fechar', { "duration": 2500 });
        } else {
          this._snackBar.open('Atualização de Imagem falhou!', 'Fechar', { "duration": 2500 });
        }
      });
    }
  }
}
