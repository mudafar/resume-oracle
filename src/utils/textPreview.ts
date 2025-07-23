export interface TextPreview {
  preview: string;
  isExpandable: boolean;
}

/**
 * Generate a preview of text content for display in collapsed cards
 * @param text - The full text content
 * @param maxLines - Maximum number of lines to show (default: 3)
 * @param maxChars - Maximum characters to show if no line breaks (default: 300)
 * @returns Object with preview text and whether content is expandable
 */
export function generateTextPreview(
  text: string,
  maxLines: number = 3,
  maxChars: number = 300
): TextPreview {
  if (!text || text.trim().length === 0) {
    return { preview: "", isExpandable: false };
  }

  const lines = text.split("\n");
  
  // If text has line breaks, use line-based preview
  if (lines.length > 1) {
    const preview = lines.slice(0, maxLines).join("\n");
    const isExpandable = lines.length > maxLines;
    return { preview, isExpandable };
  }
  
  // If no line breaks, use character-based preview
  const isExpandable = text.length > maxChars;
  const preview = isExpandable ? text.slice(0, maxChars) + "..." : text;
  
  return { preview, isExpandable };
} 