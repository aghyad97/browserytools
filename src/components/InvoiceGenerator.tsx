"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Download,
  Eye,
  FileText,
  Calculator,
  Building2,
  User,
  Calendar,
  Hash,
  DollarSign,
  Save,
  FolderOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import NumberFlow from "@number-flow/react";
import {
  useInvoiceStore,
  InvoiceData,
  InvoiceItem,
  CompanyDetails,
  ClientDetails,
} from "@/store/invoice-store";
import InvoiceManager from "@/components/InvoiceManager";
import { uniqueCurrencies } from "@/lib/currencies";
import { setPreferredCurrency } from "@/lib/utils";

export default function InvoiceGenerator() {
  const [activeTab, setActiveTab] = useState("details");
  const [showManager, setShowManager] = useState(true); // Start with manager view
  const { toast } = useToast();

  const {
    currentInvoice,
    createNewInvoice,
    saveInvoice,
    updateCurrentInvoice,
    setCurrentInvoice,
  } = useInvoiceStore();

  // Don't auto-create invoice - let user choose from manager

  const invoiceData = currentInvoice;

  const currencyFormatter = (value: number) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: invoiceData?.currency || "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(value);
    } catch {
      return `$${value.toFixed(2)}`;
    }
  };

  const calculateTotals = (
    items: InvoiceItem[],
    taxRate: number,
    discount: number
  ) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal - discount) * (taxRate / 100);
    const total = subtotal - discount + taxAmount;

    return { subtotal, taxAmount, total };
  };

  const updateInvoiceData = (updates: Partial<InvoiceData>) => {
    if (!invoiceData) return;

    const newData = { ...invoiceData, ...updates };

    // Recalculate totals when items, tax rate, or discount changes
    if (
      updates.items ||
      updates.taxRate !== undefined ||
      updates.discount !== undefined
    ) {
      const { subtotal, taxAmount, total } = calculateTotals(
        updates.items || invoiceData.items,
        updates.taxRate !== undefined ? updates.taxRate : invoiceData.taxRate,
        updates.discount !== undefined ? updates.discount : invoiceData.discount
      );
      newData.subtotal = subtotal;
      newData.taxAmount = taxAmount;
      newData.total = total;
    }

    updateCurrentInvoice(newData);
  };

  const addInvoiceItem = () => {
    if (!invoiceData) return;

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    updateInvoiceData({
      items: [...invoiceData.items, newItem],
    });
  };

  const removeInvoiceItem = (id: string) => {
    if (!invoiceData || invoiceData.items.length <= 1) return;

    updateInvoiceData({
      items: invoiceData.items.filter((item) => item.id !== id),
    });
  };

  const updateInvoiceItem = (
    id: string,
    field: keyof InvoiceItem,
    value: any
  ) => {
    if (!invoiceData) return;

    const updatedItems = invoiceData.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    updateInvoiceData({ items: updatedItems });
  };

  const handleSaveInvoice = () => {
    if (invoiceData) {
      saveInvoice(invoiceData);
      toast({
        title: "Invoice Saved",
        description: `Invoice ${invoiceData.invoiceNumber} has been saved.`,
      });
    }
  };

  const handleSelectInvoice = (invoice: InvoiceData) => {
    setCurrentInvoice(invoice);
    setShowManager(false);
    setActiveTab("details");
    toast({
      title: "Invoice Loaded",
      description: `Invoice ${invoice.invoiceNumber} has been loaded.`,
    });
  };

  const handleCreateNew = () => {
    createNewInvoice();
    setShowManager(false);
    setActiveTab("details");
    toast({
      title: "New Invoice Created",
      description: "A new invoice has been created.",
    });
  };

  const handleBackToManager = () => {
    setShowManager(true);
    setActiveTab("details");
  };

  const generatePDF = () => {
    if (!invoiceData) return;

    try {
      const pdf = new jsPDF({ format: invoiceData.pageSize });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      if (invoiceData.company.logoDataUrl) {
        try {
          // Create a much smaller box for the logo (60x20 points)
          const logoBoxWidth = 60;
          const logoBoxHeight = 20;
          const logoX = pageWidth - logoBoxWidth - 20;
          const logoY = yPosition - 5;

          // Add a subtle border around the logo box
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.5);
          pdf.rect(logoX, logoY, logoBoxWidth, logoBoxHeight);

          // Fill the entire box (cover behavior)
          const padding = 2;
          const logoWidth = logoBoxWidth - padding * 2; // 56 points max
          const logoHeight = logoBoxHeight - padding * 2; // 16 points max

          // Position logo to fill the entire box area
          const logoStartX = logoX + padding;
          const logoStartY = logoY + padding;

          // Add the logo to fill the entire box (cover behavior)
          pdf.addImage(
            invoiceData.company.logoDataUrl,
            "JPEG", // Force JPEG format
            logoStartX,
            logoStartY,
            logoWidth,
            logoHeight,
            undefined,
            "FAST"
          );
        } catch (error) {
          // Fallback to text if logo fails to load
          pdf.text("INVOICE", pageWidth - 60, yPosition);
        }
      } else {
        pdf.text("INVOICE", pageWidth - 60, yPosition);
      }
      yPosition += 20;

      // Company Details
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(invoiceData.company.name || "Your Company Name", 20, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      if (invoiceData.company.address) {
        pdf.text(invoiceData.company.address, 20, yPosition);
        yPosition += 6;
      }
      if (
        invoiceData.company.city ||
        invoiceData.company.state ||
        invoiceData.company.zipCode
      ) {
        const cityStateZip = [
          invoiceData.company.city,
          invoiceData.company.state,
          invoiceData.company.zipCode,
        ]
          .filter(Boolean)
          .join(", ");
        pdf.text(cityStateZip, 20, yPosition);
        yPosition += 6;
      }
      if (invoiceData.company.country) {
        pdf.text(invoiceData.company.country, 20, yPosition);
        yPosition += 6;
      }
      if (invoiceData.company.email) {
        pdf.text(`Email: ${invoiceData.company.email}`, 20, yPosition);
        yPosition += 6;
      }
      if (invoiceData.company.phone) {
        pdf.text(`Phone: ${invoiceData.company.phone}`, 20, yPosition);
        yPosition += 6;
      }

      yPosition += 10;

      // Invoice Details
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Invoice #: ${invoiceData.invoiceNumber}`,
        pageWidth - 60,
        yPosition
      );
      yPosition += 6;
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Date: ${new Date(invoiceData.date).toLocaleDateString()}`,
        pageWidth - 60,
        yPosition
      );
      yPosition += 6;
      pdf.text(
        `Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`,
        pageWidth - 60,
        yPosition
      );
      yPosition += 20;

      // Client Details
      pdf.setFont("helvetica", "bold");
      pdf.text("Bill To:", 20, yPosition);
      yPosition += 6;
      pdf.setFont("helvetica", "normal");
      pdf.text(invoiceData.client.name || "Client Name", 20, yPosition);
      yPosition += 6;

      if (invoiceData.client.address) {
        pdf.text(invoiceData.client.address, 20, yPosition);
        yPosition += 6;
      }
      if (
        invoiceData.client.city ||
        invoiceData.client.state ||
        invoiceData.client.zipCode
      ) {
        const cityStateZip = [
          invoiceData.client.city,
          invoiceData.client.state,
          invoiceData.client.zipCode,
        ]
          .filter(Boolean)
          .join(", ");
        pdf.text(cityStateZip, 20, yPosition);
        yPosition += 6;
      }
      if (invoiceData.client.country) {
        pdf.text(invoiceData.client.country, 20, yPosition);
        yPosition += 6;
      }

      yPosition += 20;

      // Items Table
      pdf.setFont("helvetica", "bold");
      pdf.text("Description", 20, yPosition);
      pdf.text("Qty", 120, yPosition);
      pdf.text("Rate", 140, yPosition);
      pdf.text("Amount", pageWidth - 30, yPosition, { align: "right" });
      yPosition += 6;

      // Table line
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      invoiceData.items.forEach((item) => {
        if (item.description) {
          pdf.text(item.description, 20, yPosition);
          pdf.text(item.quantity.toString(), 120, yPosition);
          pdf.text(`${currencyFormatter(item.rate)}`, 140, yPosition);
          pdf.text(
            `${currencyFormatter(item.amount)}`,
            pageWidth - 30,
            yPosition,
            {
              align: "right",
            }
          );
          yPosition += 6;
        }
      });

      yPosition += 10;

      // Totals
      const totalsX = pageWidth - 80;
      pdf.setFont("helvetica", "normal");
      pdf.text("Subtotal:", totalsX, yPosition);
      pdf.text(
        `${currencyFormatter(invoiceData.subtotal)}`,
        pageWidth - 30,
        yPosition,
        { align: "right" }
      );
      yPosition += 6;

      if (invoiceData.discount > 0) {
        pdf.text("Discount:", totalsX, yPosition);
        pdf.text(
          `-${currencyFormatter(invoiceData.discount)}`,
          pageWidth - 30,
          yPosition,
          { align: "right" }
        );
        yPosition += 6;
      }

      if (invoiceData.taxRate > 0) {
        pdf.text(`Tax (${invoiceData.taxRate}%):`, totalsX, yPosition);
        pdf.text(
          `${currencyFormatter(invoiceData.taxAmount)}`,
          pageWidth - 30,
          yPosition,
          { align: "right" }
        );
        yPosition += 6;
      }

      // Total line
      pdf.line(totalsX, yPosition + 2, pageWidth - 20, yPosition + 2);
      yPosition += 6;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Total:", totalsX, yPosition);
      pdf.text(
        `${currencyFormatter(invoiceData.total)}`,
        pageWidth - 30,
        yPosition,
        {
          align: "right",
        }
      );

      // Notes and Terms
      if (invoiceData.notes || invoiceData.terms) {
        yPosition += 20;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        if (invoiceData.notes) {
          pdf.text("Notes:", 20, yPosition);
          yPosition += 6;
          const notesLines = pdf.splitTextToSize(
            invoiceData.notes,
            pageWidth - 40
          );
          pdf.text(notesLines, 20, yPosition);
          yPosition += notesLines.length * 4 + 6;
        }

        if (invoiceData.terms) {
          pdf.text("Terms:", 20, yPosition);
          yPosition += 6;
          const termsLines = pdf.splitTextToSize(
            invoiceData.terms,
            pageWidth - 40
          );
          pdf.text(termsLines, 20, yPosition);
        }
      }

      // Save the PDF
      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);

      toast({
        title: "Invoice Generated",
        description: "Your invoice has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showManager) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <InvoiceManager
          onSelectInvoice={handleSelectInvoice}
          onCreateNew={handleCreateNew}
        />
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <InvoiceManager
          onSelectInvoice={handleSelectInvoice}
          onCreateNew={handleCreateNew}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with Save and Manager buttons */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="flex flex-row justify-center items-center gap-2 text-muted-foreground mt-2">
            <FileText className="w-4 h-4" />
            {invoiceData.invoiceNumber} •{" "}
            {invoiceData.company.name || "Untitled Company"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackToManager}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Back to Manager
          </Button>
          <Button onClick={handleSaveInvoice}>
            <Save className="w-4 h-4 mr-2" />
            Save Invoice
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Items
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Invoice Details
                </CardTitle>
                <CardDescription>
                  Basic invoice information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input
                      id="invoice-number"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) =>
                        updateInvoiceData({ invoiceNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Invoice Date</Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) =>
                        updateInvoiceData({ date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) =>
                        updateInvoiceData({ dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={invoiceData.currency}
                      onValueChange={(val) => {
                        updateInvoiceData({ currency: val });
                        setPreferredCurrency(val);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueCurrencies
                          .sort((a, b) => {
                            // Put major currencies first
                            const majorCurrencies = [
                              "USD",
                              "EUR",
                              "GBP",
                              "JPY",
                              "CAD",
                              "AUD",
                              "CHF",
                              "CNY",
                              "INR",
                            ];
                            const aIsMajor = majorCurrencies.includes(a);
                            const bIsMajor = majorCurrencies.includes(b);

                            if (aIsMajor && !bIsMajor) return -1;
                            if (!aIsMajor && bIsMajor) return 1;
                            if (aIsMajor && bIsMajor) {
                              return (
                                majorCurrencies.indexOf(a) -
                                majorCurrencies.indexOf(b)
                              );
                            }
                            return a.localeCompare(b);
                          })
                          .map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Details
                </CardTitle>
                <CardDescription>
                  Your business information that will appear on the invoice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="company-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          updateInvoiceData({
                            company: {
                              ...invoiceData.company,
                              logoDataUrl: String(reader.result || ""),
                            },
                          });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {invoiceData.company.logoDataUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={invoiceData.company.logoDataUrl}
                          alt="Company logo preview"
                          className="h-10 w-auto object-contain border rounded"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateInvoiceData({
                              company: {
                                ...invoiceData.company,
                                logoDataUrl: undefined,
                              },
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    If no logo is uploaded, the invoice will show "Invoice" text
                    in the top right.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      value={invoiceData.company.name}
                      onChange={(e) =>
                        updateInvoiceData({
                          company: {
                            ...invoiceData.company,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={invoiceData.company.email}
                      onChange={(e) =>
                        updateInvoiceData({
                          company: {
                            ...invoiceData.company,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="company@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Input
                    id="company-address"
                    value={invoiceData.company.address}
                    onChange={(e) =>
                      updateInvoiceData({
                        company: {
                          ...invoiceData.company,
                          address: e.target.value,
                        },
                      })
                    }
                    placeholder="123 Business St"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-city">City</Label>
                    <Input
                      id="company-city"
                      value={invoiceData.company.city}
                      onChange={(e) =>
                        updateInvoiceData({
                          company: {
                            ...invoiceData.company,
                            city: e.target.value,
                          },
                        })
                      }
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-state">State</Label>
                    <Input
                      id="company-state"
                      value={invoiceData.company.state}
                      onChange={(e) =>
                        updateInvoiceData({
                          company: {
                            ...invoiceData.company,
                            state: e.target.value,
                          },
                        })
                      }
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-zip">ZIP Code</Label>
                    <Input
                      id="company-zip"
                      value={invoiceData.company.zipCode}
                      onChange={(e) =>
                        updateInvoiceData({
                          company: {
                            ...invoiceData.company,
                            zipCode: e.target.value,
                          },
                        })
                      }
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input
                      id="company-phone"
                      value={invoiceData.company.phone}
                      onChange={(e) =>
                        updateInvoiceData({
                          company: {
                            ...invoiceData.company,
                            phone: e.target.value,
                          },
                        })
                      }
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-tax-id">Tax ID</Label>
                    <Input
                      id="company-tax-id"
                      value={invoiceData.company.taxId}
                      onChange={(e) =>
                        updateInvoiceData({
                          company: {
                            ...invoiceData.company,
                            taxId: e.target.value,
                          },
                        })
                      }
                      placeholder="Tax ID Number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Details
                </CardTitle>
                <CardDescription>
                  Information about the client or customer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name *</Label>
                    <Input
                      id="client-name"
                      value={invoiceData.client.name}
                      onChange={(e) =>
                        updateInvoiceData({
                          client: {
                            ...invoiceData.client,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="Client Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={invoiceData.client.email}
                      onChange={(e) =>
                        updateInvoiceData({
                          client: {
                            ...invoiceData.client,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="client@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-address">Address</Label>
                  <Input
                    id="client-address"
                    value={invoiceData.client.address}
                    onChange={(e) =>
                      updateInvoiceData({
                        client: {
                          ...invoiceData.client,
                          address: e.target.value,
                        },
                      })
                    }
                    placeholder="123 Client St"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-city">City</Label>
                    <Input
                      id="client-city"
                      value={invoiceData.client.city}
                      onChange={(e) =>
                        updateInvoiceData({
                          client: {
                            ...invoiceData.client,
                            city: e.target.value,
                          },
                        })
                      }
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-state">State</Label>
                    <Input
                      id="client-state"
                      value={invoiceData.client.state}
                      onChange={(e) =>
                        updateInvoiceData({
                          client: {
                            ...invoiceData.client,
                            state: e.target.value,
                          },
                        })
                      }
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-zip">ZIP Code</Label>
                    <Input
                      id="client-zip"
                      value={invoiceData.client.zipCode}
                      onChange={(e) =>
                        updateInvoiceData({
                          client: {
                            ...invoiceData.client,
                            zipCode: e.target.value,
                          },
                        })
                      }
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-phone">Phone</Label>
                  <Input
                    id="client-phone"
                    value={invoiceData.client.phone}
                    onChange={(e) =>
                      updateInvoiceData({
                        client: {
                          ...invoiceData.client,
                          phone: e.target.value,
                        },
                      })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Invoice Items
              </CardTitle>
              <CardDescription>
                Add products or services to your invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateInvoiceItem(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Product or service description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) =>
                          updateInvoiceItem(
                            item.id,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rate</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          updateInvoiceItem(
                            item.id,
                            "rate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center h-10 px-3 py-2 text-sm bg-muted border border-input rounded-md">
                          {invoiceData.currency === "USD" && "$"}
                          <NumberFlow value={item.amount} />
                          {invoiceData.currency !== "USD" &&
                            ` ${invoiceData.currency}`}
                        </div>
                        {invoiceData.items.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeInvoiceItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addInvoiceItem}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Tax and Discount Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={invoiceData.taxRate}
                      onChange={(e) =>
                        updateInvoiceData({
                          taxRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount ($)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={invoiceData.discount}
                      onChange={(e) =>
                        updateInvoiceData({
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Invoice Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          {invoiceData.currency === "USD" && "$"}
                          <NumberFlow value={invoiceData.subtotal} />
                          {invoiceData.currency !== "USD" &&
                            ` ${invoiceData.currency}`}
                        </span>
                      </div>
                      {invoiceData.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span>
                            -{invoiceData.currency === "USD" && "$"}
                            <NumberFlow value={invoiceData.discount} />
                            {invoiceData.currency !== "USD" &&
                              ` ${invoiceData.currency}`}
                          </span>
                        </div>
                      )}
                      {invoiceData.taxRate > 0 && (
                        <div className="flex justify-between">
                          <span>Tax ({invoiceData.taxRate}%):</span>
                          <span>
                            {invoiceData.currency === "USD" && "$"}
                            <NumberFlow value={invoiceData.taxAmount} />
                            {invoiceData.currency !== "USD" &&
                              ` ${invoiceData.currency}`}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>
                          {invoiceData.currency === "USD" && "$"}
                          <NumberFlow value={invoiceData.total} />
                          {invoiceData.currency !== "USD" &&
                            ` ${invoiceData.currency}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) =>
                      updateInvoiceData({ notes: e.target.value })
                    }
                    placeholder="Additional notes or comments..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={invoiceData.terms}
                    onChange={(e) =>
                      updateInvoiceData({ terms: e.target.value })
                    }
                    placeholder="Payment terms and conditions..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Invoice Preview
              </CardTitle>
              <CardDescription>
                Preview how your invoice will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-8 max-w-4xl mx-auto">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {invoiceData.company.name || "Your Company Name"}
                    </h1>
                    {invoiceData.company.address && (
                      <p className="text-gray-600">
                        {invoiceData.company.address}
                      </p>
                    )}
                    {(invoiceData.company.city ||
                      invoiceData.company.state ||
                      invoiceData.company.zipCode) && (
                      <p className="text-gray-600">
                        {[
                          invoiceData.company.city,
                          invoiceData.company.state,
                          invoiceData.company.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {invoiceData.company.country && (
                      <p className="text-gray-600">
                        {invoiceData.company.country}
                      </p>
                    )}
                    {invoiceData.company.email && (
                      <p className="text-gray-600">
                        Email: {invoiceData.company.email}
                      </p>
                    )}
                    {invoiceData.company.phone && (
                      <p className="text-gray-600">
                        Phone: {invoiceData.company.phone}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {invoiceData.company.logoDataUrl ? (
                      <div className="mb-4">
                        <img
                          src={invoiceData.company.logoDataUrl}
                          alt="Company logo"
                          className="h-16 w-24 object-cover mx-auto border rounded"
                        />
                      </div>
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        INVOICE
                      </h2>
                    )}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Invoice #:</strong> {invoiceData.invoiceNumber}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(invoiceData.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Due Date:</strong>{" "}
                        {new Date(invoiceData.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Bill To:
                  </h3>
                  <div className="text-gray-600">
                    <p className="font-medium">
                      {invoiceData.client.name || "Client Name"}
                    </p>
                    {invoiceData.client.address && (
                      <p>{invoiceData.client.address}</p>
                    )}
                    {(invoiceData.client.city ||
                      invoiceData.client.state ||
                      invoiceData.client.zipCode) && (
                      <p>
                        {[
                          invoiceData.client.city,
                          invoiceData.client.state,
                          invoiceData.client.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {invoiceData.client.country && (
                      <p>{invoiceData.client.country}</p>
                    )}
                    {invoiceData.client.email && (
                      <p>Email: {invoiceData.client.email}</p>
                    )}
                    {invoiceData.client.phone && (
                      <p>Phone: {invoiceData.client.phone}</p>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-2 font-semibold text-gray-800">
                          Description
                        </th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-800">
                          Qty
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-800">
                          Rate
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-800">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3 px-2 text-gray-700">
                            {item.description || "Item description"}
                          </td>
                          <td className="py-3 px-2 text-center text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-700">
                            {currencyFormatter(item.rate)}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-700">
                            {currencyFormatter(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span>
                          {invoiceData.currency === "USD" && "$"}
                          <NumberFlow value={invoiceData.subtotal} />
                          {invoiceData.currency !== "USD" &&
                            ` ${invoiceData.currency}`}
                        </span>
                      </div>
                      {invoiceData.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span>
                            -{invoiceData.currency === "USD" && "$"}
                            <NumberFlow value={invoiceData.discount} />
                            {invoiceData.currency !== "USD" &&
                              ` ${invoiceData.currency}`}
                          </span>
                        </div>
                      )}
                      {invoiceData.taxRate > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Tax ({invoiceData.taxRate}%):</span>
                          <span>
                            {invoiceData.currency === "USD" && "$"}
                            <NumberFlow value={invoiceData.taxAmount} />
                            {invoiceData.currency !== "USD" &&
                              ` ${invoiceData.currency}`}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2">
                        <div className="flex justify-between text-lg font-bold text-gray-800">
                          <span>Total:</span>
                          <span>
                            {invoiceData.currency === "USD" && "$"}
                            <NumberFlow value={invoiceData.total} />
                            {invoiceData.currency !== "USD" &&
                              ` ${invoiceData.currency}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(invoiceData.notes || invoiceData.terms) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                    {invoiceData.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Notes:
                        </h4>
                        <p>{invoiceData.notes}</p>
                      </div>
                    )}
                    {invoiceData.terms && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Terms & Conditions:
                        </h4>
                        <p>{invoiceData.terms}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Invoice
              </CardTitle>
              <CardDescription>
                Download your invoice as a PDF document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="p-8 rounded-lg">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to Export
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your invoice is ready to be downloaded as a professional PDF
                    document.
                  </p>
                  <div className="text-left max-w-md mx-auto">
                    <div className="space-y-2">
                      <Label>PDF Page Size</Label>
                      <Select
                        value={invoiceData.pageSize}
                        onValueChange={(val: "a4" | "letter") =>
                          updateInvoiceData({ pageSize: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                          <SelectItem value="letter">
                            Letter (8.5 × 11 in)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mt-2">
                    <p>Invoice #: {invoiceData.invoiceNumber}</p>
                    <p>
                      Total Amount: {invoiceData.currency === "USD" && "$"}
                      <NumberFlow value={invoiceData.total} />
                      {invoiceData.currency !== "USD" &&
                        ` ${invoiceData.currency}`}
                    </p>
                    <p>
                      Date: {new Date(invoiceData.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={generatePDF}
                  size="lg"
                  className="w-full max-w-xs"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Invoice
                </Button>

                <div className="text-xs text-muted-foreground">
                  <p>
                    The PDF will be generated with all your invoice details and
                    can be printed or emailed to your client.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
