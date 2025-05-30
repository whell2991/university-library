"use client";

import Image from "next/image";
import { ImageKitProvider, upload } from "@imagekit/next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";

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

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const authParams = await authenticator();

      const result = await upload({
        file,
        fileName: file.name,
        ...authParams,
        publicKey: publicKey ?? "",
      });

      toast({
        title: "Image Uploaded",
        description: "Image uploaded successfully.",
      });

      if (result.url) {
        onChange?.(result.url); // 👈 هنا ترجع string صافية
      }
    } catch {
      toast({
        title: "Upload Failed",
        description: "Image upload failed.",
        variant: "destructive",
      });
    }
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button
        type="button"
        className="upload-btn"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image src="/icons/upload.svg" alt="upload" width={24} height={24} />
        {!value && <p className="text-base text-light-100">Upload a File</p>}
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

      {value && (
        <div className="mt-4">
          <Image src={value} alt="Preview" width={300} height={300} />
        </div>
      )}
    </ImageKitProvider>
  );
};
export default ImageUpload;

// const ImageUpload = () => {
//   const [fileUrl, setFileUrl] = useState<{ filePath: string } | null>(null);
//   const [copied, setCopied] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const authParams = await authenticator();

//       const result = await upload({
//         file,
//         fileName: file.name,
//         ...authParams,
//         publicKey: publicKey ?? "",
//       });

//       toast({
//         title: "Image Uploaded",
//         description: "Your image has uploaded successfully",
//       });
//       setFileUrl(result.url ? { filePath: result.url } : null);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       toast({
//         title: "Image Failed",
//         description: "Your image can not be uploaded",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <ImageKitProvider urlEndpoint={urlEndpoint}>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       <Button type="button" className="upload-btn" onClick={handleButtonClick}>
//         <Image
//           src="/icons/upload.svg"
//           alt="upload"
//           width={24}
//           height={24}
//           style={{ height: "auto" }}
//           className="object-contain"
//         />
//         {!fileUrl && <p className="text-base text-light-100">Upload a File</p>}
//         {fileUrl && (
//           <span
//             className="upload-filename cursor-pointer hover:text-white hover:font-semibold"
//             title={fileUrl.filePath}
//             onClick={(e) => {
//               e.stopPropagation(); // ✅ يمنع تشغيل رفع الصورة
//               navigator.clipboard.writeText(fileUrl.filePath);
//               setCopied(true);
//               setTimeout(() => setCopied(false), 1500);
//             }}
//           >
//             {copied ? "Copied!" : fileUrl.filePath}
//           </span>
//         )}
//       </Button>

//       {fileUrl && (
//         <div className="mt-4">
//           <p className="text-sm text-gray-300">Preview:</p>
//           <Image
//             src={fileUrl.filePath}
//             alt="Uploaded"
//             width={300}
//             height={300}
//             className="rounded-md mt-2 object-cover"
//           />
//         </div>
//       )}
//     </ImageKitProvider>
//   );
// };

// export default ImageUpload;
