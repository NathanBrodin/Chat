"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface CopyButtonProps {
  content: string;
  className?: string;
}

export function CopyButton({ content, className }: CopyButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  function onCopy() {
    if (isCopied) return;
    copyToClipboard(content);
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        className,
        "text-muted-foreground opacity-0 transition-all group-hover:opacity-100",
      )}
      onClick={onCopy}
    >
      <CheckIcon
        className="absolute left-0.5 top-0.5 size-4 translate-x-1/2 translate-y-1/2 transition-all"
        style={{
          strokeDasharray: 50,
          strokeDashoffset: isCopied ? 0 : -50,
        }}
      />
      <CopyIcon
        className="absolute left-0.5 top-0.5 size-4 translate-x-1/2 translate-y-1/2 transition-all"
        style={{
          strokeDasharray: 50,
          strokeDashoffset: isCopied ? -50 : 0,
          opacity: isCopied ? 0 : 1,
        }}
      />
    </Button>
  );
}
