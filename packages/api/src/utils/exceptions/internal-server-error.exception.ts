import { GlobalException } from "./global.exception";
export class InternalServerErrorExecption extends GlobalException {
  constructor(message: string, error: any) {
    console.log({ error });
    super(message, 504, error);
    this.message = message;
    this.error = error;
    this.status = 504;
  }
}
