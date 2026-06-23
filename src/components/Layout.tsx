import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import ContentProtection from './ContentProtection'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col site-protected">
      <ContentProtection />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
