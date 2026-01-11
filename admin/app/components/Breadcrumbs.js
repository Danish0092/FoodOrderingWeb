'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname(); 
  const segments = pathname.split("/").filter(Boolean); 

  const buildHref = (index) => "/" + segments.slice(0, index + 1).join("/");

  if (!segments.length) return null; 

  return (
    <nav className="bg-black px-10 flex items-center text-white py-4 text-sm">
      <Link href="/" className="hover:underline">
        Dashboard
      </Link>
      {segments.map((segment, idx) => (
        <div key={idx} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link
            href={buildHref(idx)}
            className="capitalize hover:underline"
          >
            {segment.replace(/-/g, " ")}
          </Link>
        </div>
      ))}
    </nav>
  );
}
