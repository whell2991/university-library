import { cn } from "@/lib/utils";
import Image from "next/image";
import BookCoverSVG from "./BookCoverSVG";
import config from "@/lib/config";

type BookCoverVariant = "extrasmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extrasmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string; // مثال: "books/covers/file.png"
}

const BookCover = ({
  className,
  variant = "medium",
  coverColor,
  coverImage,
}: Props) => {
  const imagekitEndpoint = config.env.imagekit.urlEndpoint;
  const fallbackImage = "png.png";
  const finalCoverImage =  coverImage || fallbackImage
  const isFullUrl =
    finalCoverImage.startsWith("http") || finalCoverImage.startsWith("https");
  const imageUrl = isFullUrl ? coverImage : `${imagekitEndpoint}/${coverImage}`;
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <BookCoverSVG coverColor={coverColor} />
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <Image
          src={imageUrl}
          alt="Book Cover"
          fill
          className="rounded-sm object-fill"
        />
      </div>
    </div>
  );
};

export default BookCover;
