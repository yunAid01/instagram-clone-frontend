// src/app/posts/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Post, Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link'; // 👈 Link import 추가

interface PostPageProps {
  params: { id: string; };
}

export default function PostDetailPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { id } = params;
  const { userId: loggedInUserId, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://localhost:3001/posts/${id}`);
          if (!response.ok) throw new Error('Post not found');
          const data = await response.json();
          setPost(data);
        } catch (error) {
          console.error("Failed to fetch post:", error);
          setPost(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });
      if (!response.ok) throw new Error('Failed to post comment');
      
      const createdComment = await response.json();
      
      // 상태 업데이트로 화면에 즉시 반영
      setPost(prevPost => {
        if (!prevPost) return null;
        // 백엔드가 author 정보를 함께 주지 않으므로, 프론트에서 임시로 만들어 추가
        const commentWithAuthor = { ...createdComment, author: { username: 'You' } };
        return {
          ...prevPost,
          comments: [...prevPost.comments, commentWithAuthor],
        }
      });
      setNewComment(''); // 입력창 비우기
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleCommentDelete = async (commentId: number) => {
  if (!token) return;
  if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
    try {
      const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete comment');

      // 상태 업데이트로 화면에서 즉시 삭제
      setPost(prev => prev && {
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId),
      });
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.');
    }
  }
};

  const handlePostDelete = async () => {
    if (!token || !post || post.author.id !== loggedInUserId) return;
    if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`http://localhost:3001/posts/${post.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete post');
        alert('게시물이 삭제되었습니다.');
        router.push('/');
      } catch (error) {
        alert('게시물 삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) return <main className="p-24 text-center"><h1>로딩 중...</h1></main>;
  if (!post) return <main className="p-24 text-center"><h1>게시물을 찾을 수 없습니다.</h1></main>;

  const isMyPost = post.author.id === loggedInUserId;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="bg-white border rounded-lg">
        <div className="flex justify-between items-center p-4">
          <p className="font-bold">{post.author?.username}</p>
          {isMyPost && (
            <div className="flex gap-2">
              {/* {isMyPost && ( ... )} 블록 안의 '수정' 버튼을 아래와 같이 변경 */}
              <Link href={`/posts/${post.id}/edit`} className="text-xs font-semibold text-blue-500 hover:underline">수정</Link>
              
              <button onClick={handlePostDelete} className="text-xs font-semibold text-red-500">삭제</button>
            </div>
          )}
        </div>
        <Image src={post.imageUrl.trim()} alt={post.caption} width={800} height={800} className="w-full"/>
        <div className="p-4">
          <p className="font-semibold">{post.likes.length} likes</p>
          <p className="mt-2"><span className="font-semibold">{post.author?.username}</span> {post.caption}</p>
          <div className="mt-4 pt-4 border-t">
          <h2 className="font-semibold text-gray-600 mb-2">댓글 ({post.comments.length}개)</h2>
          <div className="space-y-2 text-sm">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{comment.author?.username}</span>
                  <span className="ml-2">{comment.text}</span>
                </div>
                {/* 현재 로그인한 유저가 댓글 작성자일 경우에만 버튼을 보여줍니다. */}
                {loggedInUserId === comment.authorId && (
                  <div className="flex gap-2">
                    <button onClick={() => alert('댓글 수정 기능은 마지막 챌린지!')} className="text-xs font-semibold text-gray-500">수정</button>
                    <button onClick={() => handleCommentDelete(comment.id)} className="text-xs font-semibold text-red-500">삭제</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
          {token && (
            <form onSubmit={handleCommentSubmit} className="mt-4 pt-4 border-t">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글 달기..."
                className="w-full border-none p-0 text-sm focus:ring-0"
              />
            </form>
          )}
        </div>
      </div>
    </main>
  );
}