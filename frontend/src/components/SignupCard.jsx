import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
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

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const handleSignup = async () => {
    try {
      if (inputs.password !== inputs.confirmPassword) {
        showToast("Error", "Passwords do not match", "error");
        return;
      }

      const res = await fetch("/api/users/signup", {
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
    }
  };

  return (
    <Box maxW="100vw" mx="auto" py="20">
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize="5xl"
          fontWeight="semibold"
          color="black"
          pb="20"
        >
          Sign Up
        </Heading>
      </Box>

      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        gap="40"
      >
        <Box borderRadius="2xl" bgGradient="linear(to-b, green.100 10%, green.300)" mb={"10"}
        >
          <Image
            src="/public/chef_1.png"
            alt="chef"
            objectFit="cover"
            maxW={{ md: "30vw" }}
            borderRadius="2xl"
          />
        </Box>

        <Box py="14">
          <Stack spacing={5} maxW="30rem" mx="auto">
            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                color="gray.700"
              >
                Name
              </FormLabel>
              <Input
                type="text"
                placeholder="Enter your name..."
                bg="white"
                borderColor="gray.200"
                focusBorderColor="green.500"
                value={inputs.name}
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                color="gray.700"
              >
                Username
              </FormLabel>
              <Input
                type="text"
                placeholder="Enter your username..."
                bg="white"
                borderColor="gray.200"
                focusBorderColor="green.500"
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                color="gray.900"
              >
                Email Address
              </FormLabel>
              <Input
                type="email"
                placeholder="Your email address..."
                bg="white"
                borderColor="gray.200"
                focusBorderColor="green.500"
                value={inputs.email}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                color="gray.900"
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  bg="white"
                  borderColor="gray.200"
                  focusBorderColor="green.500"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                color="gray.900"
              >
                Confirm Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  bg="white"
                  borderColor="gray.200"
                  focusBorderColor="green.500"
                  value={inputs.confirmPassword}
                  onChange={(e) =>
                    setInputs({ ...inputs, confirmPassword: e.target.value })
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowConfirmPassword(
                        (showConfirmPassword) => !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Flex justify="center" align="center" pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                colorScheme="blackAlpha"
                color="white"
                _hover={{ bg: "blackAlpha.700" }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Flex>

            <Flex gap="2" py="10" align="center" justify="center">
              <Text>Already have an account?</Text>
              <Link
                color={"green.400"} fontWeight={"bold"}
                onClick={() => setAuthScreen("login")}
              >
                Log In
              </Link>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}
