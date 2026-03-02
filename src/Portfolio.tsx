import { useState, useEffect, Suspense, lazy } from "react";
import { portfolioService } from "./services/portfolioService";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Loader from "./components/Loader";

// Lazy load expensive 3D background - load after initial render
const ThreeBackground = lazy(() => import("./components/ThreeBackground"));

export default function Portfolio() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioData = await portfolioService.getPortfolioData();
        setData(portfolioData);
        portfolioService.incrementVisitor();
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchData();
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <Loader />
    </div>
  );

  return (
    <div className="relative text-slate-200">
      {/* Lazy load 3D background after main content renders */}
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>
      
      <Navbar />

      <main>
        <Hero meta={data.meta} />
        <About about={data.meta?.about} />
        <Skills skills={data.skills} />
        <Experience experiences={data.experiences} />
        <Projects projects={data.projects} />
        <Testimonials testimonials={data.testimonials} />
        <Contact meta={data.meta} />
      </main>

      <Footer visitorCount={data.visitorCount} />
    </div>
  );
}
