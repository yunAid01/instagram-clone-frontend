// src/app/profile/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard'; // 👈 우리가 만든 PostCard 컴포넌트를 재사용합니다!
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types'; // 👈 types.ts에서 Post 타입을 import!



// 이 페이지에서 불러올 사용자 프로필 데이터의 타입
interface UserProfile {
  id: number;
  username: string;
  email: string;
  posts: Post[];
  followers: { followerId: number }[]; // 👈 추가!
}
// 페이지가 받는 params의 타입
interface ProfilePageProps {
  params: {
    id: string; // URL의 [id] 부분은 항상 문자열(string)
  };
}


export default function ProfilePage({ params }: ProfilePageProps) {
  // --- 상태 관리 ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = params; // URL에서 조회할 사용자의 id를 추출
  const { userId: loggedInUserId, token  } = useAuth(); // 현재 로그인한 사용자의 id
  // 👇 '팔로우' 상태를 기억할 새로운 state. 초기값은 'false'(팔로우 안 함)로 가정합니다.
  const [isFollowing, setIsFollowing] = useState(false);

  // --- 데이터 Fetching ---
  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:3001/users/${id}`);
          if (!response.ok) { throw new Error('User not found'); }
          const data = await response.json();
          setProfile(data);

          // --- 👇 여기가 핵심입니다! ---
          // 1. 로그인한 유저 ID와, 프로필의 팔로워 목록이 모두 있는지 확인
          if (loggedInUserId && data.followers) {
            // 2. 팔로워 목록(data.followers) 중에,
            //    '나(loggedInUserId)'가 포함되어 있는지(.some) 확인
            const amIFollowing = data.followers.some(
              (follow) => follow.followerId === loggedInUserId
            );
            // 3. 확인 결과(true 또는 false)에 따라 isFollowing 상태를 설정
            setIsFollowing(amIFollowing);
          }
          // --- 여기까지 ---

        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setProfile(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [id, loggedInUserId]);

   // '팔로우' 버튼을 눌렀을 때 실행될 함수
  const handleFollow = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/users/${id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // 인증된 사용자임을 증명
        },
      });
      if (response.ok) {
        setIsFollowing(true); // 성공 시, '팔로우 중' 상태로 변경
      }
    } catch (error) {
      console.error("Failed to follow:", error);
    }
  };

  // '언팔로우' 버튼을 눌렀을 때 실행될 함수
  const handleUnfollow = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/users/${id}/follow`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setIsFollowing(false); // 성공 시, '팔로우 안 함' 상태로 변경
      }
    } catch (error) {
      console.error("Failed to unfollow:", error);
    }
  };

  // --- 렌더링 ---
  if (isLoading) {
    return <main className="p-24 text-center"><h1>프로필을 불러오는 중...</h1></main>;
  }

  if (!profile) {
    return <main className="p-24 text-center"><h1>사용자를 찾을 수 없습니다.</h1></main>;
  }

  const isMyProfile = loggedInUserId === profile.id;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-8 mb-8">
        <div className="w-32 h-32 bg-gray-300 rounded-full"></div> {/* 임시 프로필 이미지 */}
        <div>
          <h1 className="text-3xl font-bold">{profile.username}</h1>
          <p className="text-gray-500">{profile.email}</p>
          {/* '내 프로필'일 때와 '상대 프로필'일 때 다른 버튼을 보여줍니다. */}
          {isMyProfile ? (
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded font-semibold text-sm">프로필 편집</button>
          ) : (
            // isFollowing 상태에 따라 다른 버튼과 onClick 함수를 연결합니다.
            isFollowing ? (
              <button 
                onClick={handleUnfollow}
                className="mt-4 px-4 py-2 bg-gray-200 rounded font-semibold text-sm"
              >
                팔로잉
              </button>
            ) : (
              <button 
                onClick={handleFollow}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded font-semibold text-sm"
              >
                팔로우
              </button>
            )
          )}
        </div>
      </div>

      <hr />

      <div className="mt-8">
        <h2 className="font-semibold text-center text-gray-500 mb-4">게시물</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* 우리가 만든 PostCard 컴포넌트를 그대로 재사용합니다! */}
          {profile.posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}