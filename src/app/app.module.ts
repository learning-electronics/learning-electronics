import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedService } from './shared.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './home/login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { LogedinComponent } from './home/logedin/logedin.component';
import { LogedoutComponent } from './home/logedout/logedout.component';
import { LibraryComponent } from './library/library.component';
import { ProfileComponent } from './profile/profile.component';
import { QuizzComponent } from './quizz/quizz.component';
import { ClassesComponent } from './classes/classes.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { DeleteAccountComponent } from './profile/delete-account/delete-account.component';
import { ShowInfoComponent } from './profile/show-info/show-info.component';
import { ShowPhotoComponent } from './profile/show-photo/show-photo.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FaqComponent } from './faq/faq.component';
import { StatisticsComponent } from './profile/statistics/statistics.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatTableModule } from '@angular/material/table';
import { ShowClassComponent } from './classes/show-class/show-class.component';
import { EditPhotoComponent } from './profile/show-photo/edit-photo/edit-photo.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SuccessRegisterComponent } from './success-register/success-register.component';
import { FailedRegisterComponent } from './failed-register/failed-register.component';
import { TermsConditionsComponent } from './register/terms-conditions/terms-conditions.component';
import { RecoverPasswordComponent } from './home/recover-password/recover-password.component';
import { ChangeEmailComponent } from './profile/change-email/change-email.component';
import { GameComponent } from './game/game.component';
import { MatSelectModule } from '@angular/material/select';
import { RoomComponent } from './game/room/room.component';
import { MyExercisesComponent } from './my-exercises/my-exercises.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ManualComponent } from './my-exercises/add-exercise/manual/manual.component';
import { AddExerciseComponent } from './my-exercises/add-exercise/add-exercise.component';
import { EditExerciseComponent } from './my-exercises/edit-exercise/edit-exercise.component';
import { ShowGameComponent } from './game/show-game/show-game.component';
import { MatRadioModule } from '@angular/material/radio';
import { DeleteConfirmationComponent } from './my-exercises/delete-confirmation/delete-confirmation.component';
import { CreateRoomComponent } from './game/create-room/create-room.component';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PopupComponent } from './popup/popup.component';
import { ViewExerciseComponent } from './popup/view-exercise/view-exercise.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageSizeExercisesDirective } from './directive/page-size-exercises.directive';
import { PageSizeClassesDirective } from './directive/page-size-classes.directive';
import { AddClassComponent } from './classes/add-class/add-class.component';
import { AutomaticComponent } from './my-exercises/add-exercise/automatic/automatic.component';
import { ClassPasswordComponent } from './classes/class-password/class-password.component';
import { DesassociateElementComponent } from './classes/desassociate-element/desassociate-element.component';
import { PageSizeClassExsDirective } from './directive/page-size-class-exs.directive';
import { PageSizeClassMembersDirective } from './directive/page-size-class-members.directive';
import { MyExamsComponent } from './my-exams/my-exams.component';
import { AddExamComponent } from './my-exams/add-exam/add-exam.component';
import { DeleteConfirmationExamComponent } from './my-exams/delete-confirmation-exam/delete-confirmation-exam.component';
import { ShowQuizzComponent } from './quizz/show-quizz/show-quizz.component';
import { PageSizeExamsDirective } from './directive/page-size-exams.directive';
import { PageSizeClassExamsDirective } from './directive/page-size-class-exams.directive';
import { EditExamComponent } from './my-exams/edit-exam/edit-exam.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    LogedinComponent,
    LogedoutComponent,
    LibraryComponent,
    ProfileComponent,
    QuizzComponent,
    ClassesComponent,
    ChangePasswordComponent,
    DeleteAccountComponent,
    ShowInfoComponent,
    ShowPhotoComponent,
    FaqComponent,
    StatisticsComponent,
    ShowClassComponent,
    EditPhotoComponent,
    SuccessRegisterComponent,
    FailedRegisterComponent,
    TermsConditionsComponent,
    RecoverPasswordComponent,
    ChangeEmailComponent,
    GameComponent,
    RoomComponent,
    MyExercisesComponent,
    ShowGameComponent,
    ManualComponent,
    AddExerciseComponent,
    EditExerciseComponent,
    DeleteConfirmationComponent,
    CreateRoomComponent,
    PopupComponent,
    ViewExerciseComponent,
    PageSizeExercisesDirective,
    PageSizeClassesDirective,
    AddClassComponent,
    ClassPasswordComponent,
    AutomaticComponent,
    DesassociateElementComponent,
    PageSizeClassExsDirective,
    PageSizeClassMembersDirective,
    MyExamsComponent,
    AddExamComponent,
    DeleteConfirmationExamComponent,
    ShowQuizzComponent,
    PageSizeExamsDirective,
    PageSizeClassExamsDirective,
    EditExamComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    HttpClientModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ImageCropperModule,
    MaterialFileInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatSortModule,
    MatGridListModule,
    MatExpansionModule,
    MatTreeModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    NgCircleProgressModule.forRoot({
      radius: 90,
      outerStrokeWidth: 12,
      innerStrokeWidth: 5,
      titleFontSize: '25',
      subtitleFontSize: '15',
      outerStrokeColor: "#536DFE",
      innerStrokeColor: "#673AB7",
      animationDuration: 300,
      subtitle: "progresso"
    })
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
