import { PageSizeClassMembersDirective } from './page-size-class-members.directive';
import { MatPaginator } from '@angular/material/paginator';

let paginator: MatPaginator;

describe('PageSizeClassMembersDirective', () => {
  it('should create an instance', () => {
    const directive = new PageSizeClassMembersDirective(paginator);
    expect(directive).toBeTruthy();
  });
});
