import { Box, Button, Container, Flex, Link, Text, useColorMode } from "@chakra-ui/react";
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
		<Box bg="white" color="black" p={4} borderRadius="3xl" my={4}>
			<Container maxW="container.lg">
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontFamily="Lobster">
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
									_activeLink={{ textDecoration: "underline", color: "green.600" }}
								>
									Home
								</Link>
								<Link
									as={RouterNavLink}
									to="/recipes"
									mx={4}
									_hover={{ color: "green.800" }}
									_activeLink={{ textDecoration: "underline", color: "green.600" }}
								>
									Recipes
								</Link>
								<Link
									as={RouterNavLink}
									to={`/${user.username}`}
									mx={4}
									_hover={{ color: "green.800" }}
									_activeLink={{ textDecoration: "underline", color: "green.600" }}
								>
									Profile
								</Link>
								<Link
									as={RouterNavLink}
									to="/chat"
									mx={4}
									_hover={{ color: "green.800" }}
									_activeLink={{ textDecoration: "underline", color: "green.600" }}
								>
									Chat
								</Link>
								<Link
									as={RouterNavLink}
									to="/community"
									mx={4}
									_hover={{ color: "green.800" }}
									_activeLink={{ textDecoration: "underline", color: "green.600" }}
								>
									Community
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
				</Flex>
			</Container>
		</Box>
	);
};

export default Header;
