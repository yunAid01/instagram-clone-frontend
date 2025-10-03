// src/types.ts

export interface Comment {
  id: number;
  text: string;
  author: {
    username: string;
  };
}

export interface Post {
  id: number;
  caption: string;
  imageUrl: string;
  authorId: number; // 👈 authorId를 필수로 포함
  author: {
    id: number;
    username: string;
  };
  likes: any[];
  comments: Comment[];
}