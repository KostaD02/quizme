import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebasefunctionsService } from 'src/app/services/firebasefunctions.service';
import { SharedFunctionService } from 'src/app/services/sharedfunction.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private sharedFuncs: SharedFunctionService,
    private firebaseFunctions: FirebasefunctionsService,
    private router: Router
  ) {}
  disabled: boolean = false;
  ngOnInit(): void {}
  checkUserValid(form: NgForm) {
    let email = form.value.email;
    let name = form.value.name;
    let lastname = form.value.lastName;
    let password = form.value.password;
    let passwordRepeat = form.value.passwordRepeat;
    if (
      email == '' ||
      password == '' ||
      name == '' ||
      lastname == '' ||
      passwordRepeat == ''
    ) {
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
    if (password !== passwordRepeat) {
      this.sharedFuncs.displayToast('Password must be same', 'error', 'red');
      form.reset();
      return;
    } else {
      this.disabled = true;
      this.sharedFuncs.displayToast(
        'User successfully created!',
        'success',
        'green'
      );
      let user = {
        name: name,
        lastname: lastname,
        email: email,
        password: password,
        userType: 'guest',
        approved: false,
      };
      this.firebaseFunctions.createUser(user);
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 1500);
    }
  }
  onSubmit(form: NgForm) {
    this.checkUserValid(form);
  }
}
