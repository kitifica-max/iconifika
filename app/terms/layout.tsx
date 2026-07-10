export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowY: 'auto', height: '100vh' }}>
      {children}
    </div>
  )
}
