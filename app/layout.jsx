import './globals.css';
export const metadata = {
  title: 'QU Course Insights',
  description: 'Know before you enroll'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
