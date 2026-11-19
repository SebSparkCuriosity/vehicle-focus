import type { Metadata } from "next";
import { BackdropLayer, Container, PhotoHero } from "@/components/site/section";
import { ReadinessTool } from "@/components/site/readiness-tool";

export const metadata: Metadata = {
  title: "How Ready Is Your Car? Free Supercar Readiness Check",
  description:
    "Six questions about how your supercar or classic car is used and stored. Get an instant risk score for battery, tyres, fluids, storage and records, with plain-English advice from Vehicle Focus in Jersey.",
  alternates: { canonical: "/readiness" },
};

export default function ReadinessPage() {
  return (
    <>
      <PhotoHero
        image="/images/cars/porsche-interior.jpg"
        position="50% 45%"
        title={
          <>
            How ready is your car <em className="text-white/70">right now</em>?
          </>
        }
        lead="Cars that sit lose condition quietly. Answer six questions and see where yours stands. About two minutes, and you don't need to give us any details to see the result."
      />
      <section className="relative isolate overflow-hidden py-16 sm:py-24">
        <BackdropLayer />
        <Container>
          <ReadinessTool />
          <p className="mt-12 max-w-2xl text-xs leading-relaxed text-white/40">
            General guidance based on how modern performance, hybrid, electric and classic cars typically behave. It isn&apos;t a substitute for an inspection, and manufacturer storage advice for your car always takes priority.
          </p>
        </Container>
      </section>
    </>
  );
}
