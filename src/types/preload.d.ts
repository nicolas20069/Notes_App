// src/types/preload.d.ts

export interface ElectronAPI {
  on(channel: string, callback: (message: any) => void): void;
  saveNote(note: any): void;
  loadNote(): Promise<any>;
  loadNotes(): Promise<any[]>;
  editNote(note:{id: string; title: string; content: string;date: string}): void;
  deleteNote(id:string): void;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}