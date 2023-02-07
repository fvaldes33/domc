import { useGetBalance } from "@/hooks/useCustomer";
import { formatCurrency } from "@/utils/formatCurrency";
import { IconChartLine, IconLoader2, IconLoader3 } from "@tabler/icons-react";

export function Balance() {
  const { data: billing } = useGetBalance();

  return (
    <div className="mb-6">
      <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
        <IconChartLine className="" size={20} strokeWidth={1.5} />
        <span className="ml-2 uppercase">Usage</span>
      </p>
      <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="rounded-lg p-2 h-20 flex flex-col bg-ocean shadow-lg shadow-ocean/25">
          <p className="text-xs text-indigo-200">Balance</p>
          <p className="text-lg text-indigo-50 font-bold mt-auto">
            {billing ? (
              formatCurrency(Number(billing.account_balance))
            ) : (
              <IconLoader3 size={16} />
            )}
          </p>
        </div>
        <div className="rounded-lg p-2 h-20 flex flex-col bg-ocean shadow-lg shadow-ocean/25">
          <p className="text-xs text-indigo-200">MTD</p>
          <p className="text-lg text-indigo-50 font-bold mt-auto">
            {billing ? (
              formatCurrency(Number(billing.month_to_date_balance))
            ) : (
              <IconLoader3 size={16} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
