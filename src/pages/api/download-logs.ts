// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const DownloadLogsSchema = z.object({
  url: z.string().url(),
});
type Data = {
  success: boolean;
  content: string | null;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const validation = DownloadLogsSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(500).json({
      success: false,
      content: null,
      error: validation.error.format(),
    });
  }

  const { url } = validation.data;
  const response = await fetch(url);

  if (!response.ok) {
    return res.status(500).json({
      success: false,
      content: null,
    });
  }

  const data = await response.text();
  return res.json({
    success: true,
    content: data,
  });
}
