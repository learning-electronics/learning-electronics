import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LibraryComponent } from './library/library.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'profile', component: ProfileComponent },
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
