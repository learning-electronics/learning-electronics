import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  subscription: Subscription = new Subscription();
  value: number = 0;

  constructor(private _service: SharedService) { }

  ngOnInit(): void {
    /* Get the correct inver value bassed on what theme is being used */
    this.subscription = this._service.currentThemeStatus.subscribe(theme => {
      if (theme == false) {
        this.value = 0;
      } else {
        this.value = 1;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
