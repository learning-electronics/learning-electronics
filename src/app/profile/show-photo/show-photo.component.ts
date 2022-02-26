import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { person } from 'src/app/shared.service';
import { EditPhotoComponent } from './edit-photo/edit-photo.component';

@Component({
  selector: 'app-show-photo',
  templateUrl: './show-photo.component.html',
  styleUrls: ['./show-photo.component.scss']
})
export class ShowPhotoComponent implements OnInit {
  @Input() user_info!: person;
  DJANGO_SERVER = 'http://127.0.0.1:8000';
  imgPath: string = "../../assets/img/default.png";

  constructor(public edit_photo_dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /* Update the Input variable changes */
  ngOnChanges() {
    this.user_info = this.user_info as person;

    if (this.user_info != undefined) {
      if (this.user_info.avatar != null) {
        this.imgPath = this.DJANGO_SERVER + this.user_info.avatar;
      }
    }
  }

  /* Open Edit Photo Dialog */
  editPhoto() {
    const dialogRef = this.edit_photo_dialog.open(EditPhotoComponent, {
      width: '40%',
      height: '70%',
      data: this.imgPath
    });
  }
}
