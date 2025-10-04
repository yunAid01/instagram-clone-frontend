// src/components/PostCard.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { userId: loggedInUserId, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  useEffect(() => {
    if (loggedInUserId && post.likes) {
      const alreadyLiked = post.likes.some(like => like.userId === loggedInUserId);
      setIsLiked(alreadyLiked);
    }
  }, [post.likes, loggedInUserId]);

  const handleLikeToggle = async () => {
    if (!token) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }

    const method = isLiked ? 'DELETE' : 'POST';
    
    // 낙관적 UI 업데이트
    setIsLiked(!isLiked);
    setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);

    try {
      const response = await fetch(`http://localhost:3001/posts/${post.id}/like`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) { // 요청 실패 시 롤백
        setIsLiked(isLiked);
        setLikeCount(prevCount => isLiked ? prevCount + 1 : prevCount - 1);
        alert("요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  return (
    <div className="border rounded-lg shadow-md bg-white overflow-hidden">
      <Link href={`/profile/${post.author.id}`}>
        <p className="font-bold p-4 hover:underline">{post.author.username}</p>
      </Link>
      <Link href={`/posts/${post.id}`}>
        <Image src={post.imageUrl.trim()} alt={post.caption} width={500} height={500} className="w-full h-auto" />
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <button onClick={handleLikeToggle} className="text-2xl">
            {isLiked ? '❤️' : '🤍'}
          </button>
          <span className="font-semibold text-sm">{likeCount} likes</span>
        </div>
        <p className="text-sm mt-2">
          <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
            {post.author.username}
          </Link>
          <span className="ml-2">{post.caption}</span>
        </p>
      </div>
    </div>
  );
}