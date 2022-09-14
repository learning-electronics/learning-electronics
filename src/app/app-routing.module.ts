import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LibraryComponent } from './library/library.component';
import { ProfileComponent } from './profile/profile.component';
import { QuizComponent } from './quiz/quiz.component';
import { ClassesComponent } from './classes/classes.component';
import { GameComponent } from './game/game.component';
import { FaqComponent } from './faq/faq.component';
import { SuccessRegisterComponent } from './success-register/success-register.component';
import { FailedRegisterComponent } from './failed-register/failed-register.component';
import { ShowClassComponent } from './classes/show-class/show-class.component';
import { MyExercisesComponent } from './my-exercises/my-exercises.component';
import { MyExamsComponent } from './my-exams/my-exams.component';
import { ShowQuizComponent } from './quiz/show-quiz/show-quiz.component';
import { ShowGameComponent } from './game/show-game/show-game.component';
import { PendingChangesGuard } from './pending-changes.guard';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';

const routes: Routes = [
  { path: 'show-quiz', component: ShowQuizComponent, canActivate: [LoginGuard], canDeactivate: [PendingChangesGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuard] },
  { path: 'classes', component: ClassesComponent, canActivate: [LoginGuard] },
  { path: 'class', component: ShowClassComponent, canActivate: [LoginGuard] },
  { path: 'my_exercises', component: MyExercisesComponent, canActivate: [LoginGuard, PermissionGuard] },
  { path: 'my_exams', component: MyExamsComponent, canActivate: [LoginGuard, PermissionGuard]  },
  { path: 'quiz', component: QuizComponent, canActivate: [LoginGuard] },
  { path: 'rooms', component: GameComponent, canActivate: [LoginGuard] },
  { path: 'game', component: ShowGameComponent, canActivate: [LoginGuard] },
  { path: 'faq', component: FaqComponent },
  { path: 'success-register', component: SuccessRegisterComponent },
  { path: 'failed-register', component: FailedRegisterComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },   /* Default routing to HomeComponent */
  { path: '**' , component: PageNotFoundComponent }         /* 404 not found will be redirected to PageNotFoundComponent */
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
