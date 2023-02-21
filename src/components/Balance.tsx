import { useGetBalance } from "@/hooks/useCustomer";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  IconArrowRight,
  IconChartLine,
  IconLoader2,
  IconLoader3,
} from "@tabler/icons-react";
import HapticLink from "./HapticLink";

export function Balance() {
  const { data: billing } = useGetBalance();

  return (
    <div className="mb-6">
      <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
        <IconChartLine className="" size={20} strokeWidth={1.5} />
        <span className="ml-2 uppercase">Billing / Usage</span>

        <HapticLink href="/billing" className="flex items-center ml-auto">
          <span>View All</span>
          <IconArrowRight size={16} />
        </HapticLink>
      </p>
      <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <HapticLink
          href="/billing"
          className="p-2 h-20 flex flex-col border border-ocean-2 bg-ocean-2/10 rounded-md shadow-lg shadow-ocean/25"
        >
          <p className="text-xs font-mono">Balance</p>
          <p className="text-lg font-bold mt-auto">
            {billing ? (
              formatCurrency(Number(billing.account_balance))
            ) : (
              <IconLoader3 size={16} />
            )}
          </p>
        </HapticLink>
        <HapticLink
          href="/billing"
          className="p-2 h-20 flex flex-col border border-ocean-2 bg-ocean-2/10 rounded-md shadow-lg shadow-ocean/25"
        >
          <p className="text-xs font-mono">MTD</p>
          <p className="text-lg font-bold mt-auto">
            {billing ? (
              formatCurrency(Number(billing.month_to_date_usage))
            ) : (
              <IconLoader3 size={16} />
            )}
          </p>
        </HapticLink>
      </div>
    </div>
  );
}
