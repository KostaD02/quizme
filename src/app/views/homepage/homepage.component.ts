import { FirebasefunctionsService } from './../../services/firebasefunctions.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  constructor(private firebaseFunctions: FirebasefunctionsService) {}

  ngOnInit(): void {}
}
