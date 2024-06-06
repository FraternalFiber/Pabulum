import { Link, NavLink } from "react-router-dom";
import React from "react";
import {
  Compass as CompassIcon,
  PlusCircle as PlusCircleIcon,
  Refrigerator as RefrigeratorIcon,
  ScrollText as ScrollTextIcon,
  Search as SearchIcon,
  User as UserIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import pabulumLogoWithText from "@/assets/images/logo_with_text.svg";
import { cn } from "@/lib/utils.ts";

type MenuButtonProps = {
  path: string;
  title: string;
  icon: React.JSX.Element;
};

const menuButtons: Array<MenuButtonProps> = [
  { title: "Search recipes", path: "/search", icon: <SearchIcon size={20} /> },
  { title: "Discover", path: "/discover", icon: <CompassIcon size={20} /> },
  { title: "My recipes", path: "/user/recipes", icon: <ScrollTextIcon size={20} /> },
  { title: "My pantry", path: "/pantry", icon: <RefrigeratorIcon size={20} /> },
  { title: "Create recipe", path: "/user/recipes/create", icon: <PlusCircleIcon size={20} /> },
];

function MenuButton({ title, path, icon }: MenuButtonProps) {
  return (
    // Highlight the button when the corresponding subpage is active
    <NavLink
      to={path}
      className={(nav) =>
        cn("flex p-4 hover:bg-primary rounded-sm", nav.isActive ? "bg-primary" : "")
      }
      data-testid={title}
    >
      <div className={"flex items-center mr-2"}>{icon}</div>
      <div>{title}</div>
    </NavLink>
  );
}

function MenuContent() {
  return (
    <>
      <Link to={"/"} className={"flex flex-row items-center mt-4 ml-3 mr-2 select-none"}>
        <img src={pabulumLogoWithText} alt={"Pabulum logo"} className={"w-full"} />
      </Link>
      <div className={"flex flex-col justify-between grow mt-5 mb-2 pr-2 pl-2"}>
        <div className={"flex flex-col gap-y-2"}>
          {menuButtons.map((button: MenuButtonProps) => (
            <MenuButton
              title={button.title}
              path={button.path}
              icon={button.icon}
              key={button.path}
            />
          ))}
        </div>
        <div className={"mt-2"}>
          <MenuButton
            title={"My account"}
            path={"/account"}
            icon={<UserIcon size={20} />}
            key={"/account"}
          />
        </div>
      </div>
    </>
  );
}

function Menu() {
  return (
    <>
      {/* Fixed menu */}
      <nav
        className={
          "hidden sm:flex flex-col w-60 min-w-60 h-full bg-secondary border-r border-gray-300 overflow-y-auto"
        }
        data-testid={"menu-fixed-nav"}
      >
        <MenuContent />
      </nav>
      {/* Collapsable menu */}
      <div
        className={"sm:hidden fixed flex-col w-screen top-0 pl-3 pt-2 pb-1 bg-white z-50"}
        data-testid={"menu-collapsable-nav"}
      >
        <Sheet>
          <SheetTrigger>
            <MenuIcon size={35} className={"p-0 m-0"} />
          </SheetTrigger>
          <SheetContent className={"w-60 p-2 pt-5 flex flex-col overflow-y-auto"} side={"left"}>
            <MenuContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export { Menu };
