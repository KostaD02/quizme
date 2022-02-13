import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  docData,
  doc,
} from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, updateDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { User } from '../../app/module/user-module';

@Injectable({
  providedIn: 'root',
})
export class FirebasefunctionsService {
  constructor(private fireStore: Firestore) {}
  getUsers() {
    const usersRef = collection(
      this.fireStore,
      environment.firebaseCollections.users
    );
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }
  getUsersId(id: any) {
    const usersRef = doc(
      this.fireStore,
      `${environment.firebaseCollections.users}/${id}`
    );
    return docData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }
  createUser(user: User) {
    const usersRef = collection(
      this.fireStore,
      environment.firebaseCollections.users
    );
    return addDoc(usersRef, user);
  }
  deleteUser(user: User) {
    const usersRef = doc(
      this.fireStore,
      `${environment.firebaseCollections.users}/${user.id}`
    );
    return deleteDoc(usersRef);
  }
  updateUser(
    user: User,
    userType: string = 'guest',
    approved: boolean = false
  ) {
    const usersRef = doc(
      this.fireStore,
      `${environment.firebaseCollections.users}/${user.id}`
    );
    return updateDoc(usersRef, {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      userType: userType,
      approved: approved,
    });
  }
  getQuiz() {
    const quizRef = collection(
      this.fireStore,
      environment.firebaseCollections.quiz
    );
    return collectionData(quizRef, { idField: 'id' }) as Observable<User[]>;
  }
  getQuizId(id: any) {
    const quizRef = doc(
      this.fireStore,
      `${environment.firebaseCollections.quiz}/${id}`
    );
    return docData(quizRef, { idField: 'id' }) as Observable<User[]>;
  }
  createQuiz(data: any) {
    const quizRef = collection(
      this.fireStore,
      environment.firebaseCollections.quiz
    );
    return addDoc(quizRef, data);
  }
  deleteQuiz(data: any) {
    const quizRef = doc(
      this.fireStore,
      `${environment.firebaseCollections.quiz}/${data.id}`
    );
    return deleteDoc(quizRef);
  }
  upadteQuiz(data: any) {
    const quizRef = doc(
      this.fireStore,
      `${environment.firebaseCollections.quiz}/${data.id}`
    );
    return updateDoc(quizRef, {
      questions: data.questions,
      quizInfo: data.quizInfo,
      quiz_name: data.quiz_name,
      uploader_id: data.uploader_id,
      answeredQuiz: data.answeredQuiz,
    });
  }
}
