import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const PresencasPorMesClient = dynamic(
  () => import("../PresencasPorMesClient"),
  { suspense: true }
);

export default function PresencasPorMesPage() {
  return (
    <Suspense fallback={<div>Carregando presenças...</div>}>
      <PresencasPorMesClient />
    </Suspense>
  );
}
