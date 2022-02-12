import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebasefunctionsService } from 'src/app/services/firebasefunctions.service';
import { SharedFunctionService } from 'src/app/services/sharedfunction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-showquiz',
  templateUrl: './showquiz.component.html',
  styleUrls: ['./showquiz.component.css'],
})
export class ShowquizComponent implements OnInit {
  quizArray: any = [];
  loader: boolean = false;
  sessinId: any;
  baseUrl = 'localhost:4200/';
  constructor(
    private firebaseFunctions: FirebasefunctionsService,
    private router: Router,
    private sharedFunc: SharedFunctionService
  ) {
    this.firebaseFunctions.getQuiz().subscribe((element: any) => {
      element.forEach((item: any) => {
        if (item.uploader_id == sessionStorage.getItem('authKey')) {
          this.quizArray.push(item);
        }
      });
    });
    this.sessinId = sessionStorage.getItem('authKey');
    setTimeout(() => {
      this.checkImagesSRC();
      this.loader = true;
    }, 1500);
  }

  ngOnInit(): void {}

  checkImagesSRC() {
    let quizArray = this.quizArray;
    quizArray.forEach((element: any) => {
      if (element.quizInfo.imgSrc == '') {
        element.quizInfo.imgSrc =
          'https://bitsofco.de/content/images/2018/12/broken-1.png';
      }
    });
    this.quizArray = quizArray;
  }

  view(id: any) {
    this.router.navigateByUrl(this.sessinId + '/' + id);
  }

  delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your quiz has been deleted.', 'success');
        this.firebaseFunctions.deleteQuiz(item);
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
  }
  async share(id: any) {
    let link = this.baseUrl + this.sessinId + '/' + id;
    try {
      const toCopy = link;
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
}
