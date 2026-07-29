import './globals.css';

import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'QU Course Insights',
  description: 'Know before you enroll'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}
          <Analytics />

      </body>
    </html>
  );
}
