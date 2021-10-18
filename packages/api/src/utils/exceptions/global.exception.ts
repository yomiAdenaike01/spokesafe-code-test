export class GlobalException extends Error {
  error: any;
  status: number;
  constructor(message: string, status: number, error: any) {
    super(message);
    this.message = message;
    this.error = String(error);
    this.status = status;
  }
}
