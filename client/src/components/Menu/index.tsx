import {MenuWrapper, StyledLink} from './style.ts'

interface MenuButtonProps {
  path: string
  title: string
}

function MenuButton({path, title}: MenuButtonProps) {
  return (
    <StyledLink to={path} className={'w-100 p-4 hover:bg-primary'}>{title}</StyledLink>
  )
}

function Menu() {
  return (
      <MenuWrapper className={'flex flex-col w-fit h-100 bg-secondary'}>
        <div className={'flex flex-row items-center mt-4 mr-20 ml-3'}>
          <img src={'logo_main.svg'} alt={'logo'} className={'w-14'}/>
          <h1 className={'text-2xl ml-2'}>Pabulum</h1>
        </div>
        <div className={'flex flex-col justify-between grow mt-5 h-100'}>
          <div className={'flex flex-col gap-y-2'}>
            <MenuButton path={'/search'} title={'Search recipes'}/>
            <MenuButton path={'/discover'} title={'Discover'}/>
            <MenuButton path={'/myRecipes'} title={'My recipes'}/>
            <MenuButton path={'/pantry'} title={'My pantry'}/>
            <MenuButton path={'/createRecipe'} title={'Create recipe'}/>
          </div>
          <div className={'flex flex-col mt-5 gap-y-2'}>
            <MenuButton path={'/account'} title={'My account'}/>
          </div>
        </div>
      </MenuWrapper>
  )
}

export default Menu