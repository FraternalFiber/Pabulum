import {Link, NavLink} from "react-router-dom";
import React from "react";
import {Compass, PlusCircle, Refrigerator, ScrollText, Search as SearchIcon, User, Menu as MenuIcon} from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";

interface MenuButtonProps {
  path: string
  title: string
  icon: React.JSX.Element
}

const menuButtons : Array<MenuButtonProps> = [
  { title: 'Search recipes', path: '/search', icon: <SearchIcon size={20}/>},
  { title: 'Discover', path: '/discover', icon: <Compass size={20}/>},
  { title: 'My recipes', path: '/recipe', icon: <ScrollText size={20}/>},
  { title: 'My pantry', path: '/pantry', icon: <Refrigerator size={20}/>},
  { title: 'Create recipe', path: '/recipe/create', icon: <PlusCircle size={20}/>}
]

function MenuButton({title, path, icon}: MenuButtonProps) {
  return (
    // highlight the button when the corresponding subpage is active
    <NavLink to={path} className={nav => `${nav.isActive ? 'bg-primary' : ''} flex w-100 p-4 hover:bg-primary rounded-sm`} end>
      <div className={'flex items-center mr-2'}>{icon}</div>
      <div>{title}</div>
    </NavLink>
  )
}

function MenuContent() {
  return (
      <>
        <Link to={'/'} className={'flex flex-row items-center mt-4 ml-3 select-none'}>
          <img src={'/logo_main.svg'} alt={'logo'} className={'w-14'} draggable={'false'}/>
          <h1 className={'text-2xl ml-2 font-bold tracking-wide'}>Pabulum</h1>
        </Link>
        <div className={'flex flex-col justify-between grow mt-5 mb-2 pr-2 pl-2 min-h-100'}>
          <div className={'flex flex-col gap-y-2'}>
            {menuButtons.map((button: MenuButtonProps) => (
                <MenuButton title={button.title} path={button.path} icon={button.icon} key={button.path}/>
            ))}
          </div>
          <div className={'flex flex-col mt-2 gap-y-2'}>
            <MenuButton title={'My account'} path={'/account'} icon={<User size={20}/>} key={'/account'}/>
          </div>
        </div>
      </>
  )
}

function Menu() {
  return (
      <>
        {/* Fixed menu */}
        <nav className={'hidden sm:flex flex-col min-w-60 h-100 bg-secondary border-r border-gray-300'}>
          <MenuContent/>
        </nav>
        {/* Collapsable menu */}
        <div className={'sm:hidden fixed flex-col top-0 p-3'}>
          <Sheet>
            <SheetTrigger>
              <MenuIcon size={35}/>
            </SheetTrigger>
            <SheetContent className={'w-60 p-2 pt-5'} side={'left'}>
              <MenuContent/>
            </SheetContent>
          </Sheet>
        </div>
      </>

  )
}

export { Menu }