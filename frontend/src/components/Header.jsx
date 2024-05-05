import { Box, Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (

		<>
			<nav className="bg-white text-black p-4">
				<div className="container mx-auto flex justify-between items-center">
					<a className="text-lg font-semibold" src={colorMode === "light" ? "/chefsphere_logo.svg" : "/chefsphere_logo.svg"}
						// onClick={toggleColorMode}
						>
						ChefSphere
					</a>
					<div className="flex justify-center flex-1 ">
						{user && (
							<Link as={RouterLink} to='/' className="mx-14">
								{/* <AiFillHome size={24} /> */}
								Home
							</Link>
						)}
						{!user && (
							<Link   className="mx-14" as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
								Login
							</Link>
						)}

						{user && (
							<Flex alignItems={"center"} gap={16}>
								<Link as={RouterLink} to={`/${user.username}`}>
									{/* <RxAvatar size={24} /> */}
									Profile
								</Link>
								<Link as={RouterLink} to={`/chat`}>
									{/* <BsFillChatQuoteFill size={20} /> */}
									Chat
								</Link>
								{/* <Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link> */}
								<Button size={"xs"} onClick={logout}>
									<FiLogOut size={20} />
								</Button>
							</Flex>
						)}

						{!user && (
							<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
								Sign up
							</Link>
						)}
					</div>
					<div className="flex items-center">
						<a href="https://web.facebook.com/?_rdc=1&_rdr" target="_blank" className="hover:text-gray-400 mr-4">
							<svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
								<image href="/public/icons8-facebook.svg" width="24" height="24" />
							</svg>
						</a>
						<a href="https://twitter.com/" target="_blank" className="hover:text-gray-400 mr-4">
							<svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
								<image href="/public/icons8-twitterx.svg" width="24" height="24" />
							</svg>
						</a>
						<a href="https://www.instagram.com/" target="_blank" className="hover:text-gray-400 mr-4">
							<svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
								<image href="/public/icons8-instagram.svg" width="24" height="24" />
							</svg>
						</a>
					</div>
				</div>
			</nav>
			
		</>
	);
};

export default Header;
