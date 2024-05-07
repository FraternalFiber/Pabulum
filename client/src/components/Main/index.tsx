import React from "react";

type MainProps = {
  children?: React.ReactNode
}

// Main container, next to the Menu.
export function Main({children}: MainProps) {
  return (
      <main className={'grow mt-9 sm:mt-0 pl-8 p-6 sm:pl-6 overflow-y-auto'}>
        {children}
      </main>
  )
}