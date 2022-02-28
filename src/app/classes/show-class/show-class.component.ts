import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-class',
  templateUrl: './show-class.component.html',
  styleUrls: ['./show-class.component.scss']
})
export class ShowClassComponent implements OnInit {

  constructor(private _location: Location, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    console.log(this._location.getState());
  }
}
