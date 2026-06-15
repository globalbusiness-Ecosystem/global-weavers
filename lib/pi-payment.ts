import { BACKEND_URLS, PI_BLOCKCHAIN_URLS } from "@/lib/system-config";

export type PaymentMetadata = { [key: string]: any };
export type PaymentOptions = {
  amount: number;
  memo?: string;
  metadata: PaymentMetadata;
  onComplete?: (metadata: PaymentMetadata) => void;
  onError?: (error: Error, payment?: PiPayment) => void;
};
export type PiPaymentData = { amount: number; memo: string; metadata: PaymentMetadata };
export type PiPayment = {
  identifier: string;
  amount: number;
  metadata: PaymentMetadata;
  transaction: { txid: string };
};

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (scopes: string[], cb: (payment: PiPayment) => Promise<void>) => Promise<{ accessToken: string; user: { uid: string; username: string } }>;
      createPayment: (data: PiPaymentData, callbacks: any) => void;
      getIncompletePayments: () => Promise<PiPayment[]>;
    };
    pay: (options: PaymentOptions) => Promise<void>;
  }
}

export const pay = async (options: PaymentOptions): Promise<void> => {
  window.Pi.createPayment(
    {
      amount: options.amount,
      memo: options.memo || `Payment of ${options.amount} Pi`,
      metadata: options.metadata,
    },
    {
      onReadyForServerApproval: async (paymentId: string) => {
        try {
          await fetch("/api/pi/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
        } catch (e) {
          console.error("Approve failed:", e);
        }
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        try {
          await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
          if (options.onComplete) options.onComplete(options.metadata);
        } catch (e) {
          console.error("Complete failed:", e);
        }
      },
      onCancel: (paymentId: string) => console.log("Payment cancelled:", paymentId),
      onError: (error: Error, payment?: PiPayment) => {
        console.error("Payment error:", error);
        if (options.onError) options.onError(error, payment);
      },
    }
  );
};

export const checkIncompletePayments = async (payment: PiPayment): Promise<void> => {
  try {
    await fetch("/api/pi/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction?.txid }),
    });
  } catch (e) {
    console.error("Failed to complete incomplete payment:", e);
  }
};

export const initializeGlobalPayment = (): void => {
  if (typeof window !== "undefined") window.pay = pay;
};

export const setPaymentRewardHandler = (_handler: (metadata: PaymentMetadata) => void): void => {};
