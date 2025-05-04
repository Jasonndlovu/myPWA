import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, IonInput, IonList, IonItem, IonButtons, IonBackButton, IonItemGroup, IonFabButton, IonIcon, IonSpinner, IonAvatar } from '@ionic/angular/standalone';
import { ChatService } from './../../../services/chat.service';
import { AuthService } from './../../../services/auth.service';
import { Observable, firstValueFrom, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';
import { GlobalBackgroundComponent } from "../../components/global-background/global-background.component";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonAvatar, IonBackButton, IonButtons,
    IonItem, IonList, IonFooter, IonButton, IonInput, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule,
    GlobalBackgroundComponent
]
})
export class ChatPage implements OnInit {
  messages$!: Observable<any[]>;
  newMessage = '';
  currentUserId: string = '';
  currentUserImage: string = '';
  chatPartnerId: string = ''; // Required for filtering messages
  chatPartnerName: string = 'Chat Partner';
  chatPartnerImage: string = '';

  constructor(private route: ActivatedRoute,private chatService: ChatService, private authService: AuthService) {}

  async ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('chatId') || '';
    
    // Get the combined user IDs from the route parameter
    
    console.log(chatId);

  
  // Log to check if the ID is correctly extracted
  console.log('chatPartnerId from route:', chatId);
    // If chatPartnerId is valid, split it to get both user IDs
  if (chatId) {
    const [currentUserId, partnerId] = chatId.split('-');
    
    // Log the split IDs
    console.log('Current User ID:', currentUserId);
    console.log('Chat Partner ID:', partnerId);

    // Use the IDs for further processing (e.g., loading messages)
    this.currentUserId = currentUserId;
    this.chatPartnerId = partnerId;
    this.loadMessages();
    console.log(this.messages$);
  } else {
    console.warn('Chat partner ID is missing.');
  }

  
  }

  // Load chat partner's image from the database (assuming it's stored in 'users' collection)
  // async loadChatPartnerImage(chatPartnerId: string) {
  //   try {
  //     const userDocRef = this.firestore.collection('users').doc(chatPartnerId); // Correct Firestore collection reference
  //     const userDocSnap = await userDocRef.get().toPromise();
      
  //     if (userDocSnap.exists) {
  //       const userData = userDocSnap.data();
  //       this.chatPartnerImage = userData?.photoURL || 'https://i.pravatar.cc/325'; // Set image or fallback
  //     }
  //   } catch (error) {
  //     console.error('Error loading chat partner image:', error);
  //     this.chatPartnerImage = 'https://i.pravatar.cc/325';  // Fallback to default
  //   }
  // }

  async loadCurrentUser() {
    try {
      const user = await firstValueFrom(this.authService.getCurrentUser());
      if (user) {
        this.currentUserId = user.uid;
        this.currentUserImage = user.photoURL || '';
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  loadMessages() {
    console.log(this.currentUserId, ' and ', this.chatPartnerId)

    if (!this.currentUserId || !this.chatPartnerId) {
      console.warn('Current user ID or chat partner ID is missing');
      // Instead of returning null, initialize messages$ with an empty observable
      this.messages$ = of([]);  // Return an empty observable
      return;
    }
    this.messages$ = this.chatService.getMessages(this.currentUserId, this.chatPartnerId);
  }

  // sendMessage() {
  //   if (this.newMessage.trim() !== '') {
  //     this.chatService.sendMessage(this.newMessage, this.chatPartnerId, this.currentUserImage)
  //       .then(() => this.newMessage = '')
  //       .catch(error => console.error('Error sending message:', error));
  //   }
  // }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      const messageData = {
        text: this.newMessage,
        senderId: this.currentUserId,
        senderImage: this.currentUserImage,
        receiverId: this.chatPartnerId,  // Make sure this is set
        receiverImage: this.chatPartnerImage, // Ensure receiver's image is stored
        timestamp: new Date().toISOString(),
      };
  
      this.chatService.sendMessage(messageData.text, 
        messageData.senderId, 
        messageData.senderImage, 
        messageData.receiverId, 
        messageData.receiverImage)
        .then(() => {
          this.newMessage = '';  // Clear input after sending
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  }
  
}
