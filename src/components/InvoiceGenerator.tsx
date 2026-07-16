"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Lock,
  Sparkles,
  Check,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import {
  INVOICE_PRO_PAYMENT_LINK,
  API_WAITLIST_MAILTO,
  isInvoiceProUnlocked,
  unlockInvoicePro,
} from "@/lib/pro-config";
import NumberFlow from "@number-flow/react";
import {
  useInvoiceStore,
  InvoiceData,
  InvoiceItem,
  InvoiceTemplateId,
  CompanyDetails,
  ClientDetails,
} from "@/store/invoice-store";
import InvoiceManager from "@/components/InvoiceManager";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { uniqueCurrencies } from "@/lib/currencies";
import { setPreferredCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function InvoiceGenerator() {
  const t = useTranslations("Tools.InvoiceGenerator");
  const tc = useTranslations("ToolsConfig");
  const [activeTab, setActiveTab] = useState("details");
  const [showManager, setShowManager] = useState(true); // Start with manager view

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentInvoice,
    createNewInvoice,
    saveInvoice,
    updateCurrentInvoice,
    setCurrentInvoice,
  } = useInvoiceStore();

  // Don't auto-create invoice - let user choose from manager

  const invoiceData = currentInvoice;

  // Pro unlock is read from localStorage. `mounted` gates the first client
  // render to match the server (both "locked"), avoiding a hydration mismatch;
  // after mount we re-read the flag on every render so an unlock takes effect.
  const [mounted, setMounted] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Honor-system return flow: a successful checkout redirects back with
  // `?unlocked=pro`. Flip the flag, notify, then strip the param via replace.
  useEffect(() => {
    if (searchParams.get("unlocked") === "pro") {
      unlockInvoicePro();
      setMounted(true);
      toast.success(t("proUnlockedToast"));
      const params = new URLSearchParams(searchParams.toString());
      params.delete("unlocked");
      const query = params.toString();
      router.replace(query ? `?${query}` : "?");
    }
  }, [searchParams, router, t]);

  const proUnlocked = mounted && isInvoiceProUnlocked();
  const templateId: InvoiceTemplateId = invoiceData?.templateId ?? "classic";
  const templateIsPro = templateId !== "classic";
  const exportLocked = templateIsPro && !proUnlocked;

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
      toast.success(t("invoiceSaved"));
    }
  };

  const handleSelectInvoice = (invoice: InvoiceData) => {
    setCurrentInvoice(invoice);
    setShowManager(false);
    setActiveTab("details");
    toast.success(t("invoiceLoaded"));
  };

  const handleCreateNew = () => {
    createNewInvoice();
    setShowManager(false);
    setActiveTab("details");
    toast.success(t("newInvoiceCreated"));
  };

  const handleBackToManager = () => {
    setShowManager(true);
    setActiveTab("details");
  };

  // ── Pro layout: Modern ──────────────────────────────────────────────────
  // Accent header band + right-aligned totals block. Renders the same
  // InvoiceData as classic; only the visual arrangement differs.
  const generateModernPDF = (data: InvoiceData) => {
    const accent: [number, number, number] = [46, 92, 255]; // bt-accent #2e5cff
    const pdf = new jsPDF({ format: data.pageSize });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const marginL = 20;
    const marginR = pageWidth - 20;

    // Accent header band
    const bandHeight = 42;
    pdf.setFillColor(accent[0], accent[1], accent[2]);
    pdf.rect(0, 0, pageWidth, bandHeight, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("INVOICE", marginL, 22);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.company.name || "Your Company Name", marginL, 32);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(`#${data.invoiceNumber}`, marginR, 22, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(
      `Date: ${new Date(data.date).toLocaleDateString()}`,
      marginR,
      30,
      { align: "right" }
    );
    pdf.text(
      `Due: ${new Date(data.dueDate).toLocaleDateString()}`,
      marginR,
      36,
      { align: "right" }
    );

    // Body
    pdf.setTextColor(30, 30, 30);
    let y = bandHeight + 16;

    // Company contact (left) + Bill To (right column start)
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const companyLines = [
      data.company.address,
      [data.company.city, data.company.state, data.company.zipCode]
        .filter(Boolean)
        .join(", "),
      data.company.country,
      data.company.email ? `Email: ${data.company.email}` : "",
      data.company.phone ? `Phone: ${data.company.phone}` : "",
    ].filter(Boolean);
    companyLines.forEach((line) => {
      pdf.text(line, marginL, y);
      y += 5;
    });

    y += 6;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(accent[0], accent[1], accent[2]);
    pdf.text("BILL TO", marginL, y);
    pdf.setTextColor(30, 30, 30);
    y += 6;
    pdf.setFont("helvetica", "normal");
    const clientLines = [
      data.client.name || "Client Name",
      data.client.address,
      [data.client.city, data.client.state, data.client.zipCode]
        .filter(Boolean)
        .join(", "),
      data.client.country,
      data.client.email ? `Email: ${data.client.email}` : "",
    ].filter(Boolean);
    clientLines.forEach((line) => {
      pdf.text(line, marginL, y);
      y += 5;
    });

    // Items table
    y += 10;
    pdf.setFillColor(accent[0], accent[1], accent[2]);
    pdf.rect(marginL, y - 5, marginR - marginL, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Description", marginL + 2, y);
    pdf.text("Qty", 120, y);
    pdf.text("Rate", 140, y);
    pdf.text("Amount", marginR - 2, y, { align: "right" });
    y += 9;

    pdf.setTextColor(30, 30, 30);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    data.items.forEach((item) => {
      if (item.description) {
        pdf.text(item.description, marginL + 2, y);
        pdf.text(item.quantity.toString(), 120, y);
        pdf.text(currencyFormatter(item.rate), 140, y);
        pdf.text(currencyFormatter(item.amount), marginR - 2, y, {
          align: "right",
        });
        y += 6;
      }
    });

    // Right-aligned totals block
    y += 8;
    const labelX = marginR - 60;
    const valX = marginR - 2;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Subtotal:", labelX, y);
    pdf.text(currencyFormatter(data.subtotal), valX, y, { align: "right" });
    y += 6;
    if (data.discount > 0) {
      pdf.text("Discount:", labelX, y);
      pdf.text(`-${currencyFormatter(data.discount)}`, valX, y, {
        align: "right",
      });
      y += 6;
    }
    if (data.taxRate > 0) {
      pdf.text(`Tax (${data.taxRate}%):`, labelX, y);
      pdf.text(currencyFormatter(data.taxAmount), valX, y, { align: "right" });
      y += 6;
    }
    pdf.setDrawColor(accent[0], accent[1], accent[2]);
    pdf.setLineWidth(0.6);
    pdf.line(labelX, y, valX, y);
    y += 7;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(accent[0], accent[1], accent[2]);
    pdf.text("Total:", labelX, y);
    pdf.text(currencyFormatter(data.total), valX, y, { align: "right" });
    pdf.setTextColor(30, 30, 30);

    // Notes / Terms
    if (data.notes || data.terms) {
      y += 18;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      if (data.notes) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Notes:", marginL, y);
        pdf.setFont("helvetica", "normal");
        y += 5;
        const notesLines = pdf.splitTextToSize(data.notes, marginR - marginL);
        pdf.text(notesLines, marginL, y);
        y += notesLines.length * 4 + 6;
      }
      if (data.terms) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Terms:", marginL, y);
        pdf.setFont("helvetica", "normal");
        y += 5;
        const termsLines = pdf.splitTextToSize(data.terms, marginR - marginL);
        pdf.text(termsLines, marginL, y);
      }
    }

    pdf.save(`invoice-${data.invoiceNumber}.pdf`);
  };

  // ── Pro layout: Compact ─────────────────────────────────────────────────
  // Single column, smaller type, no logo box. Fits more on one page.
  const generateCompactPDF = (data: InvoiceData) => {
    const pdf = new jsPDF({ format: data.pageSize });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const marginL = 16;
    const marginR = pageWidth - 16;
    let y = 18;

    pdf.setTextColor(20, 20, 20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(data.company.name || "Your Company Name", marginL, y);
    pdf.setFontSize(12);
    pdf.text(`INVOICE #${data.invoiceNumber}`, marginR, y, { align: "right" });
    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    const headerLeft = [
      data.company.email,
      data.company.phone,
      [data.company.city, data.company.state, data.company.zipCode]
        .filter(Boolean)
        .join(", "),
    ].filter(Boolean);
    headerLeft.forEach((line) => {
      pdf.text(line, marginL, y);
      y += 4;
    });
    pdf.text(
      `Date: ${new Date(data.date).toLocaleDateString()}  •  Due: ${new Date(
        data.dueDate
      ).toLocaleDateString()}`,
      marginR,
      y - headerLeft.length * 4,
      { align: "right" }
    );

    y += 4;
    pdf.setDrawColor(210, 210, 210);
    pdf.setLineWidth(0.3);
    pdf.line(marginL, y, marginR, y);
    y += 6;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text("BILL TO:", marginL, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      [
        data.client.name || "Client Name",
        data.client.email,
        data.client.phone,
      ]
        .filter(Boolean)
        .join("  •  "),
      marginL + 18,
      y
    );
    y += 8;

    // Items
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text("Description", marginL, y);
    pdf.text("Qty", 120, y);
    pdf.text("Rate", 140, y);
    pdf.text("Amount", marginR, y, { align: "right" });
    y += 3;
    pdf.line(marginL, y, marginR, y);
    y += 5;

    pdf.setFont("helvetica", "normal");
    data.items.forEach((item) => {
      if (item.description) {
        pdf.text(item.description, marginL, y);
        pdf.text(item.quantity.toString(), 120, y);
        pdf.text(currencyFormatter(item.rate), 140, y);
        pdf.text(currencyFormatter(item.amount), marginR, y, {
          align: "right",
        });
        y += 5;
      }
    });

    y += 4;
    pdf.line(120, y, marginR, y);
    y += 5;
    const valX = marginR;
    pdf.text("Subtotal:", 120, y);
    pdf.text(currencyFormatter(data.subtotal), valX, y, { align: "right" });
    y += 5;
    if (data.discount > 0) {
      pdf.text("Discount:", 120, y);
      pdf.text(`-${currencyFormatter(data.discount)}`, valX, y, {
        align: "right",
      });
      y += 5;
    }
    if (data.taxRate > 0) {
      pdf.text(`Tax (${data.taxRate}%):`, 120, y);
      pdf.text(currencyFormatter(data.taxAmount), valX, y, { align: "right" });
      y += 5;
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Total:", 120, y);
    pdf.text(currencyFormatter(data.total), valX, y, { align: "right" });

    if (data.notes || data.terms) {
      y += 10;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      if (data.notes) {
        const notesLines = pdf.splitTextToSize(
          `Notes: ${data.notes}`,
          marginR - marginL
        );
        pdf.text(notesLines, marginL, y);
        y += notesLines.length * 3.5 + 3;
      }
      if (data.terms) {
        const termsLines = pdf.splitTextToSize(
          `Terms: ${data.terms}`,
          marginR - marginL
        );
        pdf.text(termsLines, marginL, y);
      }
    }

    pdf.save(`invoice-${data.invoiceNumber}.pdf`);
  };

  const generatePDF = () => {
    if (!invoiceData) return;

    // Pro templates gate: never export a locked Pro layout.
    const selectedTemplate: InvoiceTemplateId =
      invoiceData.templateId ?? "classic";
    if (selectedTemplate !== "classic") {
      if (!isInvoiceProUnlocked()) return;
      try {
        if (selectedTemplate === "modern") generateModernPDF(invoiceData);
        else generateCompactPDF(invoiceData);
        toast.success(t("invoiceGenerated"));
      } catch (error) {
        toast.error(t("errorGenerating"));
      }
      return;
    }

    // ── Classic template: EXACT original code path (byte-identical output) ──
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

      toast.success(t("invoiceGenerated"));
    } catch (error) {
      toast.error(t("errorGenerating"));
    }
  };

  if (showManager) {
    return (
      <ToolShell
        slug="invoice"
        title={tc("tools.invoice.name")}
        sub={tc("tools.invoice.description")}
        width="wide"
      >
        <InvoiceManager
          onSelectInvoice={handleSelectInvoice}
          onCreateNew={handleCreateNew}
        />
      </ToolShell>
    );
  }

  if (!invoiceData) {
    return (
      <ToolShell
        slug="invoice"
        title={tc("tools.invoice.name")}
        sub={tc("tools.invoice.description")}
        width="wide"
      >
        <InvoiceManager
          onSelectInvoice={handleSelectInvoice}
          onCreateNew={handleCreateNew}
        />
      </ToolShell>
    );
  }

  return (
    <ToolShell
      slug="invoice"
      title={tc("tools.invoice.name")}
      sub={tc("tools.invoice.description")}
      width="wide"
    >
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
            <FolderOpen className="w-4 h-4 me-2" />
            {t("backToManager")}
          </Button>
          <Button onClick={handleSaveInvoice}>
            <Save className="w-4 h-4 me-2" />
            {t("saveInvoice")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {t("tabs.details")}
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            {t("tabs.items")}
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {t("tabs.preview")}
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t("tabs.export")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Details */}
            <SettingsCard
              className="lg:col-span-2"
              title={
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t("invoiceDetails")}
                </span>
              }
              description={t("basicInvoiceInfo")}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <OptionRow label={t("invoiceNumber")} htmlFor="invoice-number">
                  <Input
                    id="invoice-number"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) =>
                      updateInvoiceData({ invoiceNumber: e.target.value })
                    }
                  />
                </OptionRow>
                <OptionRow label={t("invoiceDate")} htmlFor="invoice-date">
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) =>
                      updateInvoiceData({ date: e.target.value })
                    }
                  />
                </OptionRow>
                <OptionRow label={t("dueDate")} htmlFor="due-date">
                  <Input
                    id="due-date"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) =>
                      updateInvoiceData({ dueDate: e.target.value })
                    }
                  />
                </OptionRow>
                <OptionRow label={t("currency")}>
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
                </OptionRow>
              </div>
            </SettingsCard>
            {/* Company Details */}
            <SettingsCard
              title={
                <span className="inline-flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {t("companyDetails")}
                </span>
              }
              description={t("companyInfo")}
            >
              {/* Logo Upload */}
              <OptionRow label="Company Logo" htmlFor="company-logo">
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
              </OptionRow>
              <div className="grid grid-cols-2 gap-4">
                <OptionRow label={t("companyName")} htmlFor="company-name">
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
                    placeholder={t("companyNamePlaceholder")}
                  />
                </OptionRow>
                <OptionRow label="Email" htmlFor="company-email">
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
                    placeholder={t("companyEmailPlaceholder")}
                  />
                </OptionRow>
              </div>

              <OptionRow label="Address" htmlFor="company-address">
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
                  placeholder={t("companyAddressPlaceholder")}
                />
              </OptionRow>

              <div className="grid grid-cols-3 gap-4">
                <OptionRow label="City" htmlFor="company-city">
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
                    placeholder={t("cityPlaceholder")}
                  />
                </OptionRow>
                <OptionRow label="State" htmlFor="company-state">
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
                    placeholder={t("statePlaceholder")}
                  />
                </OptionRow>
                <OptionRow label="ZIP Code" htmlFor="company-zip">
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
                </OptionRow>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <OptionRow label="Phone" htmlFor="company-phone">
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
                    placeholder={t("phonePlaceholder")}
                  />
                </OptionRow>
                <OptionRow label="Tax ID" htmlFor="company-tax-id">
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
                    placeholder={t("taxIdPlaceholder")}
                  />
                </OptionRow>
              </div>
            </SettingsCard>

            {/* Client Details */}
            <SettingsCard
              title={
                <span className="inline-flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t("clientDetails")}
                </span>
              }
              description={t("clientInfo")}
            >
              <div className="grid grid-cols-2 gap-4">
                <OptionRow label={t("clientName")} htmlFor="client-name">
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
                    placeholder={t("clientNamePlaceholder")}
                  />
                </OptionRow>
                <OptionRow label="Email" htmlFor="client-email">
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
                    placeholder={t("clientEmailPlaceholder")}
                  />
                </OptionRow>
              </div>

              <OptionRow label="Address" htmlFor="client-address">
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
                  placeholder={t("clientAddressPlaceholder")}
                />
              </OptionRow>

              <div className="grid grid-cols-3 gap-4">
                <OptionRow label="City" htmlFor="client-city">
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
                    placeholder={t("cityPlaceholder")}
                  />
                </OptionRow>
                <OptionRow label="State" htmlFor="client-state">
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
                    placeholder={t("statePlaceholder")}
                  />
                </OptionRow>
                <OptionRow label="ZIP Code" htmlFor="client-zip">
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
                </OptionRow>
              </div>

              <OptionRow label="Phone" htmlFor="client-phone">
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
                  placeholder={t("phonePlaceholder")}
                />
              </OptionRow>
            </SettingsCard>
          </div>
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <SettingsCard
            title={
              <span className="inline-flex items-center gap-2">
                <Hash className="w-4 h-4" />
                {t("invoiceItems")}
              </span>
            }
            description={t("addProducts")}
            action={
              <Button onClick={addInvoiceItem}>
                <Plus className="w-4 h-4 me-2" />
                {t("addItem")}
              </Button>
            }
          >
              {/* Dense computed line-item editor — stays bespoke (data-table-like surface). */}
              <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <Label>{t("description")}</Label>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateInvoiceItem(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder={t("itemDescriptionPlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("quantity")}</Label>
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
                      <Label>{t("rate")}</Label>
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
                      <Label>{t("amount")}</Label>
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
              </div>

              <Separator className="my-6" />

              {/* Tax and Discount Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <OptionRow label={t("taxRate")} htmlFor="tax-rate">
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
                  </OptionRow>
                  <OptionRow label={t("discount")} htmlFor="discount">
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
                  </OptionRow>
                </div>

                <StatStrip
                  items={[
                    {
                      label: t("subtotal"),
                      value: (
                        <span dir="ltr">
                          {invoiceData.currency === "USD" && "$"}
                          <NumberFlow value={invoiceData.subtotal} />
                          {invoiceData.currency !== "USD" &&
                            ` ${invoiceData.currency}`}
                        </span>
                      ),
                      sub: (
                        <span dir="ltr">
                          {invoiceData.items.length} {t("tabs.items")}
                        </span>
                      ),
                    },
                    ...(invoiceData.discount > 0
                      ? [
                          {
                            label: t("discount"),
                            value: (
                              <span dir="ltr">
                                -{invoiceData.currency === "USD" && "$"}
                                <NumberFlow value={invoiceData.discount} />
                                {invoiceData.currency !== "USD" &&
                                  ` ${invoiceData.currency}`}
                              </span>
                            ),
                          },
                        ]
                      : []),
                    ...(invoiceData.taxRate > 0
                      ? [
                          {
                            label: `${t("tax")} (${invoiceData.taxRate}%)`,
                            value: (
                              <span dir="ltr">
                                {invoiceData.currency === "USD" && "$"}
                                <NumberFlow value={invoiceData.taxAmount} />
                                {invoiceData.currency !== "USD" &&
                                  ` ${invoiceData.currency}`}
                              </span>
                            ),
                          },
                        ]
                      : []),
                    {
                      label: t("total"),
                      value: (
                        <span dir="ltr">
                          {invoiceData.currency === "USD" && "$"}
                          <NumberFlow value={invoiceData.total} />
                          {invoiceData.currency !== "USD" &&
                            ` ${invoiceData.currency}`}
                        </span>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <OptionRow label={t("notes")} htmlFor="notes">
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) =>
                      updateInvoiceData({ notes: e.target.value })
                    }
                    placeholder={t("notesPlaceholder")}
                    rows={3}
                  />
                </OptionRow>
                <OptionRow label={t("termsConditions")} htmlFor="terms">
                  <Textarea
                    id="terms"
                    value={invoiceData.terms}
                    onChange={(e) =>
                      updateInvoiceData({ terms: e.target.value })
                    }
                    placeholder={t("termsPlaceholder")}
                    rows={3}
                  />
                </OptionRow>
              </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="preview" className="mt-6 space-y-6">
          {/* Template picker — tiles use bt tokens (app chrome); each tile's
              mini-preview uses fixed paper colors (content) to represent the
              exported PDF, matching the WYSIWYG preview convention below. */}
          <SettingsCard
            title={
              <span className="inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t("templatesTitle")}
              </span>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(
                [
                  { id: "classic", label: t("templateClassic"), pro: false },
                  { id: "modern", label: t("templateModern"), pro: true },
                  { id: "compact", label: t("templateCompact"), pro: true },
                ] as { id: InvoiceTemplateId; label: string; pro: boolean }[]
              ).map((tpl) => {
                const selected = templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => updateInvoiceData({ templateId: tpl.id })}
                    className={`relative rounded-lg border p-3 text-start transition-colors ${
                      selected
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="absolute top-2 end-2 flex items-center gap-1">
                      {tpl.pro && (
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Lock className="w-3 h-3" />
                          {t("proBadge")}
                        </Badge>
                      )}
                      {selected && (
                        <span className="text-primary">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    {/* Mini paper mock — fixed content colors, not app chrome. */}
                    <div className="mb-2 aspect-[3/4] w-full overflow-hidden rounded bg-white p-2 shadow-sm">
                      {tpl.id === "classic" && (
                        <div className="flex h-full flex-col gap-1">
                          <div className="flex items-start justify-between">
                            <div className="h-2 w-10 rounded bg-gray-800" />
                            <div className="h-2 w-6 rounded bg-gray-300" />
                          </div>
                          <div className="mt-1 h-1 w-8 rounded bg-gray-300" />
                          <div className="mt-auto space-y-1">
                            <div className="h-1 w-full rounded bg-gray-200" />
                            <div className="h-1 w-full rounded bg-gray-200" />
                            <div className="ms-auto h-1.5 w-8 rounded bg-gray-700" />
                          </div>
                        </div>
                      )}
                      {tpl.id === "modern" && (
                        <div className="flex h-full flex-col gap-1">
                          <div className="-mx-2 -mt-2 mb-1 h-5 bg-[#2e5cff]" />
                          <div className="h-1 w-8 rounded bg-gray-300" />
                          <div className="mt-auto space-y-1">
                            <div className="h-1 w-full rounded bg-gray-200" />
                            <div className="ms-auto h-1.5 w-8 rounded bg-[#2e5cff]" />
                          </div>
                        </div>
                      )}
                      {tpl.id === "compact" && (
                        <div className="flex h-full flex-col gap-[3px]">
                          <div className="flex items-center justify-between">
                            <div className="h-1.5 w-8 rounded bg-gray-800" />
                            <div className="h-1.5 w-6 rounded bg-gray-400" />
                          </div>
                          <div className="h-px w-full bg-gray-300" />
                          <div className="h-1 w-full rounded bg-gray-200" />
                          <div className="h-1 w-full rounded bg-gray-200" />
                          <div className="h-1 w-full rounded bg-gray-200" />
                          <div className="ms-auto h-1 w-8 rounded bg-gray-600" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{tpl.label}</span>
                  </button>
                );
              })}
            </div>
          </SettingsCard>

          <SettingsCard
            title={
              <span className="inline-flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Invoice Preview
              </span>
            }
            description="Preview how your invoice will look"
          >
              {/* content value: this block is a WYSIWYG mock of the exported PDF
                  page, so it stays fixed white/black — the exported PDF is always
                  white paper regardless of site theme, and routing these through
                  bt tokens would make the preview misrepresent the real export in
                  dark mode. Every gray text/border utility below is part of this
                  fixed paper surface, not app chrome. */}
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
                  <div className="text-end">
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
                    {t("billTo")}:
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
                        <th className="text-start py-3 px-2 font-semibold text-gray-800">
                          Description
                        </th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-800">
                          Qty
                        </th>
                        <th className="text-end py-3 px-2 font-semibold text-gray-800">
                          Rate
                        </th>
                        <th className="text-end py-3 px-2 font-semibold text-gray-800">
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
                          <td className="py-3 px-2 text-end text-gray-700">
                            {currencyFormatter(item.rate)}
                          </td>
                          <td className="py-3 px-2 text-end text-gray-700">
                            {currencyFormatter(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64" dir="ltr">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>{t("subtotal")}:</span>
                        <span>
                          {invoiceData.currency === "USD" && "$"}
                          <NumberFlow value={invoiceData.subtotal} />
                          {invoiceData.currency !== "USD" &&
                            ` ${invoiceData.currency}`}
                        </span>
                      </div>
                      {invoiceData.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>{t("discount")}:</span>
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
                          <span>{t("tax")} ({invoiceData.taxRate}%):</span>
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
                          <span>{t("total")}:</span>
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
                          {t("notes")}:
                        </h4>
                        <p>{invoiceData.notes}</p>
                      </div>
                    )}
                    {invoiceData.terms && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {t("termsConditions")}:
                        </h4>
                        <p>{invoiceData.terms}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <SettingsCard
            title={
              <span className="inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                {t("exportInvoice")}
              </span>
            }
            description={t("downloadAsPdf")}
          >
              <div className="text-center space-y-6">
                <div className="p-8 rounded-lg">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t("readyToExport")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("readyToExportDesc")}
                  </p>
                  <div className="text-start max-w-md mx-auto">
                    <OptionRow label={t("pdfPageSize")}>
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
                    </OptionRow>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mt-2" dir="ltr">
                    <p>{t("invoiceNumber")}: {invoiceData.invoiceNumber}</p>
                    <p>
                      {t("total")}: {invoiceData.currency === "USD" && "$"}
                      <NumberFlow value={invoiceData.total} />
                      {invoiceData.currency !== "USD" &&
                        ` ${invoiceData.currency}`}
                    </p>
                    <p>
                      {t("invoiceDate")}: {new Date(invoiceData.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={generatePDF}
                  size="lg"
                  className="w-full max-w-xs"
                  disabled={exportLocked}
                >
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadPdf")}
                </Button>

                {exportLocked && (
                  <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      {t("proComingSoon")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUpsell(true)}
                    >
                      <Sparkles className="w-4 h-4 me-2" />
                      {t("proUnlockCta")}
                    </Button>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>{t("pdfNote")}</p>
                </div>

                {/* API waitlist — always-visible small text link. */}
                <div className="text-xs">
                  <a
                    href={API_WAITLIST_MAILTO}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {t("apiWaitlist")}
                  </a>
                </div>
              </div>

              {/* Upsell dialog. Empty payment link ⇒ coming-soon copy with NO
                  price and NO checkout CTA (no dead-end $5 button). */}
              <Dialog open={showUpsell} onOpenChange={setShowUpsell}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="inline-flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {t("proUnlockCta")}
                    </DialogTitle>
                    <DialogDescription>
                      {INVOICE_PRO_PAYMENT_LINK
                        ? t("readyToExportDesc")
                        : t("proComingSoon")}
                    </DialogDescription>
                  </DialogHeader>
                  {INVOICE_PRO_PAYMENT_LINK ? (
                    <DialogFooter>
                      <a
                        href={INVOICE_PRO_PAYMENT_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button>{t("proUnlockCta")} — $5</Button>
                      </a>
                    </DialogFooter>
                  ) : null}
                </DialogContent>
              </Dialog>
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </ToolShell>
  );
}
