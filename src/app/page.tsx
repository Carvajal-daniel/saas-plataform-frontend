

import { Hero } from "@/components/marketing/hero/Hero";
import Pricing from "@/components/marketing/pricing/Pricing";
import { Navbar } from "@/components/layout/header/NavBar";
import { CTA } from "@/components/marketing/cta/CTA";
import { Footer } from "@/components/layout/footer/Footer";


export default function Home() {
  return (
    <div className="overflow-hidden">

   <header>
    <Navbar />
   </header>
   <main>
    <section>
    < Hero/>
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
