import type { Metadata } from "next";
import { Container, PageHero } from "@/components/site/section";
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
      <PageHero
        eyebrow="Readiness check"
        title="How ready is your car right now?"
        lead="Cars that sit lose condition quietly: batteries discharge, tyres flat-spot, fluids age and paperwork drifts. Answer six questions and see where your car stands. It takes about two minutes and you don't need to give us any details to see the result."
      />
      <section className="py-14 sm:py-20">
        <Container>
          <ReadinessTool />
          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-subtle">
            This check gives general guidance based on typical behaviour of modern performance, hybrid, electric and classic cars. It isn&apos;t a substitute for an inspection. Manufacturer storage advice for your specific car always takes priority.
          </p>
        </Container>
      </section>
    </>
  );
}
