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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeCase, setActiveCase] = useState("uppercase");
  const { toast } = useToast();

  const caseConverters = {
    uppercase: (text: string) => text.toUpperCase(),
    lowercase: (text: string) => text.toLowerCase(),
    titlecase: (text: string) =>
      text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
    camelcase: (text: string) => {
      return text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    },
    pascalcase: (text: string) => {
      return text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, "");
    },
    snakecase: (text: string) => {
      return text
        .replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toLowerCase())
        .join("_");
    },
    kebabcase: (text: string) => {
      return text
        .replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toLowerCase())
        .join("-");
    },
    constantcase: (text: string) => {
      return text
        .replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toUpperCase())
        .join("_");
    },
    sentencecase: (text: string) => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    alternatingcase: (text: string) => {
      return text
        .split("")
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
    },
    inverse: (text: string) => {
      return text
        .split("")
        .map((char) =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
    },
  };

  const handleConvert = (caseType: string) => {
    if (!inputText.trim()) {
      toast({
        title: "No text to convert",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    const converter = caseConverters[caseType as keyof typeof caseConverters];
    if (converter) {
      const converted = converter(inputText);
      setOutputText(converted);
      setActiveCase(caseType);
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({
        title: "Nothing to copy",
        description: "Please convert some text first.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied to clipboard",
      description: "The converted text has been copied to your clipboard.",
    });
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setActiveCase("uppercase");
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (value.trim() && activeCase) {
      const converter =
        caseConverters[activeCase as keyof typeof caseConverters];
      if (converter) {
        setOutputText(converter(value));
      }
    } else {
      setOutputText("");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>
              Enter the text you want to convert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                {inputText.length} characters
              </span>
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
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Converted Text</CardTitle>
            <CardDescription>
              Your text converted to the selected case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Converted text will appear here..."
              value={outputText}
              readOnly
              className="min-h-[200px] resize-none bg-muted"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                {outputText.length} characters
              </span>
              <Button
                onClick={handleCopy}
                disabled={!outputText}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Options */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Case Options</CardTitle>
          <CardDescription>
            Click on any case type to convert your text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCase} onValueChange={setActiveCase}>
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
              <TabsTrigger
                value="uppercase"
                onClick={() => handleConvert("uppercase")}
              >
                UPPER
              </TabsTrigger>
              <TabsTrigger
                value="lowercase"
                onClick={() => handleConvert("lowercase")}
              >
                lower
              </TabsTrigger>
              <TabsTrigger
                value="titlecase"
                onClick={() => handleConvert("titlecase")}
              >
                Title
              </TabsTrigger>
              <TabsTrigger
                value="camelcase"
                onClick={() => handleConvert("camelcase")}
              >
                camelCase
              </TabsTrigger>
              <TabsTrigger
                value="pascalcase"
                onClick={() => handleConvert("pascalcase")}
              >
                PascalCase
              </TabsTrigger>
              <TabsTrigger
                value="snakecase"
                onClick={() => handleConvert("snakecase")}
              >
                snake_case
              </TabsTrigger>
              <TabsTrigger
                value="kebabcase"
                onClick={() => handleConvert("kebabcase")}
              >
                kebab-case
              </TabsTrigger>
              <TabsTrigger
                value="constantcase"
                onClick={() => handleConvert("constantcase")}
              >
                CONSTANT
              </TabsTrigger>
              <TabsTrigger
                value="sentencecase"
                onClick={() => handleConvert("sentencecase")}
              >
                Sentence
              </TabsTrigger>
              <TabsTrigger
                value="alternatingcase"
                onClick={() => handleConvert("alternatingcase")}
              >
                aLtErNaTiNg
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => handleConvert("inverse")}
              className="w-full"
            >
              InVeRsE cAsE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
