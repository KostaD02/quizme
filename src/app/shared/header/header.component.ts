import { FirebasefunctionsService } from './../../services/firebasefunctions.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctionService } from 'src/app/services/sharedfunction.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthorized: boolean = false;
  urlString: string = '/';
  user: any;
  constructor(
    private router: Router,
    private firebaseFunctions: FirebasefunctionsService,
    private sharedFunctions: SharedFunctionService
  ) {
    this.sharedFunctions.isUserAuth();
    let id = sessionStorage.getItem('authKey');
    if (id) {
      this.firebaseFunctions.getUsersId(id).subscribe((element) => {
        this.user = element;
      });
      this.isAuthorized = true;
    }
  }
  ngOnInit(): void {}
}
