"use client";
// components/SourceBar.tsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { Source } from "@/lib/types";
import Image from "next/image";

interface SourceBarProps {
  sources: Source[];
}

export const SourceBar: React.FC<SourceBarProps> = ({ sources }) => {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center mb-2">
        <ArrowRight className="w-4 h-4 mr-1" />
        <h3 className="text-sm font-medium">Sources</h3>
      </div>
      <div className="space-y-1">
        {sources.map((source) => (
          <div key={source.id} className="flex items-start gap-3">
            <Image
             src={source.favicon || "/pic.jpg"}
              alt={`${source.title} favicon`}
              width={16}
              height={16}
              className="mt-1"
            />
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {source.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
