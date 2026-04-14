import { Card } from "@/components/ui/Card";
import { UI_TEXT } from "@/lib/constants";

interface StreamingPreviewProps {
  streamedText: string;
  containerHeight?: number | null;
}

export function StreamingPreview({ streamedText, containerHeight }: StreamingPreviewProps) {
  return (
    <Card
      className="flex min-h-0 flex-col overflow-hidden"
      style={containerHeight ? { height: `${containerHeight}px` } : undefined}
    >
      <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground">{UI_TEXT.streamPreviewTitle}</h2>
      <pre
        className="h-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words rounded-md border border-border bg-background p-4 font-mono text-sm [scrollbar-width:thin] [scrollbar-color:var(--secondary)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-secondary [&::-webkit-scrollbar-thumb:hover]:bg-accent"
      >
        {streamedText || UI_TEXT.streamPreviewFallback}
      </pre>
    </Card>
  );
}
