// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Cors from "cors";
import { z } from "zod";

const DownloadLogsSchema = z.object({
  url: z.string().url(),
});
type Data = {
  success: boolean;
  content: string | null;
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
  const url = req.query.url;
  if (!url) {
    return res.status(500).json({
      success: false,
      content: null,
    });
  }

  try {
    const response = await fetch(url as string);
    const reader = response.body?.getReader();
    if (reader) {
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      });
      const readable = new Readable({
        read() {
          reader?.read().then(({ done, value }) => {
            if (done) {
              this.push(null);
            } else {
              this.push(value);
            }
          });
        },
      });

      readable.pipe(res);
    }
    throw new Error("Something bad happened");
  } catch (error) {
    console.error("Error fetching log:", error);
    return res.status(500).json({
      success: false,
      content: null,
    });
  }

  // res.end();
}
