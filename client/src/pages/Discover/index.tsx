import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import { useEffect } from "react";

export function Discover() {
  useEffect(() => {
    document.title = "Discover - Pabulum";
  }, []);

  return (
    <>
      <Menu />
      <Main />
    </>
  );
}
