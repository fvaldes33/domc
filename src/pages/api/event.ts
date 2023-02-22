// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { z } from "zod";

const PlausibleEventSchema = z.object({
  name: z.string(),
  url: z.string(),
  domain: z.string(),
  screen_width: z.number(),
  props: z.record(z.string().or(z.number())),
});

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
  res: NextApiResponse<{ ok: boolean }>
) {
  await runMiddleware(req, res, cors);

  const validation = PlausibleEventSchema.safeParse(req.body);
  if (!validation.success) {
    console.log(validation.error);
    return res.status(500).json({
      ok: false,
    });
  }

  const { name, url, domain, ...rest } = validation.data;
  const forward = req.headers["x-forwarded-for"] ?? "127.0.0.1";

  const response = await fetch(`https://plausible.io/api/event`, {
    method: "post",
    body: JSON.stringify({
      name,
      url: `app://localhost${url}`,
      domain,
      ...rest,
    }),
    headers: {
      "User-Agent": req.headers["user-agent"] ?? "",
      "X-Forwarded-For": Array.isArray(forward) ? forward[0] : forward,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return res.status(500).json({
      ok: false,
    });
  }

  return res.json({
    ok: true,
  });
}
