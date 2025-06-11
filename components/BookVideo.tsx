"use client";

import config from "@/lib/config";
import { IKVideo } from "imagekitio-react"; // تأكد أنك تستخدم النسخة الصحيحة
import React from "react";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <IKVideo
      urlEndpoint={config.env.imagekit.urlEndpoint} // ضع رابط endpoint هنا مباشرة
      path={videoUrl} // مسار الفيديو فقط، بدون الـ endpoint
      controls
      className="w-full rounded-xl"
    />
  );
};

export default BookVideo;
