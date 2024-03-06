interface HeadingProps {
  text: string
}

export default function Heading({text}: HeadingProps) {
  return (
      <h1 className={'text-2xl md:text-3xl mt-2 mb-7 font-bold tracking-tight'}>
        {text}
      </h1>
  )
}