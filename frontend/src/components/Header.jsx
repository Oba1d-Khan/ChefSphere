import {
	Box,
	Button,
	Container,
	Flex,
	Link,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import userAtom from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<>
			<Box bg="white" color="black" p={4} borderRadius={"3xl"} my={"4"}>
				<Container maxW="container.lg">
					<Flex justify="space-between" align="center">
						<Text fontSize="2xl" fontFamily={"Lobster"}>
							<Link as={RouterNavLink} to="/" exact>
								ChefSphere
							</Link>
						</Text>
						<Flex flex="1" justify="center">
							{user ? (
								<>
									<Link
										as={RouterNavLink}
										to="/"
										exact
										mx={4}
										_hover={{ color: "green.800" }}
										_activeLink={{ textDecoration: "underline" }}
									>
										Home
									</Link>
									<Link
										as={RouterNavLink}
										to={`/${user.username}`}
										mx={4}
										_hover={{ color: "green.800" }}
										_activeLink={{ textDecoration: "underline" }}
									>
										Profile
									</Link>
									<Link
										as={RouterNavLink}
										to="/recipes"
										mx={4}
										_hover={{ color: "green.800" }}
										_activeLink={{ textDecoration: "underline" }}
									>
										Recipes
									</Link>
									<Link
										as={RouterNavLink}
										to="/chat"
										mx={4}
										_hover={{ color: "green.800" }}
										_activeLink={{ textDecoration: "underline" }}
									>
										Chat
									</Link>
									<Button size="xs" onClick={logout} ml={4}>
										<FiLogOut size={20} />
									</Button>
								</>
							) : (
								<>
									<Link
										as={RouterNavLink}
										to="/auth"
										mx={4}
										_hover={{ color: "green.800" }}
										_activeLink={{ textDecoration: "underline" }}
										onClick={() => setAuthScreen("login")}
									>
										Login
									</Link>
									<Link
										as={RouterNavLink}
										to="/auth"
										mx={4}
										_hover={{ color: "green.800" }}
										_activeLink={{ textDecoration: "underline" }}
										onClick={() => setAuthScreen("signup")}
									>
										Sign up
									</Link>
								</>
							)}
						</Flex>
						<Flex align="center">
							{["facebook", "twitterx", "instagram"].map((icon) => (
								<Link
									href={
										icon === "facebook"
											? "https://web.facebook.com/?_rdc=1&_rdr"
											: icon === "twitterx"
												? "https://twitter.com/"
												: "https://www.instagram.com/"
									}
									target="_blank"
									_hover={{ color: "green.800" }}
									mr={4}
									key={icon}
								>
									<Box as="svg" fill="currentColor" viewBox="0 0 24 24" h={6} w={6}>
										<image href={`/public/icons8-${icon}.svg`} width="24" height="24" />
									</Box>
								</Link>
							))}
						</Flex>
					</Flex>
				</Container>
			</Box>
		</>
	);
};

export default Header;
