/** Splits an approved three-part line ("Strategy. Technology. Growth.") into the About scene's words. */
export function sceneWords(copy: { text: string } | null): readonly [string, string, string] {
  const parts = (copy?.text ?? "").split(" ").filter(Boolean);
  return [parts[0] ?? "", parts[1] ?? "", parts.slice(2).join(" ")];
}
