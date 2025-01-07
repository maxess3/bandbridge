import ResetPasswordForm from "@/components/ResetPasswordForm";

import { redirect } from "next/navigation";

import { BASE_URL } from "@/lib/constants";

export default async function Reset({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const id = slug[0];
  const token = slug[1];

  if (!id || !token) redirect("/");

  const validateToken = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/auth/validate-reset-token?token=${token}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Invalid token");
      }
      const data = await res.json();
      return data.valid;
    } catch (error) {
      if (error) return false;
    }
  };

  const isValid = await validateToken();

  if (!isValid) {
    redirect("/");
  }

  return <ResetPasswordForm userId={id} token={token} />;
}
