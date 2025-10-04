// src/app/posts/[id]/edit/page.tsx

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { token, userId } = useAuth();
  const { id: postId } = params;

  // 1. 페이지가 로딩될 때, 수정할 게시물의 기존 데이터를 불러옵니다.
  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}`);
        if (response.ok) {
          const post = await response.json();
          // (인가 체크) 불러온 게시물의 작성자가 현재 로그인한 사용자인지 확인
          if (post.authorId !== userId) {
            alert('수정 권한이 없습니다.');
            router.push(`/posts/${postId}`);
            return;
          }
          setImageUrl(post.imageUrl);
          setCaption(post.caption);
        }
        setIsLoading(false);
      };
      fetchPostData();
    }
  }, [postId, userId, router]);

  // 2. '수정 완료' 버튼 클릭 시 실행될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PATCH', // 👈 POST가 아닌 PATCH 메서드 사용
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl, caption }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      alert('게시물이 성공적으로 수정되었습니다!');
      router.push(`/posts/${postId}`); // 수정 후, 상세 페이지로 다시 돌아갑니다.
    } catch (error) {
      alert('게시물 수정에 실패했습니다.');
    }
  };

  if (isLoading) return <main className="p-24 text-center"><h1>데이터를 불러오는 중...</h1></main>;

  return (
    <main className="p-24">
      <h1 className="text-4xl font-bold">게시물 수정하기</h1>
      {/* '게시물 작성 페이지'의 폼과 거의 동일한 구조입니다. */}
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 max-w-lg mx-auto">
        <div>
          <label htmlFor="imageUrl" className="block mb-2 font-medium">이미지 주소</label>
          <input
            id="imageUrl" type="text" value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded" required
          />
        </div>
        <div>
          <label htmlFor="caption" className="block mb-2 font-medium">내용</label>
          <textarea
            id="caption" value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 border rounded" rows={4} required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
          수정 완료
        </button>
      </form>
    </main>
  );
}