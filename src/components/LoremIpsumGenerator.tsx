"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, RotateCcw, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NumberFlow from "@number-flow/react";

const loremWords = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "dolor",
  "in",
  "reprehenderit",
  "in",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "dolore",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "in",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "sed",
  "ut",
  "perspiciatis",
  "unde",
  "omnis",
  "iste",
  "natus",
  "error",
  "sit",
  "voluptatem",
  "accusantium",
  "doloremque",
  "laudantium",
  "totam",
  "rem",
  "aperiam",
  "eaque",
  "ipsa",
  "quae",
  "ab",
  "illo",
  "inventore",
  "veritatis",
  "et",
  "quasi",
  "architecto",
  "beatae",
  "vitae",
  "dicta",
  "sunt",
  "explicabo",
  "nemo",
  "enim",
  "ipsam",
  "voluptatem",
  "quia",
  "voluptas",
  "sit",
  "aspernatur",
  "aut",
  "odit",
  "aut",
  "fugit",
  "sed",
  "quia",
  "consequuntur",
  "magni",
  "dolores",
  "eos",
  "qui",
  "ratione",
  "voluptatem",
  "sequi",
  "nesciunt",
  "neque",
  "porro",
  "quisquam",
  "est",
  "qui",
  "dolorem",
  "ipsum",
  "quia",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipisci",
  "velit",
  "sed",
  "quia",
  "non",
  "numquam",
  "eius",
  "modi",
  "tempora",
  "incidunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magnam",
  "aliquam",
  "quaerat",
  "voluptatem",
  "ut",
  "enim",
  "ad",
  "minima",
  "veniam",
  "quis",
  "nostrum",
  "exercitationem",
  "ullam",
  "corporis",
  "suscipit",
  "laboriosam",
];

const loremSentences = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "Consectetur, adipisci velit, sed quia non numquam eius modi tempora.",
  "Incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
];

export default function LoremIpsumGenerator() {
  const [generatedText, setGeneratedText] = useState("");
  const [count, setCount] = useState(5);
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">(
    "paragraphs"
  );
  const [startWithLorem, setStartWithLorem] = useState(true);
  const { toast } = useToast();

  const generateRandomWords = (numWords: number): string => {
    const words = [];
    for (let i = 0; i < numWords; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(" ");
  };

  const generateRandomSentences = (numSentences: number): string => {
    const sentences = [];
    for (let i = 0; i < numSentences; i++) {
      sentences.push(
        loremSentences[Math.floor(Math.random() * loremSentences.length)]
      );
    }
    return sentences.join(" ");
  };

  const generateParagraph = (): string => {
    const numSentences = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
    return generateRandomSentences(numSentences);
  };

  const generateLoremIpsum = () => {
    let text = "";

    if (type === "words") {
      text = generateRandomWords(count);
    } else if (type === "sentences") {
      text = generateRandomSentences(count);
    } else if (type === "paragraphs") {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      text = paragraphs.join("\n\n");
    }

    if (startWithLorem && type !== "words") {
      text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
    }

    setGeneratedText(text);
  };

  const handleCopy = () => {
    if (!generatedText) {
      toast({
        title: "No text to copy",
        description: "Please generate some text first.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied to clipboard",
      description: "The generated text has been copied to your clipboard.",
    });
  };

  const handleClear = () => {
    setGeneratedText("");
  };

  const handleCountChange = (value: string) => {
    const num = parseInt(value);
    if (num > 0 && num <= 1000) {
      setCount(num);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground">
          Generate placeholder text for your designs, mockups, and prototypes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Generator Options</CardTitle>
            <CardDescription>Customize your Lorem Ipsum text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Generate</Label>
              <Select
                value={type}
                onValueChange={(value: "words" | "sentences" | "paragraphs") =>
                  setType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Count</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => handleCountChange(e.target.value)}
                placeholder="Enter count"
              />
              <p className="text-xs text-muted-foreground">
                Maximum 1000 {type}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="start-with-lorem"
                checked={startWithLorem}
                onCheckedChange={setStartWithLorem}
                disabled={type === "words"}
              />
              <Label htmlFor="start-with-lorem">Start with "Lorem ipsum"</Label>
            </div>

            <div className="space-y-2">
              <Button onClick={generateLoremIpsum} className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Text
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Text */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Text</CardTitle>
              <CardDescription>
                Your Lorem Ipsum placeholder text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Generated text will appear here..."
                value={generatedText}
                readOnly
                className="min-h-[400px] resize-none bg-muted"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  <NumberFlow value={generatedText.length} /> characters
                </span>
                <Button
                  onClick={handleCopy}
                  disabled={!generatedText}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Text
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Generate Buttons */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Generate</CardTitle>
          <CardDescription>
            Generate common amounts with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setType("paragraphs");
                setCount(1);
                generateLoremIpsum();
              }}
            >
              1 Paragraph
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setType("paragraphs");
                setCount(3);
                generateLoremIpsum();
              }}
            >
              3 Paragraphs
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setType("words");
                setCount(50);
                generateLoremIpsum();
              }}
            >
              50 Words
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setType("sentences");
                setCount(5);
                generateLoremIpsum();
              }}
            >
              5 Sentences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">About Lorem Ipsum</h3>
          <p className="text-sm text-muted-foreground">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. It has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It is commonly used in
            web design, graphic design, and publishing as placeholder text.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
