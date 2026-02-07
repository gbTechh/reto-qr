import React from "react";
import { Button } from "../ui/button";
import { History } from "lucide-react";

export const ButtonHistorial = () => {
  return (
    <div className="flex flex-col gap-8">
      <Button size="icon" className="rounded-full">
        <History className="text-cards" />
      </Button>
    </div>
  );
};
