import Hero from '../components/Hero/Hero'
import LogosStrip from '../components/LogosStrip/LogosStrip'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Features from '../components/Features/Features'
import WorkerCards from '../components/WorkerCards/WorkerCards'
import Stats from '../components/Stats/Stats'
import Testimonials from '../components/Testimonials/Testimonials'
import CTA from '../components/CTA/CTA'

const Home = () => (
  <main>
    <Hero />
    <LogosStrip />
    <HowItWorks />
    <Features />
    <WorkerCards />
    <Stats />
    <Testimonials />
    <CTA />
  </main>
)

export default Home