import { cookies } from "next/headers";

import { APP_CONFIG, UI_TEXT } from "@/lib/constants";
import { HeaderClient } from "@/components/layout/HeaderClient";

const AUTH_COOKIE_NAME = "propulsa_auth";
const AUTH_COOKIE_VALUE = "authenticated";

export async function Header() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;

  return <HeaderClient appName={APP_CONFIG.brandName} isAuthenticated={isAuthenticated} uiText={UI_TEXT} />;
}
