import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
  messageType: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastActivity: Timestamp;
  unreadCount: { [userId: string]: number };
  createdAt: Timestamp;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class MessagingService {
  private readonly MESSAGES_COLLECTION = 'messages';
  private readonly CONVERSATIONS_COLLECTION = 'conversations';
  private readonly CONNECTIONS_COLLECTION = 'connections';

  /**
   * Send a message
   */
  async sendMessage(
    senderId: string, 
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'file' = 'text',
    fileUrl?: string,
    fileName?: string
  ): Promise<Message | null> {
    try {
      // Get or create conversation
      const conversationId = await this.getOrCreateConversation(senderId, receiverId);
      
      const messageData = {
        conversationId,
        senderId,
        receiverId,
        content,
        timestamp: Timestamp.now(),
        read: false,
        messageType,
        ...(fileUrl && { fileUrl }),
        ...(fileName && { fileName })
      };

      const docRef = await addDoc(collection(db, this.MESSAGES_COLLECTION), messageData);
      
      // Update conversation with last message
      await this.updateConversationLastMessage(conversationId, {
        id: docRef.id,
        ...messageData
      });

      return {
        id: docRef.id,
        ...messageData
      };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return null;
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, limitCount: number = 50): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.MESSAGES_COLLECTION),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as Message);
      });

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Get user conversations
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(
        collection(db, this.CONVERSATIONS_COLLECTION),
        where('participants', 'array-contains', userId),
        orderBy('lastActivity', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const conversations: Conversation[] = [];

      querySnapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data()
        } as Conversation);
      });

      return conversations;
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      return [];
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.MESSAGES_COLLECTION),
        where('conversationId', '==', conversationId),
        where('receiverId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();

      // Update conversation unread count
      const conversationRef = doc(db, this.CONVERSATIONS_COLLECTION, conversationId);
      await updateDoc(conversationRef, {
        [`unreadCount.${userId}`]: 0
      });
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  }

  /**
   * Send connection request
   */
  async sendConnectionRequest(senderId: string, receiverId: string, message?: string): Promise<boolean> {
    try {
      // Check if connection already exists
      const existingConnection = await this.getConnectionStatus(senderId, receiverId);
      if (existingConnection) {
        throw new Error('Connection request already exists');
      }

      const requestData = {
        senderId,
        receiverId,
        status: 'pending' as const,
        message: message || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, this.CONNECTIONS_COLLECTION), requestData);
      return true;
    } catch (error) {
      console.error('❌ Error sending connection request:', error);
      return false;
    }
  }

  /**
   * Respond to connection request
   */
  async respondToConnectionRequest(requestId: string, response: 'accepted' | 'rejected'): Promise<boolean> {
    try {
      const requestRef = doc(db, this.CONNECTIONS_COLLECTION, requestId);
      await updateDoc(requestRef, {
        status: response,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('❌ Error responding to connection request:', error);
      return false;
    }
  }

  /**
   * Get connection requests for a user
   */
  async getConnectionRequests(userId: string, type: 'sent' | 'received' = 'received'): Promise<ConnectionRequest[]> {
    try {
      const field = type === 'sent' ? 'senderId' : 'receiverId';
      const q = query(
        collection(db, this.CONNECTIONS_COLLECTION),
        where(field, '==', userId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const requests: ConnectionRequest[] = [];

      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        } as ConnectionRequest);
      });

      return requests;
    } catch (error) {
      console.error('❌ Error fetching connection requests:', error);
      return [];
    }
  }

  /**
   * Get user connections
   */
  async getUserConnections(userId: string): Promise<string[]> {
    try {
      const q1 = query(
        collection(db, this.CONNECTIONS_COLLECTION),
        where('senderId', '==', userId),
        where('status', '==', 'accepted')
      );

      const q2 = query(
        collection(db, this.CONNECTIONS_COLLECTION),
        where('receiverId', '==', userId),
        where('status', '==', 'accepted')
      );

      const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      const connections: string[] = [];

      snapshot1.forEach((doc) => {
        const data = doc.data();
        connections.push(data.receiverId);
      });

      snapshot2.forEach((doc) => {
        const data = doc.data();
        connections.push(data.senderId);
      });

      return [...new Set(connections)]; // Remove duplicates
    } catch (error) {
      console.error('❌ Error fetching user connections:', error);
      return [];
    }
  }

  /**
   * Get connection status between two users
   */
  async getConnectionStatus(userId1: string, userId2: string): Promise<ConnectionRequest | null> {
    try {
      const q1 = query(
        collection(db, this.CONNECTIONS_COLLECTION),
        where('senderId', '==', userId1),
        where('receiverId', '==', userId2)
      );

      const q2 = query(
        collection(db, this.CONNECTIONS_COLLECTION),
        where('senderId', '==', userId2),
        where('receiverId', '==', userId1)
      );

      const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      
      if (!snapshot1.empty) {
        const doc = snapshot1.docs[0];
        return { id: doc.id, ...doc.data() } as ConnectionRequest;
      }
      
      if (!snapshot2.empty) {
        const doc = snapshot2.docs[0];
        return { id: doc.id, ...doc.data() } as ConnectionRequest;
      }

      return null;
    } catch (error) {
      console.error('❌ Error checking connection status:', error);
      return null;
    }
  }

  /**
   * Get or create conversation between two users
   */
  private async getOrCreateConversation(userId1: string, userId2: string): Promise<string> {
    try {
      // Check if conversation exists
      const q = query(
        collection(db, this.CONVERSATIONS_COLLECTION),
        where('participants', 'array-contains', userId1)
      );

      const querySnapshot = await getDocs(q);
      let existingConversation: string | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(userId2)) {
          existingConversation = doc.id;
        }
      });

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const conversationData = {
        participants: [userId1, userId2],
        lastActivity: Timestamp.now(),
        unreadCount: {
          [userId1]: 0,
          [userId2]: 0
        },
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.CONVERSATIONS_COLLECTION), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error getting/creating conversation:', error);
      throw error;
    }
  }

  /**
   * Update conversation with last message
   */
  private async updateConversationLastMessage(conversationId: string, message: Message): Promise<void> {
    try {
      const conversationRef = doc(db, this.CONVERSATIONS_COLLECTION, conversationId);
      await updateDoc(conversationRef, {
        lastMessage: message,
        lastActivity: message.timestamp,
        [`unreadCount.${message.receiverId}`]: 1 // Increment unread count for receiver
      });
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
    }
  }

  /**
   * Subscribe to real-time messages
   */
  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void): () => void {
    const q = query(
      collection(db, this.MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as Message);
      });
      callback(messages.reverse());
    });
  }

  /**
   * Subscribe to real-time conversations
   */
  subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void): () => void {
    const q = query(
      collection(db, this.CONVERSATIONS_COLLECTION),
      where('participants', 'array-contains', userId),
      orderBy('lastActivity', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const conversations: Conversation[] = [];
      snapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data()
        } as Conversation);
      });
      callback(conversations);
    });
  }
}

export const messagingService = new MessagingService();
export default messagingService;
