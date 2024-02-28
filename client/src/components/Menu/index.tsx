import {Logo, MenuWrapper, StyledLink} from './style.ts'

interface MenuButtonProps {
  path: string
  title: string
}

function MenuButton({path, title}: MenuButtonProps) {
  return (
    <StyledLink to={path} className={'bg-primary w-100 p-4'}>{title}</StyledLink>
  )
}

function Menu() {
  return (
      <MenuWrapper className={'flex flex-col w-fit h-100 pt-4'}>
        <div className={'flex flex-row items-center ml-3 mr-20'}>
          <Logo src={'logo_main.svg'} alt={'logo'}/>
          <h1 className={'text-2xl ml-2'}>Pabulum</h1>
        </div>
        <div className={'flex flex-col justify-between mt-5 h-100'}>
          <div className={'flex flex-col gap-y-2'}>
            <MenuButton path={'/search'} title={'Search recipes'}/>
            <MenuButton path={'/discover'} title={'Discover'}/>
            <MenuButton path={'/myRecipes'} title={'My recipes'}/>
            <MenuButton path={'/categories'} title={'Categories'}/>
            <MenuButton path={'/create'} title={'Create recipe'}/>
          </div>
          <div className={'flex flex-col gap-y-2'}>
            <MenuButton path={'/account'} title={'My profile'}/>
          </div>
        </div>
      </MenuWrapper>
  )
}

export default Menu