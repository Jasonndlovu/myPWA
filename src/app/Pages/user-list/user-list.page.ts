import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { Auth, User, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
  standalone: true,
  imports: [IonButtons, IonLabel, IonAvatar, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton]
})
export class UsersListPage implements OnInit {
  users$: Observable<any[]>;
  currentUser: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    const usersRef = collection(firestore, 'users');
    this.users$ = collectionData(usersRef, { idField: 'id' });

    // Get current user asynchronously
    authState(this.auth).subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {}

  startChat(user: any) {
    if (this.currentUser) {
      this.router.navigate([`/chat/${this.currentUser.uid}-${user.uid}`]);
    }
  }
}
