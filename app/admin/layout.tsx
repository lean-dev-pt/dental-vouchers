import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Cheques Dentista",
  description: "Área de administração de suporte",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
