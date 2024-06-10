import { useEffect } from "react";

export function Pantry() {
  useEffect(() => {
    document.title = "My pantry - Pabulum";
  }, []);

  return <></>;
}
