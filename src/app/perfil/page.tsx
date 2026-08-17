import { User } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/ui/page-header";

export default function PerfilPage() {
  return (
    <>
      <PageHeader
        title="Perfil"
        subtitle="Tu objetivo, fecha meta, ritmo semanal y preferencias de estudio."
      />
      <EmptyState
        icon={User}
        title="Perfil en construcción"
        description="Acá vas a configurar tu meta (Ingeniería Industrial UNLaM 2027), tus horas semanales y tus días de estudio."
      />
    </>
  );
}
