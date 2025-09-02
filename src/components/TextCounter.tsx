"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  RotateCcw,
  FileText,
  Hash,
  AlignLeft,
  Type,
  Clock,
  Mic,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NumberFlow from "@number-flow/react";
import { useTextCounterStore } from "@/store/text-counter-store";

export default function TextCounter() {
  const { text, stats, setText, clearText } = useTextCounterStore();
  const { toast } = useToast();

  const handleCopy = () => {
    if (!text) {
      toast({
        title: "No text to copy",
        description: "Please enter some text first.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const handleClear = () => {
    clearText();
  };

  const handleSampleText = () => {
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`;

    setText(sampleText);
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    suffix = "",
  }: {
    icon: any;
    title: string;
    value: number;
    description: string;
    suffix?: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              <NumberFlow value={value} />
              {suffix && (
                <span className="text-lg text-muted-foreground ml-1">
                  {suffix}
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Text Input - Full Width */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Text Input</CardTitle>
          <CardDescription>Enter or paste your text to analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your text here to see detailed statistics..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSampleText}>
                Load Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            </div>
            <Button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Detailed analysis of your text</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <StatCard
                icon={Type}
                title="Characters"
                value={stats.characters}
                description="Including spaces"
              />
              <StatCard
                icon={Hash}
                title="Characters"
                value={stats.charactersNoSpaces}
                description="Without spaces"
              />
              <StatCard
                icon={FileText}
                title="Words"
                value={stats.words}
                description="Total word count"
              />
              <StatCard
                title="Lines"
                value={stats.lines}
                description="Line breaks"
                icon={AlignLeft}
              />
              <StatCard
                title="Paragraphs"
                value={stats.paragraphs}
                description="Paragraph breaks"
                icon={FileText}
              />
              <StatCard
                title="Sentences"
                value={stats.sentences}
                description="Sentence count"
                icon={Type}
              />
              <StatCard
                title="Reading Time"
                value={stats.readingTime}
                description="225 words per minute"
                icon={Clock}
                suffix="min"
              />
              <StatCard
                title="Speaking Time"
                value={stats.speakingTime}
                description="155 words per minute"
                icon={Mic}
                suffix="min"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
