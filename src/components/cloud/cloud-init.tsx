"use client";

import { useEffect } from "react";
import { initCloud } from "@/lib/cloud-sync";

/** Inicializa la sincronización con la nube (listener de auth). */
export function CloudInit() {
  useEffect(() => {
    initCloud();
  }, []);
  return null;
}
