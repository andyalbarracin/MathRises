import { FileCheck2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/ui/page-header";

export default function SimulacrosPage() {
  return (
    <>
      <PageHeader
        title="Simulacros"
        subtitle="Exámenes de práctica cronometrados de Matemática, Geometría y Seminario."
      />
      <EmptyState
        icon={FileCheck2}
        title="Los simulacros llegan más adelante"
        description="A partir de enero 2027 vas a rendir simulacros completos con puntaje y desglose por tema."
      />
    </>
  );
}
