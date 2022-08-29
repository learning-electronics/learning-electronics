import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PopupComponent } from '../popup/popup.component';
import { exercise, SharedService, theme } from '../shared.service';

interface Node {
  id: any;
  name: string;
  children?: Node[];
}

interface ExampleFlatNode {
  id: number;
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  all_exercises: exercise[] = [];
  all_themes: theme[] = [];
  tree_data: Node[] = [];
  selected_toggle: string = 'list';
  form: FormGroup;

  constructor(private _service: SharedService, public popup_dialog: MatDialog, private _formBuilder: FormBuilder) {
    this._service.getThemes().subscribe((themes: any) => {
      themes.forEach((theme: theme) => {
        this.all_themes.push(theme);
        this.tree_data.push({ name: theme.name, id: theme.id, children: [] });
      });

      this._service.getExercises().subscribe((exercises: any) => {
        exercises.forEach((ex: exercise) => {
          this.all_exercises.push(ex);
          
          ex.theme.forEach((id: any) => {
            this.tree_data.find((t: any) => t.id === id)?.children?.push(
              {
                id: ex.id,
                name: ex.question
              }
            );
          });
        });
        
        this.dataSource.data = this.tree_data;
      });
    });
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({ search: new FormControl("") });
  }

  /* Shorthands for form controls (used from within template) */
  get search() { return this.form.get('search'); }

  onToggleChange(value: string) {
    this.selected_toggle = value;
  }

  popup(node: Node) {
    /* Open Popup Dialog */
    const dialogRef = this.popup_dialog.open(PopupComponent, { data: this.getExFromNode(node) });
  }

  searchExercise(event: Event) {
    const n = Number((event.target as HTMLInputElement).value);
    var ex_query = this.getExFromNode({ id: n, name: 'search'});

    if (ex_query != undefined) {
      /* Open Popup Dialog */
      const dialogRef = this.popup_dialog.open(PopupComponent, { data: ex_query });
      this.search?.setErrors(null);
    } else {
      console.log('not found');
      this.search?.setErrors([{'exerciseNotFound': true}]);
    }
  }

  getExFromNode(node: Node) {
    return this.all_exercises.find((ex: exercise) => ex.id === node.id)
  }

  private _transformer = (node: Node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
