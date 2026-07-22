import Hero from '../components/Hero'
import FeaturedCarousel from '../components/FeaturedCarousel'
import Properties from '../components/Properties'
import Services from '../components/Services'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCarousel />
      <Properties />
      <Services />
      <About />
      <Testimonials />
      <Contact />
    </>
  )
}
