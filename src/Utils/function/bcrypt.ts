import { hash, compare } from 'bcrypt';
import configuration from '../config/configuration';

interface MessageCrypt {
  status: boolean;
  data?: string;
  error?: string;
}

export async function encryption(text: string): Promise<MessageCrypt> {
  try {
    return {
      status: true,
      data: await hash(text, configuration().server.salt),
    };
  } catch (err) {
    return {
      status: false,
      error: err,
    };
  }
}

export async function decryption(text: string, hash: string): Promise<boolean> {
  return await compare(text, hash);
}
