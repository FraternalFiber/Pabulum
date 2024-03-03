import React from "react";

interface MainProps {
  children?: React.ReactNode
}

// Main container, next to the Menu.
export function Main({children}: MainProps) {
  return (
      <main className={'grow p-5 md:p-6'}>
        {children}
      </main>
  )
}