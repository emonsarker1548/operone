import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Success - Operone",
  description: "Successfully authenticated with Operone",
  icons: {
    icon: "/logo/passkey.svg",
  },
};

export default function AuthSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </section>
  )
}
