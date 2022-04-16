import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-logedin',
  templateUrl: './logedin.component.html',
  styleUrls: ['./logedin.component.scss']
})
export class LogedinComponent implements OnInit {

  isActive1 = false;
  isActive2 = false;
  isActive3 = false;
  isActive4 = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
