import { Directive } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Directive({
  selector: '[appPageSizeClassMembers]'
})
export class PageSizeClassMembersDirective {
  constructor(private element: MatPaginator) {
    element.page.subscribe((e: any) => this._setLocalStorage(e.pageSize));

    this._setPageSize(Number(localStorage.getItem('pageSizeClassMembers')) || 10);
  }

  private _setPageSize(v: number) {
    this.element.pageSize = v;
  }

  private _setLocalStorage(v: number) {
    localStorage.setItem('pageSizeClassMembers', v.toString());
  }
}
