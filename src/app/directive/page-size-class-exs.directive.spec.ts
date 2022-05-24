import { PageSizeClassExsDirective } from './page-size-class-exs.directive';
import { MatPaginator } from '@angular/material/paginator';

let paginator: MatPaginator;

describe('PageSizeClassExsDirective', () => {
  it('should create an instance', () => {
    const directive = new PageSizeClassExsDirective(paginator);
    expect(directive).toBeTruthy();
  });
});
