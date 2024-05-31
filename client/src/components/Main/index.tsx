import React from "react";

type MainProps = {
  children?: React.ReactNode;
};

// Main container, next to the Menu.
export function Main({ children }: MainProps) {
  return (
    <main className={"grow mt-9 sm:mt-0 p-6 md:pl-8 md:pr-8 overflow-y-auto"}>{children}</main>
  );
}
