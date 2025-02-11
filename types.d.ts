// types.d.ts or somewhere in your project
import { NextRequest } from "next/server"; // eslint-disable-line @typescript-eslint/no-unused-vars

import { Server as HttpServer } from "http";

// Extend the http.Server type to include the io property
declare module "next/server" {
  interface NextRequest {
    socket: {
      server: HttpServer & { io?: boolean }; // Extend HttpServer with io property
    };
  }
}
