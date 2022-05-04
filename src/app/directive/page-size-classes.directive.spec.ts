import { PageSizeClassesDirective } from './page-size-classes.directive';
import { MatPaginator } from '@angular/material/paginator';

let paginator: MatPaginator;

describe('PageSizeClassesDirective', () => {
  it('should create an instance', () => {
    const directive = new PageSizeClassesDirective(paginator);
    expect(directive).toBeTruthy();
  });
});
