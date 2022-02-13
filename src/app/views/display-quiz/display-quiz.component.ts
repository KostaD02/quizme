import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebasefunctionsService } from 'src/app/services/firebasefunctions.service';
import { SharedFunctionService } from 'src/app/services/sharedfunction.service';

@Component({
  selector: 'app-display-quiz',
  templateUrl: './display-quiz.component.html',
  styleUrls: ['./display-quiz.component.css'],
})
export class DisplayQuizComponent implements OnInit {
  key: string = '';
  id: string = '';
  isOwner: boolean = false;
  loader: boolean = false;
  alreadyAnswered: boolean = false;
  available: boolean = false;
  quizDetail: any = [];
  date: any = [];
  isEmpty: boolean = false;
  result: boolean = false;
  generateMark: boolean = false;
  hold: boolean = false;
  resultData: any = [];
  constructor(
    private firebaseFunctions: FirebasefunctionsService,
    private router: Router,
    private sharedFunc: SharedFunctionService
  ) {}

  ngOnInit(): void {
    let URL = window.location.href.split('/');
    this.key = URL[4];
    this.id = URL[5];
    let id = sessionStorage.getItem('authKey');
    if (id) {
      if (id == this.key) {
        this.isOwner = true;
      }
    }
    this.firebaseFunctions.getQuizId(this.id).subscribe((element: any) => {
      this.quizDetail = element;
    });
    setTimeout(() => {
      this.loader = true;
      if (this.quizDetail == undefined) {
        this.isEmpty = true;
        return;
      }
      let date = this.quizDetail.quizInfo.date;
      let tempStartDate = date[0].split(' ');
      let tempEndDate = date[1].split(' ');
      tempStartDate.length = 4;
      tempEndDate.length = 4;
      tempStartDate = tempStartDate.join(' ');
      tempEndDate = tempEndDate.join(' ');
      this.date = [tempStartDate, tempEndDate];
    }, 1500);
  }

  calcMark(quizData: any, answeredData: any) {
    let lengthQuestions = quizData.questions.length;
    let answeredArray = [];
    let sum = 0;

    for (let i = 0; i < lengthQuestions; i++) {
      answeredArray.push(answeredData[i]);
    }
    answeredArray.forEach((element: any, index: number) => {
      if (element == quizData.questions[index].correctAnswer) {
        sum++;
      }
    });

    let newObj = {
      mark: sum,
      name: answeredData.name,
      lastName: answeredData.lastname,
      email: answeredData.email,
      answeres: answeredArray,
    };
    let answered;
    if (quizData.answeredQuiz) {
      answered = quizData.answeredQuiz;
      answered.push(newObj);
    } else {
      answered = [newObj];
    }
    this.resultData = [answeredData.name, sum];

    let newUploadData = {
      questions: quizData.questions,
      quizInfo: quizData.quizInfo,
      quiz_name: quizData.quiz_name,
      uploader_id: quizData.uploader_id,
      answeredQuiz: answered,
      id: this.id,
    };
    return newUploadData;
  }

  onSubmit(form: NgForm) {
    this.hold = true;
    setTimeout(() => {
      this.result = true;
    }, 1000);
    let formData = form.value;
    setTimeout(() => {
      let update = this.calcMark(this.quizDetail, formData);
      this.firebaseFunctions.upadteQuiz(update);
      this.generateMark = true;
      this.sharedFunc.displayToast('You finished quiz', 'success', 'green');
    }, 2000);
  }
}
