// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { z } from "zod";
import { DO_BASE_URL } from "@/utils/const";

const DestroyDropletSchema = z.object({
  droplet_id: z.number(),
  token: z.string(),
});

type Data = {
  success: boolean;
  error?: any;
};

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const validation = DestroyDropletSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(500).json({
      success: false,
      error: validation.error.format(),
    });
  }

  const { droplet_id, token } = validation.data;
  const url = `${DO_BASE_URL}/droplets/${droplet_id}/destroy_with_associated_resources/dangerous`;
  try {
    const response = await fetch(url, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
        "X-Dangerous": "true",
      },
    });
    if (!response.ok) {
      return res.status(500).json({
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }

  return res.json({
    success: true,
  });
}
