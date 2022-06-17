// pages/api/login.ts

import axios from 'axios';
import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { API_URL } from '@/constant/backend';
import { COOKIE_OPTIONS } from '@/constant/cookie';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      name: string;
      admin?: boolean;
    };
  }
}

export type UserSession = {
  id: number;
  name: string;
  admin?: boolean;
};

export type LoginResponse = {
  message?: string;
  status?: number;
  ok?: boolean;
};

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    switch (method) {
      case 'POST': {
        const data = await axios.post(`${API_URL}/admin/ktp`, req.body);

        res.status(data.status).send(data.data);
        break;
      }
      case 'GET': {
        const data = await axios.get(`${API_URL}/admin/ktp`);
        res.status(data.status).send(data.data);
        break;
      }
      default:
        res
          .status(httpStatus.METHOD_NOT_ALLOWED)
          .end(`Method ${method} Not Allowed`);
    }
  },
  COOKIE_OPTIONS
);
