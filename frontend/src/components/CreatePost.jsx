import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	FormLabel,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	VStack,
	useColorModeValue,
	useDisclosure,
	HStack,
	Select,
	Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 2000;

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postTitle, setPostTitle] = useState("");
	const [postText, setPostText] = useState("");
	const [cookingHours, setCookingHours] = useState("");
	const [cookingMinutes, setCookingMinutes] = useState("");
	const [recipeOrigin, setRecipeOrigin] = useState("");
	const [tags, setTags] = useState("");
	const [ingredients, setIngredients] = useState("");
	const [directions, setDirections] = useState("");
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const imageRef = useRef(null);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const { username } = useParams();

	const handleTitleChange = (e) => {
		const inputTitle = e.target.value;
		setPostTitle(inputTitle);
	};

	const handleTextChange = (value) => {
		const textLength = value.replace(/<[^>]+>/g, '').length;
		setPostText(value);
		setRemainingChar(MAX_CHAR - textLength);
	};

	const handleRecipeOrigin = (e) => {
		const inputRecipeOrigin = e.target.value;
		setRecipeOrigin(inputRecipeOrigin);
	};

	const handleTags = (e) => {
		const inputTags = e.target.value;
		setTags(inputTags);
	};

	const handleCreatePost = async () => {
		setLoading(true);
		try {
			const cookingTime = `${cookingHours ? `${cookingHours} hours` : ''} ${cookingMinutes ? `${cookingMinutes} minutes` : ''}`.trim();
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					recipeTitle: postTitle,
					text: postText,
					cookingTime: cookingTime,
					recipeOrigin: recipeOrigin,
					img: imgUrl,
					tags: tags,
					ingredients: ingredients.split('\n').filter(item => item.trim() !== ""),
					directions: directions.split('\n').filter(item => item.trim() !== ""),
				}),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post created successfully", "success");
			if (username === user.username) {
				setPosts([data, ...posts]);
			}
			onClose();

			setPostTitle("");
			setPostText("");
			setRecipeOrigin("");
			setCookingHours("");
			setCookingMinutes("");
			setTags("");
			setImgUrl("");
			setIngredients("");
			setDirections("");
			setRemainingChar(MAX_CHAR);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button
				position={"fixed"}
				bottom={20}
				right={10}
				bg={useColorModeValue("green.100", "gray.700")}
				border="1px"
				borderColor={"green.400"}
				onClick={onOpen}
				_hover={{ bgGradient: 'linear(to-r, #5ED20A, #9CCC65)', opacity: 0.9 }}
				size={{ base: "sm", sm: "md" }}
				boxShadow="lg"
				borderRadius="full"
			>
				<AddIcon /> <Text px={2}>Create Recipe</Text>
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent bg={useColorModeValue("white", "gray.800")} borderRadius="md" boxShadow="lg">
					<ModalHeader borderBottom="1px" borderColor="gray.200" bgGradient="linear(to-r, green.200, green.300)">
						Create Recipe
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<VStack spacing={6} align="start" w="full">
							<FormControl>
								<FormLabel fontWeight="bold">Title</FormLabel>
								<Input
									placeholder="E.g: Chicken Nuggets..."
									onChange={handleTitleChange}
									value={postTitle}
									borderColor="gray.300"
									focusBorderColor="green.500"
									bg={useColorModeValue("white", "gray.700")}
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontWeight="bold">Recipe Description</FormLabel>
								<ReactQuill
									value={postText}
									onChange={handleTextChange}
									theme="snow"
									modules={{
										toolbar: [
											[{ header: "1" }, { header: "2" }, { font: [] }],
											[{ list: "ordered" }, { list: "bullet" }],
											["bold", "italic", "underline"],
											[{ color: [] }, { background: [] }],
											[{ align: [] }],
										],
									}}
								/>
								<Text fontSize="sm" fontWeight="bold" textAlign="right" mt={2} color="gray.500">
									{remainingChar}/{MAX_CHAR}
								</Text>
							</FormControl>

							<FormControl>
								<FormLabel fontWeight="bold">Cooking Time</FormLabel>
								<HStack spacing={4}>
									<Box>
										<FormLabel htmlFor="hours" fontSize="sm">Hours</FormLabel>
										<Select
											id="hours"
											placeholder="0"
											onChange={(e) => setCookingHours(e.target.value)}
											value={cookingHours}
											borderColor="gray.300"
											focusBorderColor="green.500"
											bg={useColorModeValue("white", "gray.700")}
										>
											{[...Array(11).keys()].map(num => (
												<option key={num} value={num}>{num}</option>
											))}
										</Select>
									</Box>
									<Box>
										<FormLabel htmlFor="minutes" fontSize="sm">Minutes</FormLabel>
										<Select
											id="minutes"
											placeholder="0"
											onChange={(e) => setCookingMinutes(e.target.value)}
											value={cookingMinutes}
											borderColor="gray.300"
											focusBorderColor="green.500"
											bg={useColorModeValue("white", "gray.700")}
										>
											{[...Array(60).keys()].map(num => (
												<option
													key={num}
													value={num}
													style={{ fontWeight: num % 5 === 0 ? 'bold' : 'normal', backgroundColor: num % 5 === 0 ? '#f0f0f0' : 'inherit' }}
												>
													{num}
												</option>
											))}
										</Select>


									</Box>
								</HStack>
							</FormControl>

							<HStack spacing={4} w="full">
								<FormControl>
									<FormLabel fontWeight="bold">Recipe Origin</FormLabel>
									<Input
										placeholder="E.g: Italy..."
										onChange={handleRecipeOrigin}
										value={recipeOrigin}
										borderColor="gray.300"
										focusBorderColor="green.500"
										maxW="180px"
										bg={useColorModeValue("white", "gray.700")}
									/>
								</FormControl>

								<FormControl>
									<FormLabel fontWeight="bold">Tags</FormLabel>
									<Input
										placeholder="E.g: Chicken, Desi, Spicy..."
										onChange={handleTags}
										value={tags}
										borderColor="gray.300"
										focusBorderColor="green.500"
										maxW="180px"
										bg={useColorModeValue("white", "gray.700")}
									/>
								</FormControl>
							</HStack>

							<FormControl>
								<FormLabel fontWeight="bold">Ingredients</FormLabel>
								<Textarea
									placeholder="Enter each ingredient on a new line"
									onChange={(e) => setIngredients(e.target.value)}
									value={ingredients}
									borderColor="gray.300"
									focusBorderColor="green.500"
									bg={useColorModeValue("white", "gray.700")}
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontWeight="bold">Directions</FormLabel>
								<Textarea
									placeholder="Enter each direction on a new line"
									onChange={(e) => setDirections(e.target.value)}
									value={directions}
									borderColor="gray.300"
									focusBorderColor="green.500"
									bg={useColorModeValue("white", "gray.700")}
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontWeight="bold">Upload Image</FormLabel>
								<Input
									type="file"
									hidden
									ref={imageRef}
									onChange={handleImageChange}
								/>
								<Button
									leftIcon={<BsFillImageFill />}
									onClick={() => imageRef.current.click()}
									borderColor="gray.300"
									variant="outline"
									colorScheme="green"
								>
									Upload Image
								</Button>
								{imgUrl && (
									<Flex mt={5} w={"full"} position={"relative"}>
										<Image src={imgUrl} alt="Selected img" borderRadius="md" />
										<CloseButton
											onClick={() => {
												setImgUrl("");
											}}
											bg={"gray.800"}
											position={"absolute"}
											top={2}
											right={2}
										/>
									</Flex>
								)}
							</FormControl>
						</VStack>
					</ModalBody>

					<ModalFooter borderTop="1px" borderColor="gray.200">
						<Button
							colorScheme="green"
							mr={3}
							onClick={handleCreatePost}
							isLoading={loading}
							variant="solid"
							borderRadius="full"
							px={6}
						>
							Post
						</Button>
						<Button onClick={onClose} variant="outline" borderRadius="full" px={6}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
