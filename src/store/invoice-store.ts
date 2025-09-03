import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  logoDataUrl?: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  company: CompanyDetails;
  client: ClientDetails;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes: string;
  terms: string;
  currency: string;
  pageSize: "a4" | "letter";
  createdAt: string;
  updatedAt: string;
}

interface InvoiceStore {
  invoices: InvoiceData[];
  currentInvoice: InvoiceData | null;
  isLoading: boolean;

  // Actions
  createNewInvoice: () => InvoiceData;
  saveInvoice: (invoice: InvoiceData) => void;
  loadInvoice: (id: string) => InvoiceData | null;
  deleteInvoice: (id: string) => void;
  updateCurrentInvoice: (updates: Partial<InvoiceData>) => void;
  setCurrentInvoice: (invoice: InvoiceData | null) => void;
  duplicateInvoice: (id: string) => InvoiceData | null;
}

const defaultCompanyDetails: CompanyDetails = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  email: "",
  phone: "",
  website: "",
  taxId: "",
};

const defaultClientDetails: ClientDetails = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  email: "",
  phone: "",
};

const createDefaultInvoice = (): InvoiceData => ({
  id: `invoice-${Date.now()}`,
  invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(
    -6
  )}`,
  date: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  company: defaultCompanyDetails,
  client: defaultClientDetails,
  items: [
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  discount: 0,
  total: 0,
  notes: "",
  terms: "Payment is due within 30 days of invoice date.",
  currency: "USD",
  pageSize: "a4",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Custom IndexedDB storage for Zustand
const createIndexedDBStorage = () => {
  const dbName = "InvoiceDB";
  const storeName = "invoices";

  return {
    getItem: async (name: string): Promise<string | null> => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction([storeName], "readonly");
          const store = transaction.objectStore(storeName);
          const getRequest = store.get(name);

          getRequest.onsuccess = () => {
            resolve(
              getRequest.result ? JSON.stringify(getRequest.result) : null
            );
          };
          getRequest.onerror = () => reject(getRequest.error);
        };

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };
      });
    },

    setItem: async (name: string, value: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          const putRequest = store.put(JSON.parse(value), name);

          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        };

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };
      });
    },

    removeItem: async (name: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          const deleteRequest = store.delete(name);

          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        };

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };
      });
    },
  };
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      currentInvoice: null,
      isLoading: false,

      createNewInvoice: () => {
        const newInvoice = createDefaultInvoice();
        set({ currentInvoice: newInvoice });
        return newInvoice;
      },

      saveInvoice: (invoice: InvoiceData) => {
        const { invoices } = get();
        const existingIndex = invoices.findIndex(
          (inv) => inv.id === invoice.id
        );

        const updatedInvoice = {
          ...invoice,
          updatedAt: new Date().toISOString(),
        };

        let updatedInvoices;
        if (existingIndex >= 0) {
          // Update existing invoice
          updatedInvoices = [...invoices];
          updatedInvoices[existingIndex] = updatedInvoice;
        } else {
          // Add new invoice
          updatedInvoices = [...invoices, updatedInvoice];
        }

        set({
          invoices: updatedInvoices,
          currentInvoice: updatedInvoice,
        });
      },

      loadInvoice: (id: string) => {
        const { invoices } = get();
        const invoice = invoices.find((inv) => inv.id === id);
        if (invoice) {
          set({ currentInvoice: invoice });
          return invoice;
        }
        return null;
      },

      deleteInvoice: (id: string) => {
        const { invoices, currentInvoice } = get();
        const updatedInvoices = invoices.filter((inv) => inv.id !== id);

        set({
          invoices: updatedInvoices,
          currentInvoice: currentInvoice?.id === id ? null : currentInvoice,
        });
      },

      updateCurrentInvoice: (updates: Partial<InvoiceData>) => {
        const { currentInvoice } = get();
        if (currentInvoice) {
          const updatedInvoice = {
            ...currentInvoice,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          set({ currentInvoice: updatedInvoice });
        }
      },

      setCurrentInvoice: (invoice: InvoiceData | null) => {
        set({ currentInvoice: invoice });
      },

      duplicateInvoice: (id: string) => {
        const { invoices } = get();
        const originalInvoice = invoices.find((inv) => inv.id === id);
        if (originalInvoice) {
          const duplicatedInvoice: InvoiceData = {
            ...originalInvoice,
            id: `invoice-${Date.now()}`,
            invoiceNumber: `INV-${new Date().getFullYear()}-${String(
              Date.now()
            ).slice(-6)}`,
            date: new Date().toISOString().split("T")[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({ currentInvoice: duplicatedInvoice });
          return duplicatedInvoice;
        }
        return null;
      },
    }),
    {
      name: "invoice-storage",
      storage: createJSONStorage(() => createIndexedDBStorage()),
      partialize: (state) => ({ invoices: state.invoices }),
    }
  )
);
