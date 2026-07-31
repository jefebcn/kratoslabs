import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE } from "@/lib/constants";
import type { LocaleCode } from "@/types";

const SUPPORTED = LOCALES.map((l) => l.code) as LocaleCode[];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requested = cookieStore.get(LOCALE_COOKIE)?.value as
    | LocaleCode
    | undefined;
  const locale =
    requested && SUPPORTED.includes(requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
