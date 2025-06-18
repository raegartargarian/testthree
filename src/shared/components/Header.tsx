import LogoText from "@/assets/logo/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSelectors } from "@/containers/global/selectors";
import { globalActions } from "@/containers/global/slice";
import { LogOut, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { appRoutes } from "../constants/routes";
import { useWalletAddress } from "../hooks/useWalletAddr";
import { formatKebabCase } from "../utils/formatKebab";

export const Header = () => {
  const tokenCodes = useSelector(GlobalSelectors.tokens);
  const [searchParams] = useSearchParams();
  const currentToken = searchParams.get("token");

  const baseClassRoute = "hover:text-white pb-1 text-gray-300 ";
  const activeClassRoute =
    baseClassRoute + "border-b-2 text-white border-b-white";
  const inactiveClassRoute = baseClassRoute;
  const walletAddr = useWalletAddress();
  const dispatch = useDispatch();
  const isTokenActive = (tokenName: string) => {
    if (!currentToken) return false;
    return tokenName === currentToken;
  };

  const handleLogout = () => {
    dispatch(globalActions.logOut());
  };

  return (
    <>
      <header className="text-white h-[88px] border-b-gray-150 border-b">
        <div className="container m-auto flex items-center justify-between h-full">
          {/* Left section for desktop */}
          {/* Hamburger Menu for mobile/tablet */}
          <div className="md:hidden text-white focus:outline-none">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu size={24} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to={`${appRoutes.dashboard.path}`}>Home</Link>
                </DropdownMenuItem>
                {tokenCodes?.map((token) => (
                  <DropdownMenuItem key={token.name}>
                    <Link
                      to={`${appRoutes.attachments.path}?token=${token.name}`}
                      className="hover:text-gray-400"
                    >
                      {formatKebabCase(token.name)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Website Title */}
          <Link to="/">
            <img className="w-36" src={LogoText} alt="" />
          </Link>
          {/* Menu Links for desktop */}
          <nav className="hidden md:flex space-x-6">
            <NavLink
              to={`${appRoutes.dashboard.path}`}
              className={({ isActive }) =>
                isActive && !currentToken
                  ? activeClassRoute
                  : inactiveClassRoute
              }
            >
              Home
            </NavLink>
            {tokenCodes?.map((token) => (
              <NavLink
                key={token.name}
                to={`${appRoutes.attachments.path}?token=${token.name}`}
                className={
                  isTokenActive(token.name)
                    ? activeClassRoute
                    : inactiveClassRoute
                }
              >
                {formatKebabCase(token.name)}
              </NavLink>
            ))}
          </nav>
          {/* Wallet Address Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-black h-12 w-40 flex items-center cursor-pointer text-white justify-center rounded-lg">
              {walletAddr?.slice(0, 6) +
                "..." +
                walletAddr?.slice(walletAddr.length - 4)}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default Header;
