// src/app/login/page.tsx

'use client';

// --- 1. 필요한 도구들을 가져옵니다 ---
import { useState } from 'react'; // 컴포넌트의 '기억 상자' (state)를 만들기 위한 도구
import { useRouter } from 'next/navigation'; // 페이지 이동을 위한 도구
import { useAuth } from '@/contexts/AuthContext'; // 👈 우리가 만든 '안내 방송 스피커(간편 접속 버튼)'를 가져옵니다!

// --- 2. LoginPage 컴포넌트(페이지) 정의 ---
export default function LoginPage() {
  // --- 3. 필요한 변수와 함수들을 준비합니다 ---

  // 이메일 입력창의 값을 실시간으로 기억할 'email' 상태와, 그 값을 바꿀 'setEmail' 함수를 만듭니다.
  const [email, setEmail] = useState('');
  // 비밀번호 입력창의 값을 실시간으로 기억할 'password' 상태와, 그 값을 바꿀 'setPassword' 함수를 만듭니다.
  const [password, setPassword] = useState('');
  
  // 페이지 이동 기능을 사용할 수 있도록 router 객체를 준비합니다.
  const router = useRouter();
  
  // ⭐️ 바로 이 부분입니다!
  // useAuth() 스피커를 켜서, '안내 방송 시스템'이 제공하는 기능들({ userId, token, login, logout }) 중
  // 우리는 지금 'login'이라는 리모컨 버튼만 필요하므로, 객체 분해 할당으로 꺼내옵니다.
  const { login } = useAuth(); 
  
  // --- 4. 폼 제출 시 실행될 로직을 정의합니다 ---
  const handleSubmit = async (e: React.FormEvent) => {
    // form 태그의 기본 동작(엔터키 누를 시 페이지 새로고침)을 막습니다.
    e.preventDefault();

    try {
      // 백엔드 로그인 API에 'POST' 방식으로 데이터를 보냅니다.
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body에는 email과 password 상태 값을 JSON 문자열로 바꿔서 담습니다.
        body: JSON.stringify({ email, password }),
      });

      // 백엔드가 에러(4xx, 5xx)를 보냈다면, 여기서 에러를 발생시켜 catch 블록으로 점프합니다.
      if (!response.ok) {
        throw new Error('Login failed'); 
      }

      // 백엔드가 보낸 성공 응답( { token: "..." } )을 JSON 객체로 변환합니다.
      const data = await response.json();
      
      // ⭐️ 여기가 두 번째 핵심입니다!
      // 우리가 직접 localStorage.setItem을 하지 않고,
      // 중앙 '방송실'이 제공하는 login 함수에 토큰을 전달합니다.
      // 이 함수는 내부적으로 localStorage 저장과 상태 업데이트(방송)를 모두 처리해줍니다.
      login(data.token);

      // 사용자에게 성공을 알리고, 메인 페이지로 이동시킵니다.
      alert('로그인 성공!');
      router.push('/');
      
    } catch (error) {
      // 위 try 블록 안에서 어떤 종류의 에러든 발생하면 여기가 실행됩니다.
      console.error('Login failed:', error);
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  // --- 5. 화면에 보여줄 UI를 그립니다 ---
  return (
    <main className="p-24">
      <h1 className="text-4xl font-bold text-center">로그인</h1>
      
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 max-w-sm mx-auto">
        {/* 이메일 입력창: 사용자가 입력할 때마다 setEmail이 호출되어 email 상태가 업데이트됨 */}
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* 비밀번호 입력창: 사용자가 입력할 때마다 setPassword가 호출되어 password 상태가 업데이트됨 */}
        <div>
          <label htmlFor="password" className="block mb-2 font-medium">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        >
          로그인
        </button>
      </form>
    </main>
  );
}