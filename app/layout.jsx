import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Huỳnh Thiên An | Chief Information Officer & Enterprise AI Executive',
  description: 'Executive Portfolio of Mr. Huynh Thien An - CIO at MAP Life Insurance, 20+ years of Technology Leadership, Enterprise AI, Core Platform Modernization & Digital Transformation.',
  keywords: ['Huynh Thien An', 'Huỳnh Thiên An', 'CIO', 'Chief Information Officer', 'Enterprise AI', 'Digital Transformation', 'MAP Life', 'Executive Profile'],
  authors: [{ name: 'Huỳnh Thiên An' }],
  openGraph: {
    title: 'Huỳnh Thiên An | CIO & Enterprise AI Executive',
    description: 'Executive Portfolio & AI-Powered Candidate Matching Platform.',
    images: ['/profile.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAFBFD] text-slate-800 font-roboto min-h-screen antialiased selection:bg-[#009DAE]/20 selection:text-[#009DAE]">
        {children}
      </body>
    </html>
  );
}
