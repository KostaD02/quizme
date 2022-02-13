import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './views/homepage/homepage.component';
import { RegisterComponent } from './views/register/register.component';
import { LoginComponent } from './views/login/login.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { CreatequizComponent } from './views/createquiz/createquiz.component';
import { ShowquizComponent } from './views/showquiz/showquiz.component';
import { DisplayQuizComponent } from './views/display-quiz/display-quiz.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create_quiz', component: CreatequizComponent },
  { path: 'show_quiz/:key', component: ShowquizComponent },
  { path: 'show_quiz/:key/:id', component: DisplayQuizComponent },
  { path: '404', component: NotfoundComponent },
  { path: '**', pathMatch: 'full', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
