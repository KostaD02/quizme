import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebasefunctionsService } from 'src/app/services/firebasefunctions.service';
import { SharedFunctionService } from 'src/app/services/sharedfunction.service';
import { MatTableDataSource } from '@angular/material/table';

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
  userData: any = [];
  state: string = '';
  oldData: any = {
    name: '',
    startTime: {},
    endTime: {},
  };
  displayedColumns: string[] = [
    'position',
    'name',
    'lastname',
    'email',
    'mark',
    'answeres',
  ];
  dataSource: any;
  constructor(
    private firebaseFunctions: FirebasefunctionsService,
    private router: Router,
    private sharedFunc: SharedFunctionService
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit(): void {
    this.getData();
    let URL = window.location.href.split('/');
    this.key = URL[4];
    this.id = URL[5];
    let id = sessionStorage.getItem('authKey');
    this.firebaseFunctions.getQuizId(this.id).subscribe((element: any) => {
      this.quizDetail = element;
      this.oldData.name = element.quiz_name;
      let tempStartTime = element.quizInfo.date[0].split(' ');
      let tempEndTime = element.quizInfo.date[1].split(' ');
      let tempMonthStart = this.convertMonthToInt(tempStartTime[1]);
      let tempMonthEnd = this.convertMonthToInt(tempEndTime[1]);
      this.oldData.startTime = new Date(
        `${tempStartTime[3]}-${tempMonthStart}-${
          tempStartTime[2].split(' ')[0]
        }`
      );
      this.oldData.endTime = new Date(
        `${tempEndTime[3]}-${tempMonthEnd}-${tempEndTime[2].split(' ')[0]}`
      );
    });
    if (id) {
      if (id == this.key) {
        this.isOwner = true;
        setTimeout(() => {
          let ELEMENT_DATA = this.fillTableData();
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        }, 1000);
      }
    }
    setTimeout(() => {
      this.loader = true;
      if (this.quizDetail == undefined) {
        this.isEmpty = true;
        this.router.navigateByUrl('404');
        return;
      }
      if (this.quizDetail.answeredQuiz) {
        if (this.isAnswered()) {
          this.alreadyAnswered = true;
          return;
        }
      }
      let state = this.isTimePassed(
        this.quizDetail.quizInfo.date[0],
        this.quizDetail.quizInfo.date[1]
      );
      let date = this.quizDetail.quizInfo.date;
      let tempStartDate = date[0].split(' ');
      let tempEndDate = date[1].split(' ');
      tempStartDate.length = 4;
      tempEndDate.length = 4;
      tempStartDate = tempStartDate.join(' ');
      tempEndDate = tempEndDate.join(' ');
      this.date = [tempStartDate, tempEndDate];
      if (state == 'early' || state == 'late') {
        this.available = true;
        this.state = state;
        return;
      }
    }, 2000);
  }
  update(form: NgForm) {
    let data = form.value;
    if (
      this.oldData.name == data.quiz_name ||
      this.oldData.startTime == data.startDate ||
      this.oldData.endTime == data.endDate
    ) {
      console.log('rame sheicvala');
    }
  }
  fillTableData() {
    let dataArray = this.quizDetail.answeredQuiz;
    let returnArray: any = [];
    dataArray.forEach((element: any, index: number) => {
      returnArray.push({
        position: index + 1,
        name: element.name,
        lastname: element.lastName,
        email: element.email,
        mark: element.mark,
        answeres: element.answeres,
      });
    });
    return returnArray;
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
      ip: this.userData.ip_address,
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
    if (this.isSameEmail(form.value.email)) {
      this.sharedFunc.displayToast(
        `${form.value.email} Already answered quiz`,
        'error',
        'red'
      );
      setTimeout(() => {
        location.reload();
      }, 1000);
      return;
    } else {
      setTimeout(() => {
        let update = this.calcMark(this.quizDetail, formData);
        this.firebaseFunctions.upadteQuiz(update);
        this.generateMark = true;
        this.sharedFunc.displayToast('You finished quiz', 'success', 'green');
      }, 2000);
    }
  }

  getData() {
    let apiKey = '1be9a6884abd4c3ea143b59ca317c6b2';
    fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=' + apiKey)
      .then((response) => response.json())
      .then((data) => {
        this.userData = data;
      });
  }

  isAnswered() {
    let myIp = this.userData.ip_address;
    let answered = false;
    this.quizDetail.answeredQuiz.forEach((element: any) => {
      if (element.ip == myIp) {
        answered = true;
        return;
      }
    });
    return answered;
  }

  isSameEmail(email: string) {
    let isSame = false;
    if (!this.quizDetail.answeredQuiz) return false;
    this.quizDetail.answeredQuiz.forEach((element: any) => {
      if (element.email == email) {
        isSame = true;
        return;
      }
    });
    return isSame;
  }

  convertMonthToInt(inputedMonth: string) {
    if (inputedMonth == 'Jan') {
      return 1;
    } else if (inputedMonth == 'Feb') {
      return 2;
    } else if (inputedMonth == 'Mar') {
      return 3;
    } else if (inputedMonth == 'Apr') {
      return 4;
    } else if (inputedMonth == 'May') {
      return 5;
    } else if (inputedMonth == 'Jun') {
      return 6;
    } else if (inputedMonth == 'Jul') {
      return 7;
    } else if (inputedMonth == 'Aug') {
      return 8;
    } else if (inputedMonth == 'Sep') {
      return 9;
    } else if (inputedMonth == 'Oct') {
      return 10;
    } else if (inputedMonth == 'Nov') {
      return 11;
    } else if (inputedMonth == 'Dec') {
      return 12;
    } else {
      this.sharedFunc.displayToast('Month convert error', 'erorr', 'red');
      return 1;
    }
  }

  isTimePassed(startTime: string, endTime: string) {
    let currentDate = new Date();
    let date = ['', 0, ''];
    date[0] = currentDate.getDate().toString();
    date[1] = currentDate.getMonth() + 1;
    date[2] = currentDate.getFullYear().toString();
    let splitedStartTime = startTime.split(' ');
    let splitedEndTime = endTime.split(' ');
    if (splitedStartTime[3] > date[2]) {
      return 'early';
    } else if (splitedStartTime[3] == date[2]) {
      let startMonthInt = this.convertMonthToInt(splitedStartTime[1]);
      let endMonthInt = this.convertMonthToInt(splitedEndTime[1]);
      if (startMonthInt > date[1]) {
        return 'early';
      } else if (endMonthInt < date[1]) {
        return 'late';
      } else {
        if (splitedStartTime[2] > date[0]) {
          return 'early';
        } else if (splitedEndTime[2] < date[0]) {
          return 'late';
        } else {
          return 'correct';
        }
      }
    } else if (splitedEndTime[3] < date[2]) {
      return 'late';
    } else {
      return 'correct';
    }
  }
  viewFullImage() {
    let imgSrc = this.quizDetail.quizInfo.imgSrc;
    this.sharedFunc.viewImage(imgSrc, 'Background image', 'Background image');
  }
}
