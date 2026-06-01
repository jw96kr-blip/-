import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 단지 홈페이지 이미지를 img 태그로 사용하므로 unoptimized 허용
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
  },
  // 외부 패키지 서버 컴포넌트 번들링
  experimental: {},
};

export default nextConfig;
