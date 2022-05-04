import { PageSizeExercisesDirective } from './page-size-exercises.directive';
import { MatPaginator } from '@angular/material/paginator';

let paginator: MatPaginator;

describe('PageSizeExercisesDirective', () => {
  it('should create an instance', () => {
    const directive = new PageSizeExercisesDirective(paginator);
    expect(directive).toBeTruthy();
  });
});
