// src/contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwt from 'jsonwebtoken';

// 방송 시스템이 제공할 기능 목록(메뉴판)을 업데이트합니다.
interface AuthContextType {
  userId: number | null;
  token: string | null;
  login: (token: string) => void;   // 👈 '로그인' 방송 기능 추가
  logout: () => void;  // 👈 '로그아웃' 방송 기능 추가
}

// wifi 공유기
const AuthContext = createContext<AuthContextType | null>(null);


// 방송실
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = jwt.decode(storedToken) as { userId: number; exp: number };
      // (💡 꿀팁) 토큰이 만료되지 않았는지도 함께 확인하면 더 안전합니다.
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUserId(decoded.userId);
        setToken(storedToken);
      } else {
        localStorage.removeItem('token'); // 만료된 토큰은 삭제
      }
    }
  }, []);

  // '로그인' 방송을 보내는 함수
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken); // 1. 브라우저에 토큰 저장
    const decoded = jwt.decode(newToken) as { userId: number };
    if (decoded) {
      setUserId(decoded.userId); // 2. 현재 사용자 ID 상태 업데이트 (-> 모든 컴포넌트에 방송됨)
      setToken(newToken);
    }
  };

  // '로그아웃' 방송을 보내는 함수
  const logout = () => {
    localStorage.removeItem('token'); // 1. 브라우저에서 토큰 삭제
    setUserId(null); // 2. 현재 사용자 ID를 null로 업데이트 (-> 모든 컴포넌트에 방송됨)
    setToken(null);
  };

  // 이제 value에 login, logout 함수도 함께 담아서 방송합니다.
  const value = { userId, token, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}