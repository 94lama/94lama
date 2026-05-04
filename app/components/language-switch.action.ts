"use server";

import { cookies } from "next/headers";

export async function switchLanguage(lang: string) {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}
