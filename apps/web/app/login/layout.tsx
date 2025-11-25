import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Operone",
  description: "Sign in to your Operone account",
  icons: {
    icon: "/logo/passkey.svg",
  },
};

export default function LoginLayout({
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
