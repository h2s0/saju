import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    { path: './fonts/Pretendard-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Pretendard-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Pretendard-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/Pretendard-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  preload: false,
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'Arial', 'sans-serif'],
});

export const ssurroundAir = localFont({
  src: './fonts/Cafe24SsurroundAir-v1.1.woff2',
  weight: '300',
  style: 'normal',
  variable: '--font-ssurround-air',
  display: 'swap',
  preload: false,
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'Arial', 'sans-serif'],
});
