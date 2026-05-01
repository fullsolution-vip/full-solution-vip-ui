import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "chatbot.log");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  service: string;
  message: string;
  data?: unknown;
}

export function log(
  level: LogEntry["level"],
  service: string,
  message: string,
  data?: unknown,
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service,
    message,
    data,
  };

  const logMessage = `[${entry.timestamp}] ${level.toUpperCase()} [${service}] ${message}${
    data ? `\n${JSON.stringify(data, null, 2)}` : ""
  }`;

  console[level === "debug" ? "log" : level](logMessage);

  fs.appendFileSync(LOG_FILE, logMessage + "\n");
}

export const logger = {
  info: (service: string, message: string, data?: unknown) => log("info", service, message, data),
  warn: (service: string, message: string, data?: unknown) => log("warn", service, message, data),
  error: (service: string, message: string, data?: unknown) => log("error", service, message, data),
  debug: (service: string, message: string, data?: unknown) => log("debug", service, message, data),
};
