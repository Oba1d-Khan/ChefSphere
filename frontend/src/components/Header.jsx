import { Box, Button, Container, Flex, Link, Text, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
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
						<Text fontSize="2xl"  fontFamily={"Lobster"}>
							<Link as={RouterLink} to="/" src="/chefsphere_logo.svg"
							// onClick={toggleColorMode}
							>
								ChefSphere
							</Link>
						</Text>
						<Flex flex="1" justify="center">
							{user ? (
								<>
									<Link as={RouterLink} to="/" mx={4} _hover={{ color: "gray.400" }}>
										Home
									</Link>
									<Link as={RouterLink} to={`/${user.username}`} mx={4} _hover={{ color: "gray.400" }}>
										Profile
									</Link>
									<Link as={RouterLink} to="/recipes" mx={4} _hover={{ color: "gray.400" }}>
										Recipes
									</Link>
									<Link as={RouterLink} to="/chat" mx={4} _hover={{ color: "gray.400" }}>
										Chat
									</Link>
									<Button size="xs" onClick={logout} ml={4}>
										<FiLogOut size={20} />
									</Button>
								</>
							) : (
								<>
									<Link as={RouterLink} to="/auth" mx={4} _hover={{ color: "gray.400" }} onClick={() => setAuthScreen("login")}>
										Login
									</Link>
									<Link as={RouterLink} to="/auth" mx={4} _hover={{ color: "gray.400" }} onClick={() => setAuthScreen("signup")}>
										Sign up
									</Link>
								</>
							)}
						</Flex>
						<Flex align="center">
							{["facebook", "twitterx", "instagram"].map((icon) => (
								<Link
									href={icon === "facebook" ? "https://web.facebook.com/?_rdc=1&_rdr" :
										icon === "twitterx" ? "https://twitter.com/" : "https://www.instagram.com/"}
									target="_blank"
									_hover={{ color: "gray.400" }}
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
