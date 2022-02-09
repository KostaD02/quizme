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
    image: string = '',
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
      nickname: user.nickname,
      password: user.password,
      userType: userType,
      image: image,
      approved: approved,
    });
  }
}
