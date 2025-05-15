"use client";

import type { Prisma } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import { Card, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ShortFeedProps = {
  short: Prisma.ShortsGetPayload<{
    include: {
      user: {
        select: {
          name: true;
          email: true;
        };
      };
    };
  }>;
};

const ShortsFeed: React.FC<ShortFeedProps> = ({ short }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            videoRef.current.play().catch((err) => console.log(err));
            videoRef.current.muted = false;
          } else {
            videoRef.current.pause();
            videoRef.current.muted = true;
          }
        });
      },
      {
        threshold: 0.75, // Trigger when 75% is in view
      }
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Card
      ref={cardRef}
      className="p-0 w-[360px] h-[620px] flex flex-col items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
    >
      <video
        ref={videoRef}
        src={short.videoUrl}
        controls
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        width={360}
        height={620}
      />

      {/* Channel Information  */}
      <CardFooter className="absolute bottom-20 left-0 text-white p-4">
        <div>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={"https://github.com/shadcn.png"} alt="channel owner photo" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold text-base">{short.user.name}</h3>
            </div>
          </div>

          <div className="text-sm mt-2">
            <p>{short.title}</p>
            <p>{short.description}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShortsFeed;
