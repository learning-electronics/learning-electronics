import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-delete-confirmation-exam',
  templateUrl: './delete-confirmation-exam.component.html',
  styleUrls: ['./delete-confirmation-exam.component.scss']
})
export class DeleteConfirmationExamComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _service: SharedService, 
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteConfirmationExamComponent>,
    private _router: Router
  ) { 
  }

  ngOnInit(): void {
  }

  /* Delete the exams */
  confirm() {
    this.data.forEach((exam: any) => {
      this._service.deleteExam(exam.id).subscribe((res: any) => {
        if (!res.v) {
          this._snackBar.open("Erro a eliminar testes", "Fechar", { duration: 2500 });
        }
      });
      /* Close the dialog */
      this.dialogRef.close();

      /* Reload the my_exercises component */
      let currentUrl = this._router.url;
      this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this._router.navigate([currentUrl]);
      });

      this._snackBar.open("Testes Eliminados", "Fechar", { duration: 25000 });
    })
  }

}
