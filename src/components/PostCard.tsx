// src/components/PostCard.tsx
import Image from "next/image";
import Link from "next/link"; // 👈 1. Link 컴포넌트 import


// Post 데이터의 타입을 정의합니다.
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

// 이 컴포넌트가 받을 'props'의 타입을 정의합니다.
interface PostCardProps  {
  post: Post;
}

// 'props'를 통해 post 데이터를 받아 화면을 그립니다.
export default function PostCard({ post }: PostCardProps) {
  return (
   <Link href={`/posts/${post.id}`} className="block p-4 border rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow">
      <p className="font-bold mb-2">{post.author.username}</p> 
      <Image src={post.imageUrl.trim()} alt={post.caption} width={500} height={500} className="w-full h-auto" />
      <p className="mt-2 text-sm">{post.caption}</p>
      <p className="mt-2 text-xs font-semibold text-gray-600">
        좋아요 {post.likes.length}개
      </p>
    </Link>
  );
}