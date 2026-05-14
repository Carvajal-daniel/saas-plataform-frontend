

import { Hero } from "@/components/marketing/hero/Hero";
import { Navbar } from "@/components/layout/header/NavBar";
import { Footer } from "@/components/layout/footer/Footer";
import { CTA } from "../components/marketing/cta/cta";
import PricingSection from "@/components/marketing/pricing/PricingSection";


export default function Home() {
  return (
    <div className="overflow-hidden">

      <header>
        <Navbar />
      </header>

      <main>

          <section>
            < Hero />
          </section>

          <section>
            <PricingSection/>
          </section>

          <section>
            <CTA/>
          </section>

      </main>

      <footer>
        <Footer />
      </footer>

    </div>
  );
}
