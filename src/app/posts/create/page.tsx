// src/app/posts/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 페이지 이동(리디렉션)을 위한 도구
import { useAuth } from '@/contexts/AuthContext';


export default function CreatePostPage() {
  // 1. 각 입력창의 내용을 저장할 '상태(State)'를 만듭니다.
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const router = useRouter(); // 👈 useRouter 훅을 준비합니다.

  const { userId, token } = useAuth();

  // 2. '게시하기' 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 👈 폼 제출 시 페이지가 새로고침되는 기본 동작을 막습니다.
    console.log("CCTV 1: handleSubmit 함수 시작됨."); // CCTV 1


    if (!userId || !token) {
      alert("게시물을 작성하려면 로그인이 필요합니다");
      router.push('/login')
      return ;
    }
    console.log("CCTV 2: 인증 정보 확인 완료. 토큰:", token); // CCTV 2

    // 3. 백엔드 API에 POST 요청 보내기
    try {
      console.log("CCTV 3: fetch 요청 보내기 직전. 보낼 데이터:", { imageUrl, caption }); // CCTV 3
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 2. 'Authorization' 헤더에 'Bearer '와 함께 토큰을 담아 보냅니다.
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          caption: caption,
          // 3. authorId는 이제 백엔드가 토큰을 보고 직접 알아내므로 보낼 필요가 없습니다.
        }),
      });
      console.log("CCTV 4: fetch 응답 받음. 응답 상태:", response.status, response.ok); // CCTV 4


      if (!response.ok) {
        // 서버에서 4xx, 5xx 에러 응답을 보냈을 경우
        const errorData = await response.json();
        console.error("CCTV 5-1: 서버가 에러 응답을 보냄:", errorData); // CCTV 5-1 (에러 시)
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      console.log("CCTV 5-2: 게시물 생성 성공! 응답 데이터:", newPost); // CCTV 5-2 (성공 시)

      // 4. 성공적으로 게시물이 생성되면, 메인 페이지로 사용자를 이동시킵니다.
      alert('게시물이 성공적으로 작성되었습니다!');
      router.push('/');

    } catch (error: any) {
      console.error("CCTV 6: CATCH 블록 실행됨! 에러 원인:", error.message); // CCTV 6
      alert(`게시물 생성에 실패했습니다: ${error.message}`)
    }
  };

  // 5. 사용자가 실제로 보게 될 화면 (HTML 구조)
  return (
    <main className="p-24">
      <h1 className="text-4xl font-bold">새 게시물 작성하기</h1>
      
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 max-w-lg mx-auto">
        <div>
          <label htmlFor="imageUrl" className="block mb-2 font-medium">이미지 주소</label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        <div>
          <label htmlFor="caption" className="block mb-2 font-medium">내용</label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="멋진 사진에 대한 설명을 적어주세요."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          게시하기
        </button>
      </form>
    </main>
  );
}