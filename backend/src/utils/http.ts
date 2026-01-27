export class HttpError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function ok<T extends object>(data: T) {
  return data;
}

export function created<T extends object>(data: T) {
  return data;
}
