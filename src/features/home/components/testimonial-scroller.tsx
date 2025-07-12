"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    message:
      "I’ve been using Orpheon for a while now and I could say this the best possible service available!",
    author: "Kim Minju",
  },
  {
    message:
      "Excellent customer support and intuitive design. Highly recommended!",
    author: "Lee Taemin",
  },
  {
    message:
      "A wonderful experience from start to finish. Orpheon delivers!",
    author: "Park Jisoo",
  },
   {
    message:
      "I’ve been using Orpheon for a while now and I could say this the best possible service available!",
    author: "Kim Minju",
  },
  {
    message:
      "Excellent customer support and intuitive design. Highly recommended!",
    author: "Lee Taemin",
  },
  {
    message:
      "A wonderful experience from start to finish. Orpheon delivers!",
    author: "Park Jisoo",
  },
   {
    message:
      "I’ve been using Orpheon for a while now and I could say this the best possible service available!",
    author: "Kim Minju",
  },
  {
    message:
      "Excellent customer support and intuitive design. Highly recommended!",
    author: "Lee Taemin",
  },
  {
    message:
      "A wonderful experience from start to finish. Orpheon delivers!",
    author: "Park Jisoo",
  },
];

export default function TestimonialScroller() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const scrollSpeed = 2;

    const scroll = () => {
      if (!container) return;
      scrollAmount += scrollSpeed;
      if (scrollAmount >= container.scrollHeight / 2) {
        scrollAmount = 0;
      }
      container.scrollTop = scrollAmount;
      requestAnimationFrame(scroll);
    };

    // Duplicate testimonials for infinite scroll
    container.innerHTML += container.innerHTML;
    requestAnimationFrame(scroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-64 overflow-hidden max-w-xl flex flex-col gap-4 text-white"
    >
      {[...testimonials, ...testimonials].map((item, i) => {
        const faded = i % 3 === 0 || i % 3 === 2;
        return (
          <div
            key={i}
            className={`border-t border-white/20 py-4 w-full transition-opacity duration-300 "
              }`}
          >
            <p className="text-2xl md:text-4xl leading-relaxed">{item.message}</p>
            <p className="text-base mt-2 text-[#979797]">{item.author}</p>
          </div>
        );
      })}
    </div>
  );
}
