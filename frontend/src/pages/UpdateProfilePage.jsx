import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
	IconButton,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const initialInputs = useRef(inputs); // Save the initial inputs

	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);

	const showToast = useShowToast();

	const { handleImageChange, imgUrl } = usePreviewImg();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const onCloseDialog = () => setIsDialogOpen(false);
	const cancelRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return;
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json(); // updated user object
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);
			localStorage.setItem("user-posts", JSON.stringify(data));
			initialInputs.current = { ...inputs, profilePic: imgUrl };
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};

	const handleDiscardChanges = () => {
		setInputs(initialInputs.current);
		setIsDialogOpen(false);
	};

	const handleCancel = () => {
		setIsDialogOpen(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"md"}
					bg={useColorModeValue("white", "gray.dark")}
					rounded={"sm"}
					boxShadow={"lg"}
					p={6}
				>
					<Flex justify={"space-between"} align={"center"}>
						<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
							User Profile Edit
						</Heading>
						<IconButton
							icon={<CloseIcon />}
							onClick={() => setIsDialogOpen(true)}
							variant="ghost"
							aria-label="Close"
						/>
					</Flex>
					<FormControl id='userName'>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
							</Center>
							<Center w='full'>
								<Button w='full' onClick={() => fileRef.current.click()}>
									Change Avatar
								</Button>
								<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
							</Center>
						</Stack>
					</FormControl>
					<FormControl>
						<FormLabel>Full name</FormLabel>
						<Input
							placeholder='John Doe'
							value={inputs.name}
							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>User name</FormLabel>
						<Input
							placeholder='johndoe'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email address</FormLabel>
						<Input
							placeholder='your-email@example.com'
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='email'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input
							placeholder='Your bio.'
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							placeholder='password'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='password'
						/>
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							bg={"gray.500"}
							color={"white"}
							w='full'
							_hover={{
								bg: "gray.500",
							}}
							onClick={() => setIsDialogOpen(true)}
						>
							Cancel
						</Button>
						<Button
							bg={"gray.500"}
							color={"white"}
							w='full'
							_hover={{
								bg: "gray.500",
							}}
							type='submit'
							isLoading={updating}
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
			<AlertDialog
				isOpen={isDialogOpen}
				leastDestructiveRef={cancelRef}
				onClose={onCloseDialog}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Discard Changes
						</AlertDialogHeader>
						<AlertDialogBody>
							Are you sure you want to discard your changes? All unsaved data will be lost.
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={handleCancel}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={handleDiscardChanges} ml={3}>
								Discard
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</form>
	);
}
