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

const routes: Routes = [
  { path: 'show-quizz', component: ShowQuizComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'class', component: ShowClassComponent },
  { path: 'my_exercises', component: MyExercisesComponent },
  { path: 'my_exams', component: MyExamsComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'rooms', component: GameComponent },
  { path: 'game', component: ShowGameComponent },
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
