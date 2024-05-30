import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();

	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			localStorage.setItem("user-posts", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"80vw"} py={20} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"5xl"} textAlign={"center"} fontWeight={"semibold"} color={"black"} pb={20}>
						Log In
					</Heading>
				</Stack>
				<Stack direction={{ base: "column", md: "row" }} spacing={20} align={"center"} justify={"center"}>
					<Box
						borderRadius="4xl"
					>
						<Image
							src="/public/chef_2.png"
							alt="chef"
							objectFit="cover"
							maxW={{ md: "30vw" }}
							borderRadius="2xl"
						/>
					</Box>

					<Box
						rounded={"lg"}
						bg={useColorModeValue("white", "gray.700")}
						boxShadow={"lg"}
						p={8}
						w={{ base: "full", sm: "400px" }}
					>
						<Stack spacing={4}>
							<FormControl isRequired>
								<FormLabel fontSize="xs" fontWeight="medium" textTransform="uppercase" color="gray.900">
									Username
								</FormLabel>
								<Input
									type='text'
									value={inputs.username}
									onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
									bg="white"
									borderColor="gray.200"
									focusBorderColor="blue.500"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel fontSize="xs" fontWeight="medium" textTransform="uppercase" color="gray.900">
									Password
								</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? "text" : "password"}
										value={inputs.password}
										onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
										bg="white"
										borderColor="gray.200"
										focusBorderColor="blue.500"
									/>
									<InputRightElement h={"full"}>
										<Button
											variant={"ghost"}
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<Stack spacing={10} pt={2}>
								<Button
									loadingText='Logging in'
									size='lg'
									bg={useColorModeValue("black", "gray.700")}
									color={"white"}
									_hover={{
										bg: useColorModeValue("blackAlpha.800", "gray.800"),
									}}
									onClick={handleLogin}
									isLoading={loading}
								>
									Login
								</Button>
							</Stack>
							<Stack pt={6}>
								<Text align={"center"}>
									Don't have an account?{" "}
									<Link color={"green.400"}  fontWeight={"bold"} onClick={() => setAuthScreen("signup")}>
										Sign up
									</Link>
								</Text>
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Stack>
		</Flex>
	);
}
