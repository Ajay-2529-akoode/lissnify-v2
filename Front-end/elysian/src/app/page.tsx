import Navbar from "@/Components/Navbar"
import Hero from "@/Components/Hero"
import Features from "@/Components/Features"
import HowItWorksSection from "@/Components/HowItWorksSection"
import ListenerCarousel from "@/Components/ListenerCarousel"
import EmotionalTestimonials from "@/Components/EmotionalTestimonials"
import WhyElysian from "@/Components/WhyElysian"
import CategoryGrid from "@/Components/CategoryGrid"
import CommunityGrid from "@/Components/CommunityGrid" 
import ResourcesBlogPreview from "@/Components/ResourcesBlogPreview"
import Footer from "@/Components/Footer"

export default function HomePage() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Features/>
      <HowItWorksSection/>
      <CategoryGrid/>
      <WhyElysian/>
      <ListenerCarousel/>
      <EmotionalTestimonials/>
      <CommunityGrid/>
      <ResourcesBlogPreview/>
      <Footer/>
    </div>
  );
}
