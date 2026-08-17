import { RefreshCw } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/ui/page-header";

export default function RepasosPage() {
  return (
    <>
      <PageHeader
        title="Repasos"
        subtitle="Repetición espaciada: los conceptos vuelven justo antes de que los olvides."
      />
      <EmptyState
        icon={RefreshCw}
        title="No hay repasos pendientes"
        description="A medida que aprendas conceptos, se van a programar repasos automáticos (1, 3, 7, 14 y 30 días)."
      />
    </>
  );
}
