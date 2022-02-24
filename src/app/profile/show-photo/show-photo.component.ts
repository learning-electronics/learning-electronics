import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-photo',
  templateUrl: './show-photo.component.html',
  styleUrls: ['./show-photo.component.css']
})
export class ShowPhotoComponent implements OnInit {
  imgPath: string = "../../assets/img/default.png";

  constructor() { }

  ngOnInit(): void {
  }

}
