import React from "react";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

interface MainProps {
  children?: React.ReactNode
}

// Main container, next to the Menu.
export function Main({children}: MainProps) {
  return (
      <main className={'grow mt-8 sm:mt-0 pl-8 p-6 sm:pl-6 overflow-y-auto'}>
        {children}
        {/* Dev tools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </main>
  )
}