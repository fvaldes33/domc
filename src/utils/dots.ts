import { createApiClient as _createApiClient } from "dots-wrapper";
import { z } from "zod";

export const ClientSchema = z.object({
  token: z.string(),
});

export function createApiClient(token: string) {
  const dots = _createApiClient({ token });
  return dots;
}
