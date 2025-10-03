// src/components/PostCard.tsx
import Image from "next/image";
import Link from "next/link"; // 👈 1. Link 컴포넌트 import
import { Post } from '@/types'; // 👈 types.ts에서 Post 타입을 import!

// 이 컴포넌트가 받을 'props'의 타입을 정의합니다.
interface PostCardProps  {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    // 1. 가장 바깥쪽은 더 이상 Link가 아닌, 일반 div 컨테이너입니다.
    //    카드 전체가 하나의 링크가 되는 대신, 카드라는 '집' 역할을 합니다.
    <div className="border rounded-lg shadow-md bg-white overflow-hidden">
      
      {/* 2. 작성자 이름 부분은 '프로필 페이지'로 가는 독립적인 Link입니다. */}
      <Link href={`/profile/${post.author.id}`}>
        <p className="font-bold p-4 hover:underline">{post.author.username}</p>
      </Link>
      
      {/* 3. 이미지는 '게시물 상세 페이지'로 가는 독립적인 Link입니다. */}
      <Link href={`/posts/${post.id}`}>
        <Image 
          src={post.imageUrl.trim()} 
          alt={post.caption} 
          width={500} 
          height={500} 
          className="w-full h-auto" 
        />
      </Link>
      
      {/* 4. 내용과 좋아요 부분은 카드(div)의 일부일 뿐, 링크가 아닙니다. */}
      <div className="p-4">
        {/* 상세 페이지로 가는 링크를 내용에도 추가하고 싶다면, 이 부분도 Link로 감쌀 수 있습니다. */}
        <p className="text-sm">
          <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
            {post.author.username}
          </Link>
          <span className="ml-2">{post.caption}</span>
        </p>
        <p className="mt-2 text-xs text-gray-500">
          좋아요 {post.likes.length}개
        </p>
      </div>
    </div>
  );
}