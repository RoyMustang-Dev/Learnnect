/**
 * Firebase Migration Utility
 * Backup and restore data when switching Firebase projects
 */

import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

interface BackupData {
  users: any[];
  resumes: any[];
  connections: any[];
  messages: any[];
  conversations: any[];
  notifications: any[];
  profile_analytics: any[];
  timestamp: string;
  projectId: string;
}

class FirebaseMigration {
  
  /**
   * Backup all data from current Firebase project
   */
  async backupAllData(): Promise<BackupData> {
    console.log('🔄 Starting Firebase data backup...');
    
    const backup: BackupData = {
      users: [],
      resumes: [],
      connections: [],
      messages: [],
      conversations: [],
      notifications: [],
      profile_analytics: [],
      timestamp: new Date().toISOString(),
      projectId: 'learnnect-platform' // Current project
    };

    try {
      // Backup each collection
      const collections = [
        'users', 'resumes', 'connections', 'messages', 
        'conversations', 'notifications', 'profile_analytics'
      ];

      for (const collectionName of collections) {
        console.log(`📦 Backing up ${collectionName}...`);
        
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          const data: any[] = [];
          
          querySnapshot.forEach((doc) => {
            data.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          (backup as any)[collectionName] = data;
          console.log(`✅ Backed up ${data.length} documents from ${collectionName}`);
        } catch (error) {
          console.warn(`⚠️ Could not backup ${collectionName}:`, error);
          (backup as any)[collectionName] = [];
        }
      }

      // Save backup to localStorage
      localStorage.setItem('firebase_backup', JSON.stringify(backup));
      
      // Also download as JSON file
      this.downloadBackup(backup);
      
      console.log('✅ Backup completed successfully!');
      return backup;
      
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  /**
   * Restore data to new Firebase project
   */
  async restoreAllData(backup?: BackupData): Promise<boolean> {
    try {
      console.log('🔄 Starting Firebase data restoration...');
      
      // Get backup data
      let backupData = backup;
      if (!backupData) {
        const stored = localStorage.getItem('firebase_backup');
        if (!stored) {
          throw new Error('No backup data found. Please run backup first.');
        }
        backupData = JSON.parse(stored);
      }

      // Restore each collection
      const collections = [
        'users', 'resumes', 'connections', 'messages', 
        'conversations', 'notifications', 'profile_analytics'
      ];

      for (const collectionName of collections) {
        const data = (backupData as any)[collectionName];
        if (!data || data.length === 0) {
          console.log(`⏭️ Skipping ${collectionName} (no data)`);
          continue;
        }

        console.log(`📥 Restoring ${data.length} documents to ${collectionName}...`);
        
        for (const item of data) {
          try {
            const { id, ...docData } = item;
            
            // Use the original document ID if possible
            if (id && !id.startsWith('local_')) {
              await setDoc(doc(db, collectionName, id), docData);
            } else {
              await addDoc(collection(db, collectionName), docData);
            }
          } catch (error) {
            console.warn(`⚠️ Could not restore document in ${collectionName}:`, error);
          }
        }
        
        console.log(`✅ Restored ${collectionName}`);
      }

      console.log('✅ Data restoration completed successfully!');
      return true;
      
    } catch (error) {
      console.error('❌ Restoration failed:', error);
      return false;
    }
  }

  /**
   * Download backup as JSON file
   */
  private downloadBackup(backup: BackupData) {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learnnect-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    console.log('💾 Backup file downloaded');
  }

  /**
   * Load backup from uploaded file
   */
  async loadBackupFromFile(file: File): Promise<BackupData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backup = JSON.parse(event.target?.result as string);
          resolve(backup);
        } catch (error) {
          reject(new Error('Invalid backup file format'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  }

  /**
   * Get backup summary
   */
  getBackupSummary(): string | null {
    try {
      const stored = localStorage.getItem('firebase_backup');
      if (!stored) return null;
      
      const backup = JSON.parse(stored);
      const totalDocs = Object.keys(backup)
        .filter(key => Array.isArray(backup[key]))
        .reduce((sum, key) => sum + backup[key].length, 0);
      
      return `Backup from ${backup.timestamp} (${totalDocs} documents)`;
    } catch {
      return null;
    }
  }
}

export const firebaseMigration = new FirebaseMigration();

// Development helpers
if (import.meta.env.DEV) {
  (window as any).backupFirebase = () => firebaseMigration.backupAllData();
  (window as any).restoreFirebase = () => firebaseMigration.restoreAllData();
  console.log('🔧 Migration tools: backupFirebase(), restoreFirebase()');
}
