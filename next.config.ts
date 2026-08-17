import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No generar archivos de reglas para agentes en el repo.
  agentRules: false,
};

export default nextConfig;
