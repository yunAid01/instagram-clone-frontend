// src/components/Navbar.tsx

'use client'; // useAuth, useRouter 등 훅을 사용하므로 클라이언트 컴포넌트여야 합니다.

import Link from 'next/link'; // Next.js의 페이지 이동을 위한 Link 컴포넌트
import { useAuth } from '@/contexts/AuthContext'; // 우리가 만든 '안내 방송 스피커'
import { useRouter } from 'next/navigation'; // 페이지를 강제로 이동시키기 위한 도구

// Navbar 컴포넌트 정의
export default function Navbar() {
  // useAuth() 스피커를 켜서, 현재 방송되는 내용 중 userId와 logout 함수를 가져옵니다.
  const { userId, logout } = useAuth();
  const router = useRouter();

  // 로그아웃 버튼을 클릭했을 때 실행될 함수
  const handleLogout = () => {
    logout(); // 1. 방송실에 '로그아웃' 신호를 보내, 상태를 업데이트하고 localStorage의 토큰을 지웁니다.
    alert('로그아웃 되었습니다.');
    router.push('/login'); // 2. 로그아웃 후에는 로그인 페이지로 이동시킵니다.
  };

  return (
    // 'sticky top-0 z-10'은 스크롤을 내려도 항상 화면 상단에 고정되게 하는 Tailwind CSS 클래스입니다.
    <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-16">
        {/* 로고: 클릭하면 메인 페이지로 이동합니다. */}
        <Link href="/" className="font-bold text-xl">
          Instagram
        </Link>

        {/* 메뉴 링크들 */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          {/* --- 👇 여기가 바로 '조건부 렌더링'의 마법입니다 --- */}
          {userId ? (
            // [조건이 참일 때] userId가 존재하면 (로그인 상태이면), 이 메뉴들을 보여줍니다.
            <>
              <Link href="/posts/create" className="text-gray-700 hover:text-blue-500">새 게시물</Link>
              {/* '내 프로필' 링크는 현재 로그인한 사용자의 ID를 사용합니다. */}
              <Link href={`/profile/${userId}`} className="text-gray-700 hover:text-blue-500">내 프로필</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                로그아웃
              </button>
            </>
          ) : (
            // [조건이 거짓일 때] userId가 null이면 (로그아웃 상태이면), 이 메뉴들을 보여줍니다.
            <>
              <Link href="/login" className="text-blue-500 hover:text-blue-700">로그인</Link>
              {/* 나중에 만들 회원가입 페이지를 위한 링크입니다. */}
              <Link href="/register" className="text-gray-700 hover:text-blue-700">회원가입</Link> 
            </>
          )}
        </div>
      </div>
    </nav>
  );
}