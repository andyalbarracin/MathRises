import { ChartLine } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/ui/page-header";

export default function ProgresoPage() {
  return (
    <>
      <PageHeader
        title="Progreso"
        subtitle="Tu preparación para el ingreso: dominio por módulo, precisión, retención y tendencia."
      />
      <EmptyState
        icon={ChartLine}
        title="Sin datos suficientes todavía"
        description="Completá algunas sesiones para ver tu evolución, tus conceptos fuertes y los que necesitan repaso."
      />
    </>
  );
}
