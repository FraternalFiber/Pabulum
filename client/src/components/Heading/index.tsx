type HeadingProps = {
  content: string
}

export function Heading({content}: HeadingProps) {
  return (
      <h1 className={'text-3xl mt-2 mb-7 font-bold tracking-tight'}>
        {content}
      </h1>
  )
}