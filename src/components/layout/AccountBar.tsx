import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { AccountMenu } from "@/components/layout/AccountMenu";

/** Barra utility in cima: account a sinistra, valuta/lingua a destra. */
export function AccountBar() {
  return (
    <div className="bg-[#2a2e35] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <AccountMenu />
        <div className="flex items-center">
          <CurrencyToggle />
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
