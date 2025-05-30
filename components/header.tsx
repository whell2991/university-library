"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn, getinitials } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  const pathName = usePathname();
  console.log("Session:", session);
  return (
    <header className="my-10 flex justify-between gap-5 ">
      <Link href="/" className="flex flex-row items-center gap-3 ">
        <Image
          src="/icons/logo.svg"
          alt="Logo | Book Wise"
          width={40}
          height={40}
        />{" "}
        <span className="font-semibold text-white text-[24px]">Book Wise</span>
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/Library"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathName === "/library" ? "text-light-200" : "text-light-100"
            )}
          >
            Library
          </Link>
        </li>
        <li>
          <Link href="/my-profile" className="flex flex-row items-center gap-1">
            <Avatar>
              <AvatarFallback className="text-black bg-amber-100 font-semibold">
                {getinitials(session?.user?.name || "BW")}
              </AvatarFallback>
            </Avatar>
            <span className="text-light-100 max-sm:hidden">
              {session?.user?.name}
            </span>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
