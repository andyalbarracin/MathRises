import { Dumbbell } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/ui/page-header";

export default function PracticaPage() {
  return (
    <>
      <PageHeader
        title="Práctica"
        subtitle="Elegí qué ejercitar: áreas débiles, un tema puntual o una mezcla aleatoria."
      />
      <EmptyState
        icon={Dumbbell}
        title="Todavía no hay práctica libre"
        description="Cuando completes tu primera sesión, vas a poder practicar por tema, repasar errores o hacer una mezcla."
      />
    </>
  );
}
