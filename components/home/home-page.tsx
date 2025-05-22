"use client";

import { Navbar } from "@/components/header/navbar";
import ShortsFeed from "@/components/shorts/shorts-feed";
import { useEffect, useRef, useState } from "react";

export  function HomePage({ shorts }: { shorts: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleIndex(index);
          }
        });
      },
      {
        threshold: 0.8,
      }
    );

    const children = containerRef.current?.children;
    if (children) {
      Array.from(children).forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div
        className="flex flex-col items-center pt-[40px]"
        ref={containerRef}
      >
        {shorts.map((short, index) => (
          <div
            key={short.id}
            className="snap-start flex justify-center items-center h-screen w-full"
            data-index={index}
          >
            {/* 👇 only render focused short to improve performance */}
            {index === visibleIndex ? (
              <ShortsFeed short={short} />
            ) : (
              <div className="h-full w-full bg-black" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
