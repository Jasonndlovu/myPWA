import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, orderBy, query, collectionData, where, getDocs, getDoc, doc, Timestamp, updateDoc, setDoc, limit } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { firstValueFrom } from 'rxjs'; // Add this import
import { collectionGroup } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  // Method to send a message and store it in a chat-specific collection
  async sendMessage(
    message: string,
    senderId: string,
    senderImage: string,
    receiverId: string,
    receiverImage: string
  ) {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    if (!user) {
      console.error('User not authenticated');
      return;
    }
  
    const chatId = this.generateChatId(user.uid, receiverId);
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const chatDocRef = doc(this.firestore, `chats/${chatId}`);
  
    const timestamp = new Date();
  
    const newMessage = {
      text: message,
      senderId: senderId,
      sender: user.displayName || 'Anonymous',
      senderImage: senderImage || 'assets/default-avatar.png',
      receiverId: receiverId,
      receiverImage: receiverImage || 'assets/default-avatar.png',
      timestamp: timestamp,
      participants: [user.uid, receiverId],
    };
  
    // 1. Add the message to the messages subcollection
    await addDoc(messagesRef, newMessage);
  
    // 2. Update or create the main chat document
    const chatSnap = await getDoc(chatDocRef);
  
    const lastMessageData = {
      text: message,
      senderId: senderId,
      timestamp: timestamp,
    };
  
    if (chatSnap.exists()) {
      const existingData = chatSnap.data();
      const existingParticipants = existingData['participants'] || [];
  
      const updatedParticipants = Array.from(new Set([...existingParticipants, user.uid, receiverId]));
  
      await updateDoc(chatDocRef, {
        lastMessage: lastMessageData,
        participants: updatedParticipants,
      });
    } else {
      await setDoc(chatDocRef, {
        participants: [user.uid, receiverId],
        lastMessage: lastMessageData,
      });
    }
  }
  
  async getLastMessage(userId: string) {
    const chatId = this.listenToUserChats(userId);  // Implement logic to generate chatId between two users
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1)); // Get the last message
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const messageDoc = snapshot.docs[0];
      const messageData = messageDoc.data();
      return {
        text: messageData['text'],
        timestamp: messageData['timestamp'],
        senderId: messageData['senderId']
      };
    }
    return null;  // If no messages, return null
  }
  
  
  // Method to get messages between the current user and a chat partner
  getMessages(currentUserId: string, chatPartnerId: string): Observable<any[]> {
    if (!currentUserId || !chatPartnerId) {
      console.warn('Current user ID or chat partner ID is missing');
      return of([]);
    }

    console.log('currentUserId :' + currentUserId)
    console.log('chatPartnerId :' + chatPartnerId)
  
    const chatId = this.generateChatId(currentUserId, chatPartnerId);
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp'));
    return collectionData(q);
  }
  

  // Method to generate a unique chat ID based on user IDs (to ensure chat uniqueness)
  private generateChatId(userId: string, chatPartnerId: string): string {
    const ids = [userId, chatPartnerId].sort(); // Sort IDs to ensure consistency
    return ids.join('_');
  }

  // 🚀 Get users the current user has chatted with
  async getUsersChattedWith(currentUserId: string): Promise<any[]> {
    console.log('[1] Checking chats for user:', currentUserId);
    const usersChattedWith: any[] = [];
    const uniqueUserIds = new Set<string>();
  
    try {
      const chatsRef = collection(this.firestore, 'chats');
      const chatDocs = await getDocs(chatsRef);
      console.log(chatsRef);


      console.log('[2] Total chat containers:', chatDocs.size);
  
      chatDocs.forEach((docSnap) => {
        const chatId = docSnap.id;
        const [userA, userB] = chatId.split('_');
  
        if (userA === currentUserId && userB !== currentUserId) {
          uniqueUserIds.add(userB);
        } else if (userB === currentUserId && userA !== currentUserId) {
          uniqueUserIds.add(userA);
        }
      });
  
      console.log('[3] Unique partners:', Array.from(uniqueUserIds));
  
      for (const userId of uniqueUserIds) {
        const userRef = doc(this.firestore, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          usersChattedWith.push({ uid: userId, ...userSnap.data() });
        }
      }
  
      return usersChattedWith;
  
    } catch (error) {
      console.error('[ERROR] Failed to get chat partners:', error);
      return [];
    }
  }
  


async getChatIdsForUser(currentUserId: string): Promise<string[]> {
  console.log('[1] Getting chat IDs for user:', currentUserId);
  const chatIds = new Set<string>();

  try {
    // 1. Query all messages from all chat threads
    const messagesQuery = query(
      collectionGroup(this.firestore, 'messages'),
      orderBy('timestamp')
    );

    const messageSnaps = await getDocs(messagesQuery);
    console.log('[2] Total messages found:', messageSnaps.size);

    // 2. Extract chatId from each message path and check if user is involved
    messageSnaps.forEach((docSnap) => {
      const pathSegments = docSnap.ref.path.split('/');
      const chatId = pathSegments[1]; // "chats/chatId/messages/docId"
      const [user1, user2] = chatId.split('_');

      if (user1 === currentUserId || user2 === currentUserId) {
        chatIds.add(chatId);
      }
    });

    console.log('[3] Found chat IDs:', Array.from(chatIds));
    return Array.from(chatIds);

  } catch (error) {
    console.error('[ERROR] Failed to get chat IDs:', error);
    return [];
  }
}



listenToUserChats(userId: string): Observable<any[]> {
  const chatsRef = collection(this.firestore, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', userId));

  return collectionData(q, { idField: 'id' }).pipe(
    switchMap((chats: any[]) => {
      const chatObservables = chats.map(async (chat) => {
        const otherUserId = chat.participants.find((id: string) => id !== userId);
        const userRef = doc(this.firestore, 'users', otherUserId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : null;

        return {
          chatId: chat.id,
          otherUserId,
          otherUser: userData,
          senderId: chat.lastMessage?.senderId || null,
          lastMessage: chat.lastMessage?.text || '',
          timestamp: (chat.lastMessage?.timestamp as Timestamp)?.toDate() || null
        };
      });

      return from(Promise.all(chatObservables));
    })
  );
}
  

  
}
