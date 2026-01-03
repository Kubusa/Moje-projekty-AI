
export interface RestaurantData {
  nazwa: string;
  adres: string;
  godziny: string;
  menu: string;
  telefon: string;
  link: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ChatState = 'configuring' | 'chatting';
