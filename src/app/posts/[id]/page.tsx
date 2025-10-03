// src/app/posts/[id]/page.tsx
// 상세페이지

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Post } from '@/types';


// Next.js가 페이지 컴포넌트에 props로 전달해주는 params의 타입 정의
interface PostPageProps {
  params: {
    id: string; // URL의 [id] 부분은 항상 문자열(string)로 들어옵니다.
  };
}

export default function PostDetailPage({ params }: PostPageProps) {
  // 1. 게시물 데이터를 저장할 상태
  const [post, setPost] = useState<Post | null>(null);
  // 2. 데이터를 불러오는 중인지 알려주는 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const { id } = params; // 3. URL에서 id 값을 추출합니다.

  // 4. id 값이 바뀔 때마다 실행되어, 해당 id의 게시물 정보를 가져옵니다.
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://localhost:3001/posts/${id}`);
          if (!response.ok) {
            throw new Error('Post not found');
          }
          const data = await response.json();
          setPost(data);
        } catch (error) {
          console.error("Failed to fetch post:", error);
          setPost(null);
        } finally {
          setIsLoading(false); // 성공하든 실패하든 로딩 상태는 종료
        }
      };

      fetchPost();
    }
  }, [id]); // id 값이 바뀔 때마다 이 useEffect를 다시 실행합니다.

  // 5. 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return <main className="p-24 text-center"><h1>로딩 중...</h1></main>;
  }

  // 6. 게시물을 찾지 못했을 때 보여줄 화면
  if (!post) {
    return <main className="p-24 text-center"><h1>게시물을 찾을 수 없습니다.</h1></main>;
  }

  // 7. 성공적으로 게시물을 찾았을 때 보여줄 화면
  return (
    <main className="p-24 max-w-2xl mx-auto">
      <div className="bg-white border rounded-lg">
        <p className="font-bold p-4">{post.author?.username}</p>
        <Image src={post.imageUrl.trim()} alt={post.caption} width={800} height={800} />
        <div className="p-4">
          <p className="font-semibold">{post.likes.length} likes</p>
          <p className="mt-2"><span className="font-semibold">{post.author?.username}</span> {post.caption}</p>
          
          {/* --- 👇 여기가 오늘 추가/수정할 부분입니다 --- */}
          <div className="mt-4 pt-4 border-t">
            <h2 className="font-semibold text-gray-600 mb-2">댓글 ({post.comments.length}개)</h2>
            <div className="space-y-2 text-sm">
              {/* post.comments 배열을 순회하며 각 댓글을 화면에 그립니다. */}
              {post.comments.map(comment => (
                <div key={comment.id}>
                  <span className="font-semibold">{comment.author.username}</span>
                  <span className="ml-2">{comment.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* --- 여기까지 --- */}  

        </div>
      </div>
    </main>
  );
}