import { Component, Input, OnInit } from '@angular/core';
import { person } from 'src/app/shared.service';

@Component({
  selector: 'app-show-photo',
  templateUrl: './show-photo.component.html',
  styleUrls: ['./show-photo.component.css']
})
export class ShowPhotoComponent implements OnInit {
  @Input() user_info: person | undefined;
  imgPath: string = "../../assets/img/default.png";

  constructor() { }

  ngOnInit(): void {
  }

  /* Update the Input variable changes */
  ngOnChanges() {
    this.user_info = this.user_info as person;
  }
}
