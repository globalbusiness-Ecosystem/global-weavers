export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: false,
} as const;

export const BACKEND_URLS = {
  LOGIN: "/api/pi/login",
  LOGIN_PREVIEW: "/api/pi/login",
  GET_PRODUCTS: (_appId: string) => "/api/pi/products",
  GET_PAYMENT: (paymentId: string) => `/api/pi/payment/${paymentId}`,
  APPROVE_PAYMENT: (_paymentId: string) => "/api/pi/approve",
  COMPLETE_PAYMENT: (_paymentId: string) => "/api/pi/complete",
} as const;

export const PI_BLOCKCHAIN_URLS = {
  GET_TRANSACTION: (txid: string) =>
    `https://api.testnet.minepi.com/transactions/${txid}/effects`,
} as const;
