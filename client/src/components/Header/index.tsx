import './header.scss'

function Header() {
  return (
      <>
        <header>
          <img src={'logo_main.svg'} alt={'logo'}/>
          <h1 className={'text-3xl'}>Pabulum</h1>
        </header>
      </>

  )
}

export default Header