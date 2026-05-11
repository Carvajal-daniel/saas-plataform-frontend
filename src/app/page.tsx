

import { BentoGrid } from "@/components/BentoGrid";
import { CTA } from "@/components/cta/CTA";
import { Hero } from "@/components/landing/hero/Hero";
import { Footer } from "@/components/landing/footer/Footer";
import Pricing from "@/components/landing/pricing/Pricing";
import { Navbar } from "@/components/landing/header/NavBar";


export default function Home() {
  return (
    <div className="overflow-hidden">

   <header>
    <Navbar />
   </header>
   <main>
    <section>
    < Hero/>
<section>
  <BentoGrid />
</section>
    </section>
    <section>
    <Pricing />
    
    </section>
<section>
  <CTA />
</section>

   </main>
   <footer>
    <Footer />
   </footer>
    </div>
  );
}
