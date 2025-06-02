import {
  generateMpesaPassword,
  generateMpesaTimestamp,
} from "@/lib/mpesa-utils";
import axios from "axios";

// Define TypeScript interfaces for M-Pesa responses
interface AuthResponse {
  access_token: string;
  expires_in: number;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface STKPushQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

function getCallbackUrl(): string {
  if (process.env.NODE_ENV === "development") {
    // Use ngrok URL for development
    return (
      process.env.MPESA_CALLBACK_URL ||
      "https://f7a4-41-81-189-87.ngrok-free.app/api/mpesa-callback"
    );
  } else {
    // Use production URL (your Vercel domain)
    return process.env.NEXT_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_URL}/api/mpesa-callback`
      : "https://newgigup.vercel.app/api/mpesa-callback";
  }
}
export class MpesaService {
  private consumerKey: string;
  private consumerSecret: string;
  private shortCode: string;
  private passkey: string;
  private callbackUrl: string;
  private authToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    if (
      !process.env.MPESA_CONSUMER_KEY ||
      !process.env.MPESA_CONSUMER_SECRET ||
      !process.env.MPESA_BUSINESS_SHORTCODE ||
      !process.env.MPESA_PASSKEY ||
      !process.env.MPESA_CALLBACK_URL
    ) {
      throw new Error("Missing M-Pesa environment variables");
    }

    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortCode = process.env.MPESA_BUSINESS_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = getCallbackUrl();
  }

  private async authenticate(maxRetries = 3): Promise<void> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < maxRetries) {
      attempts++;
      try {
        const auth = Buffer.from(
          `${this.consumerKey}:${this.consumerSecret}`
        ).toString("base64");

        const response = await axios.get<AuthResponse>(
          "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
          {
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          }
        );

        if (!response.data.access_token) {
          throw new Error("No token in response");
        }

        this.authToken = response.data.access_token;
        this.tokenExpiry = new Date(
          Date.now() + response.data.expires_in * 1000
        );
        return;
      } catch (error) {
        if (error instanceof Error) {
          lastError = error;
        } else {
          lastError = new Error(String(error));
        }
        console.log(`Authentication attempt ${attempts} failed:`, lastError);
        if (attempts < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    throw new Error(
      `M-Pesa auth failed after ${maxRetries} attempts: ${
        lastError?.message || "Unknown error"
      }`
    );
  }

  async initiateSTKPush(
    phoneNumber: string,
    amount: string,
    accountReference: string,
    description: string
  ): Promise<STKPushResponse> {
    await this.authenticate();

    if (!this.authToken) {
      throw new Error("Authentication failed");
    }

    const timestamp = generateMpesaTimestamp();
    const password = generateMpesaPassword(
      this.shortCode,
      this.passkey,
      timestamp
    );

    const payload = {
      BusinessShortCode: this.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: this.callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: description,
    };
    console.log("STK Push Payload:", payload); // 👈 Debug this

    try {
      const response = await axios.post<STKPushResponse>(
        `${process.env.NEXT_PUBLIC_MPESA_API_URL}/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      // console.error("STK Push failed:", {
      //   message: error.message,
      //   data: error.response?.data,
      //   requestPayload: payload,
      // });

      throw error; // Re-throw to preserve original error
    }
  }

  async verifyTransaction(
    checkoutRequestID: string,
    maxRetries = 3
  ): Promise<STKPushQueryResponse> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < maxRetries) {
      attempts++;
      try {
        await this.authenticate();

        const timestamp = generateMpesaTimestamp();
        const password = generateMpesaPassword(
          this.shortCode,
          this.passkey,
          timestamp
        );

        const payload = {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestID,
        };

        const response = await axios.post<STKPushQueryResponse>(
          `${process.env.NEXT_PUBLIC_MPESA_API_URL}/stkpushquery/v1/query`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          }
        );

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          lastError = error;
        } else {
          lastError = new Error(String(error));
        }
        console.log(`Verification attempt ${attempts} failed:`, lastError);
        if (attempts < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    throw new Error(
      `Transaction verification failed after ${maxRetries} attempts: ${
        lastError?.message || "Unknown error"
      }`
    );
  }
}

export const mpesaService = new MpesaService();
