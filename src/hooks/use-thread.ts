import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export function useThread(title: string) {
  const createThread = useMutation(api.thread.createNewThread);
  const [threadId, setThreadId] = useState<string | undefined>(
    typeof window !== "undefined" ? getThreadIdFromHash() : undefined,
  );

  // Listen for hash changes
  useEffect(() => {
    function onHashChange() {
      setThreadId(getThreadIdFromHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const resetThread = useCallback(() => {
    return createThread({
      title,
    }).then((newId) => {
      window.location.hash = newId;
      setThreadId(newId);
    });
  }, [createThread, title]);

  // On mount or when threadId changes, if no threadId, create one and set hash
  useEffect(() => {
    if (!threadId) {
      void resetThread();
    }
  }, [resetThread, threadId]);

  return { threadId, resetThread, setThreadId };
}

function getThreadIdFromHash() {
  return window.location.hash.replace(/^#/, "") || undefined;
}
