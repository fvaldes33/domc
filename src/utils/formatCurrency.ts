export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("us-EN", {
    style: "currency",
    currency: "USD",
  }).format(currency);
}
