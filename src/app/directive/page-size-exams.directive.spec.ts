import { PageSizeExamsDirective } from './page-size-exams.directive';
import { MatPaginator } from '@angular/material/paginator';

let paginator: MatPaginator;

describe('PageSizeExamsDirective', () => {
  it('should create an instance', () => {
    const directive = new PageSizeExamsDirective(paginator);
    expect(directive).toBeTruthy();
  });
});
