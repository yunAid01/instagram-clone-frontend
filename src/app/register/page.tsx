// src/app/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  // 1. 각 입력창의 값을 저장할 상태 (email, username, password)
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // 2. 폼 제출 시 실행될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 3. 백엔드의 회원가입 API 호출 ('/users' 경로에 POST 요청)
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        // 서버에서 에러 응답이 온 경우 (e.g., 이미 존재하는 이메일)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      // 4. 회원가입에 성공하면 사용자에게 알리고, 로그인 페이지로 이동시킴
      alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
      router.push('/login');
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(`회원가입에 실패했습니다: ${error.message}`);
    }
  };

  // 5. 화면에 보여질 회원가입 폼
  return (
    <main className="p-24">
      <h1 className="text-4xl font-bold text-center">회원가입</h1>
      
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 max-w-sm mx-auto">
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">이메일</label>
          <input
            id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded" required
          />
        </div>
        <div>
          <label htmlFor="username" className="block mb-2 font-medium">사용자 이름</label>
          <input
            id="username" type="text" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded" required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 font-medium">비밀번호</label>
          <input
            id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded" required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700"
        >
          가입하기
        </button>
      </form>
    </main>
  );
}