import { loadData } from './data';

export const API = process.env.API_URL ?? 'http://localhost:3000/api';
export const WEB_URL = process.env.WEB_URL ?? 'http://localhost:5173';
export const ADMIN_URL = process.env.ADMIN_URL ?? 'http://localhost:5174';

export type Account = { email: string; password: string };
export const ACCOUNTS = loadData<{ admin: Account; user: Account }>('accounts.json');
