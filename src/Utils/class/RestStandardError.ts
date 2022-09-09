import { HttpException } from '@nestjs/common';

export class RestStandardError extends HttpException {
  constructor(response: string | Record<string, any>, status: number) {
    super({ success: false, message: response, data: null }, status);
  }
}
