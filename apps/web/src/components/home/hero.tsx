"use client";

import { Button } from "@shilan/ui/components/button";
import {
  PillTabs,
  PillTabsContent,
  PillTabsList,
  PillTabsTrigger,
} from "@shilan/ui/components/pill-tabs";
import Link from "next/link";
import { DesktopLines } from "@/components/desktop-lines";
import { heroTabs } from "@/content/home";
import { uiStrings } from "@/content/ui-strings";

export function Hero() {
  return (
    <section className="section-hero relative text-white">
      <div className="container-content">
        <PillTabs defaultValue={heroTabs[0]?.id}>
          <PillTabsList aria-label={uiStrings.audienceTabs} className="gap-1.5">
            {heroTabs.map((tab) => (
              <PillTabsTrigger
                key={tab.id}
                value={tab.id}
                className="lg:min-h-[35px] lg:w-[116px] lg:px-0"
              >
                {tab.label}
              </PillTabsTrigger>
            ))}
          </PillTabsList>

          {heroTabs.map((tab) => (
            <PillTabsContent key={tab.id} value={tab.id} className="mt-8 lg:mt-[34px]">
              <h1 className="text-display font-bold">
                <DesktopLines text={tab.headline} />
              </h1>
              <p className="mt-5 text-lead lg:mt-6">
                <DesktopLines text={tab.subtext} />
              </p>
              <Button asChild className="mt-6 lg:mt-5">
                <Link href={tab.cta.href}>{tab.cta.label}</Link>
              </Button>
            </PillTabsContent>
          ))}
        </PillTabs>
      </div>
    </section>
  );
}
