"use client";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Phone,
  Users,
  ExternalLink,
} from "lucide-react";
import { listenerCarouselData } from "@/utils/api";
import { API_CONFIG } from "@/config/api";
import { connection } from "@/utils/api";
import { useRouter } from "next/navigation";
import {toast} from 'react-toastify'
const LISTENERS_PER_SLIDE = 2;

export default function FeaturedListeners() {
  const router = useRouter();
  const [listeners, setListeners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ConnectButton, setConnectButton] = useState(false);
  
  const totalSlides = Math.ceil(listeners.length / LISTENERS_PER_SLIDE);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  useEffect(() => {
    const fetchListenerData = async () => {
      const listenerData = await listenerCarouselData();
      const user_type = JSON.parse(localStorage.getItem('elysian_user'))
      if(user_type?.user_type==='seeker'){
        setConnectButton(true);
      }
      else if(user_type==null){
        setConnectButton(true);
      }
      setListeners(listenerData);
    };
    fetchListenerData();
  }, []);
  const handleListenerConnect = async () => {
    try {
      
      const listener_id = listeners[currentIndex * LISTENERS_PER_SLIDE]?.l_id;
      if (!listener_id) {
        console.error("No listener ID available for connection.");
        return;
      }
      const data = await connection(listener_id || "");
      if(data.success){
        toast.success("Request sent successfully")
      }else{
        toast.error('You must login or Sign up')
        setTimeout(()=>{
          router.push('/login')
        },500)
        
      }

      // Add more logic (redirect, open modal, etc.)
    } catch (error) {

      console.error("Error connecting to listener:", error);
    }

  }
  return (
    <section className="w-full bg-yellow-50 py-20">
      <div className="max-w-8xl mx-auto px-6 lg:px-16 xl:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            Featured Listeners
          </h2>
          <p className="text-2xl text-black max-w-2xl mx-auto font-medium">
            Real people. Lived experiences. Gentle support.
          </p>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <button
            aria-label="Previous Slide"
            onClick={prevSlide}
            disabled={isTransitioning || currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronLeft className="w-7 h-7 text-[#FF8C5A] group-hover:text-[#e67848] transition-colors" />
          </button>

          <button
            aria-label="Next Slide"
            onClick={nextSlide}
            disabled={isTransitioning || currentIndex >= totalSlides - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronRight className="w-7 h-7 text-[#FF8C5A] group-hover:text-[#e67848] transition-colors" />
          </button>

          <div className="overflow-hidden rounded-2xl">
            <div
              className={`flex transition-transform duration-500 ease-out ${isTransitioning ? "opacity-95" : "opacity-100"
                }`}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex gap-8 w-full flex-shrink-0 px-2"
                >
                  {listeners
                    .slice(
                      slideIndex * LISTENERS_PER_SLIDE,
                      (slideIndex + 1) * LISTENERS_PER_SLIDE
                    )
                    .map((listener) => (
                      <div
                        key={listener.l_id}
                        className="flex-1 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                      >
                        <div className="p-8">
                          <div className="flex items-start gap-5 mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden shadow-md flex-shrink-0 ring-4 ring-[#FFE0D5] group-hover:ring-[#FF8C5A] transition-all duration-300">
                              <img
                                src={
                                  listener?.user?.profile_image
                                    ? `${API_CONFIG.BASE_URL}/${listener?.user?.profile_image}`
                                    : "http://localhost:3000/user.png"
                                }
                                alt={listener?.username || "Listener"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-3xl font-bold text-gray-800 group-hover:text-[#FF8C5A] transition-colors">
                                  {listener.username || "Listener"}
                                </h3>
                                <button className="flex items-center gap-1 text-xl text-gray-500 hover:text-[#FF8C5A] transition-colors duration-300 font-medium">
                                  <span>View Profile</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-5 h-5 ${i < Math.floor(listener.rating == null ? 4 : listener.rating)
                                          ? "text-yellow-500 fill-current"
                                          : i === Math.floor(listener.rating) &&
                                            listener.rating % 1 !== 0
                                            ? "text-yellow-500 fill-current opacity-50"
                                            : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xl font-semibold text-black">
                                  {listener.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-black text-xl leading-relaxed mb-6 line-clamp-3">
                            {listener.description == null ? 'Listener description.... ' : listener.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {(listener.preferences || []).map((tag) => (
                              <span
                                key={tag}
                                className="px-4 py-2 bg-gradient-to-r from-[#FFE0D5] to-[#FFF0E8] text-[#FF8C5A] text-lg font-semibold rounded-full border border-[#FFE0D5] hover:border-[#FF8C5A] transition-colors cursor-default"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between gap-4">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                Languages Spoken
                              </h4>
                             {ConnectButton&&<button onClick={handleListenerConnect} className="px-6 py-2 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] text-xl font-bold rounded-lg hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300 whitespace-nowrap">
                                Connect
                              </button>} 
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-wrap gap-2">
                                {(listener?.languages || ['English', 'Hindi']).map((language) => (
                                  <span
                                    key={language}
                                    className="px-3 py-1.5 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-sm font-medium rounded-full shadow-sm"
                                  >
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 300);
                }
              }}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${index === currentIndex
                  ? "w-8 h-4 bg-[#FF8C5A] shadow-md"
                  : "w-4 h-4 bg-white/70 hover:bg-white shadow-sm hover:scale-110"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
