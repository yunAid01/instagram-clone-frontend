// src/app/page.tsx

'use client'; 

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard'; // 👈 1. 우리가 만든 PostCard 컴포넌트를 import!

interface Post {
  id: number;
  caption: string;
  imageUrl: string;
  authorId: number;
  author: { // 👈 author 객체 추가
    id: number;
    username: string;
  };
  likes: any[]; // 👈 likes 배열도 추가 (일단 간단하게 any 타입으로)
}


export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // ... (fetch 로직은 동일) ...
      const response = await fetch('http://localhost:3001/posts');
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <main className="p-24">
      <h1 className="text-4xl font-bold">인스타그램 클론 피드</h1>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 👇 2. posts 배열을 순회하며 PostCard 컴포넌트를 조립합니다. */}
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}