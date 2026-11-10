import { isVisible, type Copy } from "@/lib/content";
import { Draft } from "./Placeholder";

/**
 * Renders a piece of site copy according to its status:
 * approved → plain text; draft → marked in review builds, omitted in production.
 */
export function CopyText({ copy }: { copy: Copy | null | undefined }) {
  if (!isVisible(copy)) return null;
  if (copy.status === "approved") return <>{copy.text}</>;
  return <Draft>{copy.text}</Draft>;
}
