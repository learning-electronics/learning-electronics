import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  downloadStudentFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/dummy.pdf');
    link.setAttribute('download', `le_manual_aluno.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downloadTeacherFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/dummy.pdf');
    link.setAttribute('download', `le_manual_professor.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
