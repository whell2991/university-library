"use client";

import Image from "next/image";
import { ImageKitProvider, upload } from "@imagekit/next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorText}`);
    }

    const { signature, expire, token } = await response.json();
    return { signature, expire, token };
  } catch (error) {
    console.error("Auth Error", error);
    throw new Error("Authentication failed");
  }
};

interface Props {
  type: "image" | "video";
  value?: string;
  accept: string;
  placeholder?: string;
  folder?: string;
  variant?: "dark" | "light";
  onChange?: (url: string) => void;
}

const FileUpload = ({
  value,
  onChange,
  type,
  accept,
  placeholder,
  folder,
  variant,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filePath, setFilePath] = useState(""); // ✅ هنا
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const style = {
    button: variant === "dark" ? "bg-dark-500" : "bg-light-600",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-500",
  };

  const onValidate = (file: File) => {
    if (type === "image" && file.size > 20 * 1024 * 1024) {
      toast({
        title: "Image Too Large",
        description: "Please upload an image less than 20MB.",
        variant: "destructive",
      });
      return false;
    }

    if (type === "video" && file.size > 100 * 1024 * 1024) {
      toast({
        title: "Video Too Large",
        description: "Please upload a video less than 100MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const startFakeProgress = () => {
    let current = 0;
    progressRef.current = setInterval(() => {
      current += 5;
      if (current >= 95) {
        clearInterval(progressRef.current!);
      }
      setProgress(current);
    }, 200);
  };

  const stopFakeProgress = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!onValidate(file)) return;

    // توليد اسم فريد
    const uniqueFileName = `${Date.now()}-${file.name}`;

    try {
      const authParams = await authenticator();

      startFakeProgress(); // ✅ تبدأ العد

      const result = await upload({
        file,
        fileName: uniqueFileName,
        ...authParams,
        publicKey: publicKey ?? "",
        folder: folder ?? "/",
      });

      setProgress(100);
      setFilePath(result.filePath ?? ""); // ✅ خزّنه هنا

      toast({
        title: `${type} Uploaded`,
        description: `${result.filePath} uploaded successfully.`,
      });

      if (result.url) {
        onChange?.(result.url);
      }
    } catch {
      toast({
        title: `${type} Upload Failed`,
        description: `${type} upload failed.`,
        variant: "destructive",
      });
    } finally {
      stopFakeProgress(); // ✅ تنهي العد
    }
  };
  console.log("Uploaded value:", value);
  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
        placeholder={placeholder}
      />

      <Button
        type="button"
        className={`upload-btn ${style.button}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Image src="/icons/upload.svg" alt="upload" width={24} height={24} />
        {!value && (
          <p className={cn("text-base", style.placeholder)}>{placeholder}</p>
        )}

        {filePath && (
          <p className={cn("upload-filename", style.text)}>{filePath}</p>
        )}
        {value && (
          <span
            className="upload-filename cursor-pointer hover:text-white hover:font-semibold"
            onClick={() => {
              navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied!" : value}
          </span>
        )}
      </Button>

      {progress > 0 && progress < 100 && (
        <div className="mt-2 text-sm text-gray-400">
          {progress}% uploading...
        </div>
      )}

      {value && (
        <div className="mt-4">
          {type === "image" ? (
            <Image src={value} alt="Preview" width={300} height={300} />
          ) : (
            <video
              src={value}
              width={300}
              height={300}
              controls
              className="rounded-md mt-2 object-cover"
            />
          )}
        </div>
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
