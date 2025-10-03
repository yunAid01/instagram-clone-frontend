// 이거 뭐임 @type {import 어쩌거 저쩌고}
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // 👇 새로 발생한 에러의 주소를 여기에 추가합니다.
      {
        protocol: 'https',
        hostname: 'whatthefuck.com',
      },
    ],
  },
};

module.exports = nextConfig;