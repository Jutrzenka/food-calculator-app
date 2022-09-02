import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async activateFullAccount(
    login: string,
    newLogin: string,
    password: string,
    registerCode: string,
  ) {
    throw new Error('Method not implemented.');
  }
  async register() {
    throw new Error('Method not implemented.');
  }
  async logout() {
    throw new Error('Method not implemented.');
  }
  async login() {
    throw new Error('Method not implemented.');
  }
}
