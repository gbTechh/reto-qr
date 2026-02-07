import React from "react";
import { Button } from "../ui/button";
import { History } from "lucide-react";
import Link from "next/link";

export const ButtonHistorial = () => {
  return (
    <div className="flex flex-col gap-8">
      <Button asChild variant="outline" className="rounded-full gap-2">
        <Link href="/historial">
          <History className="w-4 h-4" />
          Ver Historial
        </Link>
      </Button>
    </div>
  );
};
