import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebasefunctionsService } from 'src/app/services/firebasefunctions.service';
import { SharedFunctionService } from 'src/app/services/sharedfunction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createquiz',
  templateUrl: './createquiz.component.html',
  styleUrls: ['./createquiz.component.css'],
})
export class CreatequizComponent implements OnInit {
  question: FormGroup = this.fb.group({});
  value: number = 10;
  partOne: boolean = false;
  partTwo: boolean = false;
  partThree: boolean = false;
  submitPart: boolean = false;
  final: boolean = false;
  image: string = '';
  successOne: boolean = false;
  successTwo: boolean = false;
  startedUpload: boolean = false;
  showSpiner: boolean = true;
  quizDetail: any = [];
  link: string = 'bla';
  display: boolean = false;
  constructor(
    private fb: FormBuilder,
    private sharedFunc: SharedFunctionService,
    private firebaseFunc: FirebasefunctionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.question = this.fb.group({
      questions: this.fb.array([]),
    });
  }
  get questions() {
    return this.question.get('questions') as FormArray;
  }

  addQuestions() {
    const question = this.fb.group({
      question: [''],
      correctAnswer: [''],
      answerA: [''],
      answerB: [''],
      answerC: [''],
      answerD: [''],
    });
    this.questions.push(question);
  }

  deleteQuestion(i: any) {
    this.questions.removeAt(i);
  }
  submitPartOne(form: NgForm) {
    let partOne = {
      user_id: sessionStorage.getItem('authKey'),
      quiz_name: form.value.quiz_name,
      email: form.value.email,
      imgSrc: this.image,
      date: [form.value.startDate.toString(), form.value.endDate.toString()],
    };
    this.quizDetail.push(partOne);
    this.value += 40;
    this.partOne = true;
    this.partTwo = true;
    this.successOne = true;
  }
  submitPartTwo(myForm: FormGroup) {
    if (myForm.value.questions.length == 0) {
      this.sharedFunc.displayToast(
        'Quiz must have at least one question',
        'warning',
        'yellow'
      );
      return;
    }
    this.quizDetail.push(myForm.value.questions);
    this.value += 40;
    this.partThree = true;
    this.successTwo = true;
    this.final = true;
  }
  async uploadPhoto() {
    const { value: file } = await Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        accept: 'image/*',
        'aria-label': 'Upload background picture',
      },
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        Swal.fire({
          title: 'Your uploaded background picture',
          imageUrl: e.target.result as any,
          imageAlt: 'The uploaded picture',
        });
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  async copy() {
    try {
      const toCopy = this.link;
      await navigator.clipboard.writeText(toCopy);
      this.sharedFunc.displayToast(
        'Link copied successfully',
        'success',
        'green'
      );
    } catch (err) {
      this.sharedFunc.displayToast(`${err}`, 'info', 'blue');
    }
  }
  reset() {
    location.reload();
  }
  startUpload() {
    this.startedUpload = true;
    let counter = 0;
    this.firebaseFunc.createQuiz({
      quiz_name: this.quizDetail[0].quiz_name,
      uploader_id: this.quizDetail[0].user_id,
      quizInfo: this.quizDetail[0],
      questions: this.quizDetail[1],
    });
    let baseUrl = 'localhost:4200/';
    let quiz = { id: 'temp' };
    setTimeout(() => {
      this.firebaseFunc.getQuiz().subscribe((element: any) => {
        element.forEach((item: any) => {
          if (
            item.quiz_name == this.quizDetail[0].quiz_name &&
            item.uploader_id == this.quizDetail[0].user_id
          ) {
            quiz = item;
            counter++;
          }
        });
      });
    }, 1500);
    setTimeout(() => {
      if (counter == 1) {
        this.link = baseUrl + this.quizDetail[0].user_id + '/' + quiz.id;
        this.submitPart = true;
        this.showSpiner = false;
        this.value += 10;
        this.sharedFunc.displayToast(
          'Auto redirect in 10 seconds',
          'info',
          'blue',
          100000
        );
        setTimeout(() => {
          this.router.navigateByUrl(
            `/show_quiz/${sessionStorage.getItem('authKey')}`
          );
        }, 10000);
      } else {
        this.sharedFunc.displayToast(
          'You already uploaded quiz with same name!',
          'error',
          'red',
          3000
        );
        this.firebaseFunc.deleteQuiz(quiz);
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    }, 3000);
  }
}
