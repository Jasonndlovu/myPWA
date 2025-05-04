import { Component, OnInit,OnDestroy , ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, PopoverController, ModalController, IonToolbar, IonButtons, IonBackButton, IonIcon, IonList, IonItem, IonAvatar, IonLabel, IonText, IonFab, IonFabButton, IonModal, IonButton, IonListHeader } from '@ionic/angular/standalone';
import { Observable,Subscription } from 'rxjs';
import { ChatService } from './../../../services/chat.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { GlobalBackgroundComponent } from "../../components/global-background/global-background.component";


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.page.html',
  styleUrls: ['./messenger.page.scss'],
  standalone: true,
  imports: [IonListHeader, IonText, IonLabel, IonAvatar, IonItem, IonList, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, GlobalBackgroundComponent]
})
export class MessengerPage implements OnInit, OnDestroy  {
  chatUsers: any[] = [];
  isLoading: boolean = true;  // Added loading state
  user: User | null = null; // Store the logged-in user
  otherUser: User | null = null; // Store the logged-in user 
  userID!: string;
  chatSubscription!: Subscription;
  chatList: any[] = [];
  lastMessage: any[] = [];
  constructor(private router: Router, private chatService: ChatService,private auth: Auth,private firestore: Firestore) {}

  async ngOnInit() {

    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.userID = user.uid;

        this.chatSubscription = this.chatService.listenToUserChats(this.userID).subscribe(chats => {
          this.chatList = chats;
        });
      }
    });


    this.loadChatUsers();


    // Optional Debug Helper
    //this.listChatCollections();
  }


  ngOnDestroy() {
    if (this.chatSubscription) this.chatSubscription.unsubscribe();
  }
  
  

  async loadChatUsers() {
    try {
      this.isLoading = true;  // Show loading state
      
      this.auth.onAuthStateChanged(async user => {
        if (user) {
          this.user = user; // Assign the logged-in user details
          this.userID = user.uid;
  
          // Get the list of users chatted with
          this.chatUsers = await this.chatService.getUsersChattedWith(this.userID);
          
          // For each user, get the last message and store it with their info
          for (const chatUser of this.chatUsers) {
            // Fetch the last message for each user
            const lastMessage = await this.chatService.getLastMessage(chatUser.id);
  
            // Add the last message and timestamp to the chatUser object
            chatUser.lastMessage = lastMessage || { text: 'No message', timestamp: null };
          }
        } else {
          console.log("No user is logged in.");
        }
      });
  
    } catch (error) {
      console.error("Error loading chat users: ", error);
    } finally {
      this.isLoading = false;  // Hide loading state once data is loaded
    }
  }
  
  

  openChat(user: any) {

    console.log(user)
    if (this.user) {
      this.router.navigate([`/chat/${this.user.uid}-${user.otherUserId}`]);
    }
  }


    // 🔍 Helper to list chatIds
    async listChatCollections() {
      const chatsRef = collection(this.firestore, 'chats');
      const chatDocs = await getDocs(chatsRef);
      console.log(chatDocs);
      const chatIds: string[] = [];
  
      chatDocs.forEach(doc => {
        chatIds.push(doc.id);
      });
  
      console.log('Chat IDs:', chatIds);
    }
}
