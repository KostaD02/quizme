import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomepageComponent } from './views/homepage/homepage.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoaderComponent } from './shared/loader/loader.component';

import { environment } from './../environments/environment.prod';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './module/material.module';
import { CreatequizComponent } from './views/createquiz/createquiz.component';
import { ShowquizComponent } from './views/showquiz/showquiz.component';
import { RotatePhoneComponent } from './shared/rotate-phone/rotate-phone.component';
import { DisplayQuizComponent } from './views/display-quiz/display-quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotfoundComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    LoaderComponent,
    CreatequizComponent,
    ShowquizComponent,
    RotatePhoneComponent,
    DisplayQuizComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
