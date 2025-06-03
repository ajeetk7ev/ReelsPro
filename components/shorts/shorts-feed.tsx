"use client";

import type { Prisma } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HiThumbUp } from "react-icons/hi";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";

type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
};

type ShortFeedProps = {
  short: Prisma.ShortsGetPayload<{
    include: {
      user: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>;
};

const ShortsFeed: React.FC<ShortFeedProps> = ({ short }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isLike, setIsLike] = useState(false);
  const [isFollow, setIsFollow] = useState(true);
  const [comment, setComment] = useState("");
  const [totalComments, setTotalComments] = useState<CommentType[]>([]);
  const [createCommentLoading, setCreateCommentLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useUser();

  // Auto play/pause based on viewport visibility
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch((err) => console.error("Play failed:", err));
            video.muted = false;
          }
        } else {
          if (!video.paused) {
            video.pause();
            video.muted = true;
          }
        }
      },
      { threshold: 0.75 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        const [likeRes, countRes, followRes] = await Promise.all([
          fetch("/api/shorts/check-like", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shortId: short.id, userId: user.id }),
          }),
          fetch("/api/shorts/like-count", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shortId: short.id }),
          }),
          fetch("/api/shorts/check-follow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminUserId: short.userId, userId: user.id }),
          }),
        ]);

        const likeData = await likeRes.json();
        const countData = await countRes.json();
        const followData = await followRes.json();

        console.log("Follow Data: ", followData);

        setIsLike(likeData.isLike);
        setLikeCount(countData.totalLike);
        setIsFollow(followData.isFollowing);
      } catch (error) {
        console.error("Error loading like data:", error);
      }
    };

    fetchInitialData();
    fetchComment();
  }, [user?.id, short.id]);

  const handleLikeClick = async () => {
    if (!user) return;

    setIsLike((prev) => !prev);
    setLikeCount((prev) => (isLike ? prev - 1 : prev + 1));

    try {
      const res = await fetch("/api/shorts/toggle-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortId: short.id, userId: user.id }),
      });

      const data = await res.json();

      if (!data.success) {
        setIsLike((prev) => !prev);
        setLikeCount((prev) => (data.isLike ? prev + 1 : prev - 1));
      } else {
        setIsLike(data.isLike);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setIsLike((prev) => !prev);
      setLikeCount((prev) => (isLike ? prev + 1 : prev - 1));
    }
  };

  const handleCreateComment = async () => {
    if (!comment || comment.length < 3) return;

    setCreateCommentLoading(true);
    try {
      const res = await fetch("/api/shorts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment, shortsId: short.id }),
      });

      const data = await res.json();
      if (data.success) {
        fetchComment();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setComment("");
      setCreateCommentLoading(false);
    }
  };

  const fetchComment = async () => {
    try {
      const res = await fetch(`/api/shorts/comment?shortsId=${short.id}`);
      const data = await res.json();
      console.log("COMMENTS DATA", data);
      setTotalComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () =>{
      if(!user) return;
      setIsFollow((prev) => !prev);
      try {
        const res = await fetch("/api/shorts/toggle-follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId: short.userId, userId: user.id }),
        });

        const data = await res.json();
        if (!data.success) {
          setIsFollow((prev) => !prev);
        }
      } catch (error) {
        console.error("Failed to toggle follow:", error);
        setIsFollow((prev) => !prev);
      }
  }

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

      {/* Like, Comment, Share buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-2 z-10">
        <div className="flex flex-col items-center justify-center">
          <Button
            variant={"outline"}
            onClick={handleLikeClick}

          >
            <HiThumbUp className={`  ${isLike ? "text-blue-500" :  " text-black dark:text-white"} `} />
          </Button>
          <span>{likeCount}</span>
        </div>

        {/* Comment Button with Dialog */}
        <div className="flex flex-col items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BsFillChatLeftTextFill />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[360px] h-[620px] absolute rounded-2xl p-4 flex flex-col justify-between">
              <DialogHeader>
                <DialogTitle>
                  Comments <span className="text-slate-400">{totalComments.length}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-4 mt-4">
                {totalComments.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground">No comments yet.</p>
                ) : (
                  totalComments.map((c) => (

                    <div key={c.id} className="flex  items-start space-x-2">
                      <div className="flex  items-center gap-1">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={c.user.imageUrl} alt={c.user.name} />
                          <AvatarFallback>{c.user.name[0]}</AvatarFallback>
                        </Avatar>

                      </div>


                      <div className="bg-muted p-2 rounded-lg">
                        <p className="text-sm font-medium">{c.user.name}</p>
                        <p className="text-sm text-muted-foreground">{c.content}</p>
                      </div>

                    </div>
                  ))
                )}
              </div>

              <DialogFooter>
                <div className="flex items-center gap-2 w-full">
                  <Input
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1"
                    minLength={3}
                  />
                  {comment.length > 0 && (
                    <Button onClick={handleCreateComment} disabled={createCommentLoading}>
                      {createCommentLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-black" />
                      ) : (
                        <IoSend />
                      )}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <span>{totalComments.length}</span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Button variant={"outline"}>
            <FaShare className="text-3xl" />
          </Button>
          2k
        </div>
      </div>

      {/* Footer Info */}
      <CardFooter className="absolute bottom-20 left-0 text-white p-4">
        <div>
          <div className="flex items-center space-x-2">
            <Avatar className="w-12 h-12 rounded-full">
              <AvatarImage src={short.user.imageUrl ?? "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-row items-center justify-center gap-2">

              <h3 className="font-semibold text-base">{short.user.name}</h3>
              <Button variant={"outline"} className="text-black  dark:text-white " onClick={handleFollow} >{isFollow ? "Following" : "Follow"}</Button>
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
