"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  FileText,
  Calendar,
  DollarSign,
  Trash2,
  Copy,
  Search,
  Filter,
} from "lucide-react";
import { useInvoiceStore, InvoiceData } from "@/store/invoice-store";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface InvoiceManagerProps {
  onSelectInvoice: (invoice: InvoiceData) => void;
  onCreateNew: () => void;
}

export default function InvoiceManager({
  onSelectInvoice,
  onCreateNew,
}: InvoiceManagerProps) {
  const t = useTranslations("Tools.InvoiceGenerator");
  const { invoices, deleteInvoice, duplicateInvoice } = useInvoiceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "total">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedInvoices = invoices
    .filter((invoice) => {
      const query = searchQuery.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.company.name.toLowerCase().includes(query) ||
        invoice.client.name.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "name":
          comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
          break;
        case "total":
          comparison = a.total - b.total;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleDeleteInvoice = (id: string, invoiceNumber: string) => {
    deleteInvoice(id);
    toast.success(t("invoiceDeleted"));
  };

  const handleDuplicateInvoice = (id: string) => {
    const duplicated = duplicateInvoice(id);
    if (duplicated) {
      onSelectInvoice(duplicated);
      toast.success(t("invoiceDuplicated"));
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `$${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {t("manageSubtitle")}
          </p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("newInvoice")}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            {t("searchFilter")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">{t("searchInvoices")}</Label>
              <Input
                id="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("sortBy")}</Label>
              <Select
                value={sortBy}
                onValueChange={(val: "date" | "name" | "total") =>
                  setSortBy(val)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">{t("sortLastModified")}</SelectItem>
                  <SelectItem value="name">{t("sortInvoiceNumber")}</SelectItem>
                  <SelectItem value="total">{t("sortTotalAmount")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("order")}</Label>
              <Select
                value={sortOrder}
                onValueChange={(val: "asc" | "desc") => setSortOrder(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">{t("newestFirst")}</SelectItem>
                  <SelectItem value="asc">{t("oldestFirst")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedInvoices.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("noInvoicesFound")}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery ? t("noInvoicesSearchMsg") : t("noInvoicesMsg")}
                </p>
                <Button onClick={onCreateNew}>
                  <Plus className="w-4 h-4 me-2" />
                  {t("createFirstInvoice")}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredAndSortedInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {invoice.invoiceNumber}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {invoice.company.name || t("untitledCompany")}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {invoice.currency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(invoice.date).toLocaleDateString()} -{" "}
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>{invoice.client.name || t("noClient")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onSelectInvoice(invoice)}
                    className="flex-1"
                  >
                    {t("open")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicateInvoice(invoice.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("deleteInvoice")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("deleteConfirm", { number: invoice.invoiceNumber })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteInvoice(
                              invoice.id,
                              invoice.invoiceNumber
                            )
                          }
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t("delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      {invoices.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <div className="text-sm text-muted-foreground">
                  {t("totalInvoices")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    invoices.reduce((sum, inv) => sum + inv.total, 0),
                    "USD"
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{t("totalValue")}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {
                    invoices.filter((inv) => new Date(inv.dueDate) < new Date())
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">{t("overdue")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
