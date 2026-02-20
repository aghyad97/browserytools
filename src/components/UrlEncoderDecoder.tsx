"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Trash2, ArrowRightLeft, FileText } from "lucide-react";

const SAMPLE_URL = "https://example.com/search?q=hello world&lang=en&filter=a+b";
const SAMPLE_TEXT = "Hello World! Special chars: @#$%^&*() URL: https://example.com/path?foo=bar";

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tab, setTab] = useState("encode");
  const [fullUrl, setFullUrl] = useState(false);

  useEffect(() => {
    if (!input.trim()) { setOutput(""); return; }
    try {
      if (tab === "encode") {
        setOutput(fullUrl ? encodeURI(input) : encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch { setOutput(""); }
  }, [input, tab, fullUrl]);

  const handleEncode = () => {
    if (!input.trim()) { toast.error("Please enter input"); return; }
    try {
      setOutput(fullUrl ? encodeURI(input) : encodeURIComponent(input));
      toast.success("Encoded successfully");
    } catch (e) { toast.error("Encoding failed: " + (e instanceof Error ? e.message : String(e))); }
  };

  const handleDecode = () => {
    if (!input.trim()) { toast.error("Please enter input"); return; }
    try {
      setOutput(decodeURIComponent(input));
      toast.success("Decoded successfully");
    } catch (e) { toast.error("Decoding failed: " + (e instanceof Error ? e.message : String(e))); }
  };

  const handleSwap = () => { setInput(output); setOutput(input); };
  const handleClear = () => { setInput(""); setOutput(""); };

  const handleCopy = async () => {
    if (!output) { toast.error("Nothing to copy"); return; }
    try { await navigator.clipboard.writeText(output); toast.success("Copied to clipboard"); }
    catch { toast.error("Failed to copy to clipboard"); }
  };

  const handleLoadSample = () => { setInput(fullUrl ? SAMPLE_URL : SAMPLE_TEXT); };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex flex-wrap items-center gap-2">
              <TabsList>
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>
              <Button onClick={tab === "encode" ? handleEncode : handleDecode}>
                {tab === "encode" ? "Encode" : "Decode"}
              </Button>
              <Button variant="outline" onClick={handleSwap}><ArrowRightLeft className="h-4 w-4 mr-2" />Swap</Button>
              <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 mr-2" />Copy</Button>
              <Button variant="outline" onClick={handleLoadSample}><FileText className="h-4 w-4 mr-2" />Load Sample</Button>
              <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 mr-2" />Clear</Button>
              <div className="flex items-center gap-2 ml-auto">
                <Switch id="full-url" checked={fullUrl} onCheckedChange={setFullUrl} />
                <Label htmlFor="full-url" className="text-sm text-muted-foreground whitespace-nowrap">Encode full URL</Label>
              </div>
            </div>
            <TabsContent value={tab} className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tab === "encode" ? "Text to encode" : "Text to decode"}</span>
                    {input && <span className="text-xs text-muted-foreground">{input.length} chars</span>}
                  </div>
                  <Textarea placeholder="Enter text here..." className="min-h-[420px] font-mono text-sm resize-none" value={input} onChange={(e) => setInput(e.target.value)} />
                </Card>
                <Card className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Output</span>
                    {output && <span className="text-xs text-muted-foreground">{output.length} chars</span>}
                  </div>
                  <Textarea placeholder="Output will appear here..." className="min-h-[420px] font-mono text-sm resize-none" value={output} readOnly />
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
