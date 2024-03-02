import React from "react";

interface Props {
  children?: React.ReactNode
}

export function Main({children}: Props) {
  return (
      <main className={'p-4 md:p-6'}>
        {children}
      </main>
  )
}