import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebasefunctionsService } from 'src/app/services/firebasefunctions.service';
import { SharedFunctionService } from 'src/app/services/sharedfunction.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  usersArray: any = [];
  disabled: boolean = false;
  constructor(
    private sharedFuncs: SharedFunctionService,
    private firebaseFunctions: FirebasefunctionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.firebaseFunctions.getUsers().subscribe((element) => {
      this.usersArray = element;
    });
  }
  checkUserValid(form: NgForm) {
    let email = form.value.email;
    let password = form.value.password;
    if (email == '' || password == '') {
      this.sharedFuncs.displayToast("Inputs can't be empty!", 'error', 'red');
      form.reset();
      return;
    }
    const regexForEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    let isValidEmail = regexForEmail.test(email);
    if (!isValidEmail) {
      this.sharedFuncs.displayToast('Email format is wrong!', 'error', 'red');
      form.reset();
      return;
    }
    let tempArray = this.usersArray;
    let validEmail = false;
    let validPassword = false;
    let user = { id: 'temp' };
    tempArray.forEach((element: any) => {
      if (element.email === email) {
        validEmail = true;
      }
      if (element.password === password) {
        validPassword = true;
      }
      if (validEmail && validPassword) {
        user = element;
        return;
      }
      validEmail = false;
      validPassword = false;
    });
    if (validEmail && validPassword) {
      this.disabled = true;
      this.sharedFuncs.displayToast(
        'Authorized successfully',
        'success',
        'green'
      );
      sessionStorage.setItem('authKey', user.id);
      setTimeout(() => {
        this.router.navigateByUrl('/');
        location.reload();
      }, 1500);
    } else {
      this.sharedFuncs.displayToast('Incorrect user', 'error', 'red');
      form.reset();
      return;
    }
  }
  onSubmit(form: NgForm) {
    this.checkUserValid(form);
  }
}
