"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Copy, Globe } from "lucide-react";
import { toast } from "sonner";

interface StatusCode {
  code: number;
  text: string;
  description: string;
  useCase: string;
  category: string;
}
const STATUS_CODES: StatusCode[] = [
  { code: 100, text: "Continue", description: "The client should continue with the request. Used to tell the client that the initial part of the request has been received.", useCase: "Server acknowledges partial request; client should proceed.", category: "1xx" },
  { code: 101, text: "Switching Protocols", description: "Server is switching to a different protocol as requested by the client.", useCase: "WebSocket handshake upgrade from HTTP.", category: "1xx" },
  { code: 102, text: "Processing", description: "Server has received and is processing the request, but no response is available yet.", useCase: "Preventing timeout on long-running WebDAV requests.", category: "1xx" },
  { code: 103, text: "Early Hints", description: "Used to return some response headers before final HTTP message.", useCase: "Preloading resources before the full response is ready.", category: "1xx" },
  { code: 200, text: "OK", description: "The request was successful. The meaning depends on the HTTP method used.", useCase: "Standard response for successful GET, POST, PUT, DELETE.", category: "2xx" },
  { code: 201, text: "Created", description: "The request succeeded and a new resource was created as a result.", useCase: "POST request that successfully created a new user or record.", category: "2xx" },
  { code: 202, text: "Accepted", description: "Request received but not yet acted upon. Processing happens asynchronously.", useCase: "Triggering a background job or async task via API.", category: "2xx" },
  { code: 203, text: "Non-Authoritative Information", description: "Returned metadata is not from the origin server but from a local or third-party copy.", useCase: "Proxy servers transforming or caching responses.", category: "2xx" },
  { code: 204, text: "No Content", description: "Request succeeded but there is no content to send in the response.", useCase: "DELETE or PUT that does not need to return data.", category: "2xx" },
  { code: 206, text: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", useCase: "Video streaming or resumable file downloads.", category: "2xx" },
  { code: 207, text: "Multi-Status", description: "Multiple status codes for multiple sub-requests in WebDAV.", useCase: "WebDAV PROPFIND responses with multiple resource statuses.", category: "2xx" },
  { code: 208, text: "Already Reported", description: "Members of a DAV binding already enumerated in a previous reply.", useCase: "WebDAV responses avoiding repetition of members.", category: "2xx" },
  { code: 226, text: "IM Used", description: "Server fulfilled a GET request and the response is a result of instance manipulations.", useCase: "Delta encoding in HTTP responses.", category: "2xx" },
  { code: 301, text: "Moved Permanently", description: "The URL of the requested resource has changed permanently. The new URL is given in the response.", useCase: "SEO-friendly permanent redirect from old URL to new URL.", category: "3xx" },
  { code: 302, text: "Found", description: "The URL of the requested resource has changed temporarily. Further changes may occur.", useCase: "Temporary redirect while a page is being updated.", category: "3xx" },
  { code: 303, text: "See Other", description: "Server sends this response to direct the client to get the requested resource at another URI with a GET request.", useCase: "Redirecting after a POST form submission.", category: "3xx" },
  { code: 304, text: "Not Modified", description: "Used for caching. Tells the client that the response has not changed, so it can use its cached version.", useCase: "Browser cache validation with ETag or Last-Modified headers.", category: "3xx" },
  { code: 307, text: "Temporary Redirect", description: "Server sends this response to direct the client to get the requested resource at another URI with the same method.", useCase: "Temporary redirect preserving the original HTTP method.", category: "3xx" },
  { code: 308, text: "Permanent Redirect", description: "Permanent redirect that preserves the HTTP method used in the original request.", useCase: "Permanent API endpoint migration preserving POST method.", category: "3xx" },
  { code: 400, text: "Bad Request", description: "Server cannot process the request due to malformed syntax or invalid request message framing.", useCase: "Invalid JSON body or missing required query parameters.", category: "4xx" },
  { code: 401, text: "Unauthorized", description: "Authentication is required and has not been provided or is invalid.", useCase: "API request without a valid token or session.", category: "4xx" },
  { code: 402, text: "Payment Required", description: "Reserved for future use; sometimes used for digital payment requirements.", useCase: "Paywall or subscription required to access content.", category: "4xx" },
  { code: 403, text: "Forbidden", description: "Client does not have access rights to the content. Unlike 401, the identity is known.", useCase: "Authenticated user trying to access admin-only resource.", category: "4xx" },
  { code: 404, text: "Not Found", description: "The server cannot find the requested resource. The URL is not recognized.", useCase: "Accessing a page or resource that does not exist.", category: "4xx" },
  { code: 405, text: "Method Not Allowed", description: "The request method is known but is not supported for the target resource.", useCase: "Sending DELETE to an endpoint that only supports GET.", category: "4xx" },
  { code: 406, text: "Not Acceptable", description: "Server cannot produce a response matching the list of acceptable values defined in the request headers.", useCase: "API returning only JSON but client asks for XML.", category: "4xx" },
  { code: 408, text: "Request Timeout", description: "Server did not receive a complete request message within the time it was prepared to wait.", useCase: "Client takes too long to send the request body.", category: "4xx" },
  { code: 409, text: "Conflict", description: "The request conflicts with the current state of the server.", useCase: "Trying to create a username that already exists.", category: "4xx" },
  { code: 410, text: "Gone", description: "The target resource is no longer available and will not be available again.", useCase: "Permanently deleted content with no forwarding address.", category: "4xx" },
  { code: 411, text: "Length Required", description: "Server refused the request because the Content-Length header field is missing.", useCase: "POST request without Content-Length header.", category: "4xx" },
  { code: 413, text: "Payload Too Large", description: "Server refuses the request because the payload is larger than the server is willing to process.", useCase: "File upload exceeding the maximum allowed size.", category: "4xx" },
  { code: 414, text: "URI Too Long", description: "The URI requested by the client is longer than the server is willing to interpret.", useCase: "Extremely long query strings in GET requests.", category: "4xx" },
  { code: 415, text: "Unsupported Media Type", description: "Server refuses to accept the request because the payload format is in an unsupported format.", useCase: "Sending XML to an API endpoint that only accepts JSON.", category: "4xx" },
  { code: 422, text: "Unprocessable Entity", description: "Server understands the content type but is unable to process the instructions.", useCase: "Form data with valid JSON but invalid field values.", category: "4xx" },
  { code: 423, text: "Locked", description: "The resource being accessed is locked.", useCase: "WebDAV resource locked by another user.", category: "4xx" },
  { code: 425, text: "Too Early", description: "Indicates the server is unwilling to risk processing a request that might be replayed.", useCase: "Early data in TLS 1.3 connections.", category: "4xx" },
  { code: 429, text: "Too Many Requests", description: "User has sent too many requests in a given amount of time (rate limiting).", useCase: "API rate limit exceeded; client should back off.", category: "4xx" },
  { code: 431, text: "Request Header Fields Too Large", description: "Server refuses to process the request because the header fields are too large.", useCase: "Cookies or custom headers exceeding server limits.", category: "4xx" },
  { code: 451, text: "Unavailable For Legal Reasons", description: "Server is denying access to a resource due to legal demands.", useCase: "Content blocked due to DMCA takedown or legal order.", category: "4xx" },
  { code: 500, text: "Internal Server Error", description: "Server has encountered a situation it does not know how to handle.", useCase: "Unhandled exception in server-side code.", category: "5xx" },
  { code: 501, text: "Not Implemented", description: "Request method is not supported by the server and cannot be handled.", useCase: "Server does not support PATCH method on a resource.", category: "5xx" },
  { code: 502, text: "Bad Gateway", description: "Server, acting as a gateway, got an invalid response from upstream server.", useCase: "Nginx receiving a bad response from the backend app server.", category: "5xx" },
  { code: 503, text: "Service Unavailable", description: "Server is not ready to handle the request. Common causes are down for maintenance or overloaded.", useCase: "Server under maintenance or experiencing high traffic.", category: "5xx" },
  { code: 504, text: "Gateway Timeout", description: "Server acting as a gateway did not get a timely response from the upstream server.", useCase: "Upstream API taking too long to respond.", category: "5xx" },
  { code: 505, text: "HTTP Version Not Supported", description: "HTTP version used in the request is not supported by the server.", useCase: "Client using HTTP/3 with a server that only supports HTTP/1.1.", category: "5xx" },
  { code: 506, text: "Variant Also Negotiates", description: "Server has an internal configuration error in transparent content negotiation.", useCase: "Misconfigured content negotiation on the server.", category: "5xx" },
  { code: 507, text: "Insufficient Storage", description: "Server is unable to store the representation needed to complete the request.", useCase: "WebDAV server running out of storage space.", category: "5xx" },
  { code: 508, text: "Loop Detected", description: "Server detected an infinite loop while processing the request.", useCase: "WebDAV request creating circular references.", category: "5xx" },
  { code: 510, text: "Not Extended", description: "Further extensions to the request are required for the server to fulfil it.", useCase: "Client needs to send an HTTP Extension Framework request.", category: "5xx" },
  { code: 511, text: "Network Authentication Required", description: "Client needs to authenticate to gain network access.", useCase: "Captive portal requiring login before accessing the internet.", category: "5xx" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "1xx", label: "1xx", color: "text-gray-600" },
  { id: "2xx", label: "2xx", color: "text-green-600" },
  { id: "3xx", label: "3xx", color: "text-blue-600" },
  { id: "4xx", label: "4xx", color: "text-orange-600" },
  { id: "5xx", label: "5xx", color: "text-red-600" },
];

function getCategoryStyle(category: string) {
  switch (category) {
    case "1xx": return { code: "text-gray-700 dark:text-gray-300", badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", border: "border-gray-200 dark:border-gray-700" };
    case "2xx": return { code: "text-green-700 dark:text-green-400", badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", border: "border-green-200 dark:border-green-800" };
    case "3xx": return { code: "text-blue-700 dark:text-blue-400", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" };
    case "4xx": return { code: "text-orange-700 dark:text-orange-400", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" };
    case "5xx": return { code: "text-red-700 dark:text-red-400", badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", border: "border-red-200 dark:border-red-800" };
    default: return { code: "text-foreground", badge: "bg-muted text-muted-foreground", border: "border" };
  }
}
export default function HttpStatusCodes() {
  const t = useTranslations("Tools.HttpStatusCodes");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const translatedCodes = useMemo(() =>
    STATUS_CODES.map((s) => ({
      ...s,
      text: t(`codes.${s.code}.text` as any),
      description: t(`codes.${s.code}.description` as any),
      useCase: t(`codes.${s.code}.useCase` as any),
    })),
    [t]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return translatedCodes.filter((s) => {
      const matchesCategory = activeCategory === "all" || s.category === activeCategory;
      if (!q) return matchesCategory;
      return matchesCategory && (
        s.code.toString().includes(q) ||
        s.text.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.useCase.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory, translatedCodes]);

  const copyCode = async (code: number) => {
    try {
      await navigator.clipboard.writeText(code.toString());
      toast.success(t("codeCopied", { code }));
    } catch {
      toast.error(t("failedToCopy"));
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Globe className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-sm">
              {cat.id === "all" ? t("categoryAll") : cat.label}
              <span className="ms-1 text-xs text-muted-foreground">
                ({cat.id === "all" ? STATUS_CODES.length : STATUS_CODES.filter((s) => s.category === cat.id).length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {t("showing", { count: filtered.length, total: STATUS_CODES.length })}
      </div>
      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">{t("noResults")}</p>
          <p className="text-sm">{t("noResultsHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((status) => {
            const style = getCategoryStyle(status.category);
            return (
              <Card key={status.code} className={"border transition-shadow hover:shadow-md " + style.border}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={"text-3xl font-bold tabular-nums " + style.code}>
                        {status.code}
                      </div>
                      <div className="font-semibold text-sm mt-1">{status.text}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className={"text-xs " + style.badge}>{status.category}</Badge>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7"
                        onClick={() => copyCode(status.code)}
                        title={t("copyStatusCode")}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{status.description}</p>
                  <div className="text-xs border-t pt-2 text-muted-foreground">
                    <span className="font-medium text-foreground">{t("useCaseLabel")} </span>
                    {status.useCase}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}