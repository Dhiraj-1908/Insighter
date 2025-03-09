"use client";
// components/SourceBar.tsx
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Source } from "@/lib/types";
import Image from "next/image";

interface SourceBarProps {
  sources: Source[];
}

export const SourceBar: React.FC<SourceBarProps> = ({ sources }) => {
  // Track which favicons have failed to load
  // Use string keys for the object but allow storing IDs of different types
  const [failedFavicons, setFailedFavicons] = useState<{[key: string]: boolean}>({});

  const handleImageError = (sourceId: string | number) => {
    // Convert the ID to string to use as object key
    const idKey = String(sourceId);
    setFailedFavicons(prev => ({
      ...prev,
      [idKey]: true
    }));
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center mb-2">
        <ArrowRight className="w-4 h-4 mr-1" />
        <h3 className="text-sm font-medium">Sources</h3>
      </div>
      <div className="space-y-1">
        {sources.map((source) => {
          // Convert ID to string for lookup
          const sourceIdKey = String(source.id);
          
          return (
            <div key={sourceIdKey} className="flex items-start gap-3">
              {failedFavicons[sourceIdKey] ? (
                <Image
                  src="/image.png"
                  alt={`${source.title} favicon`}
                  width={16}
                  height={16}
                  className="mt-1"
                />
              ) : (
                <Image
                  src={source.favicon || "/image.png"}
                  alt={`${source.title} favicon`}
                  width={16}
                  height={16}
                  className="mt-1"
                  onError={() => handleImageError(source.id)}
                  unoptimized
                />
              )}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {source.title}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};