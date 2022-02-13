import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class SharedFunctionService {
  constructor(private router: Router) {}
  displayToast(text: string, Icon: string, color: string, time: number = 1500) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: color,
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: Icon as any,
      title: text,
    });
  }
  isUserAuth() {
    let id = sessionStorage.getItem('authKey');
    let currentURL = window.location.href.split('/')[3];
    let showQuizURLLength = window.location.href.split('/').length;
    let check = false;
    if (id) check = true;
    else check = false;
    if (id) {
      if (currentURL == 'login' || currentURL == 'register') {
        this.router.navigateByUrl('/');
      }
    } else {
      if (
        currentURL == 'create_quiz' ||
        (currentURL == 'show_quiz' && showQuizURLLength <= 5 && !check)
      ) {
        this.router.navigateByUrl('/');
      }
    }
  }
  getBaseURL() {
    let URL = window.location.href.split('/');
    return URL[0] + '//' + URL[2] + '/';
  }
}
