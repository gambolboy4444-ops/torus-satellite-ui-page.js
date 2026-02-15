export const metadata = {
  title: 'TORUS GENESIS',
  description: 'Satellite UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}