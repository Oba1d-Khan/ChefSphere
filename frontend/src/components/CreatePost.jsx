import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
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

const MAX_CHAR = 5000;

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postTitle, setPostTitle] = useState("");
	const [postText, setPostText] = useState("");
	const [cookingTime, setCookingTime] = useState("");
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
		setPostText(value);
		setRemainingChar(MAX_CHAR - value.length);
	};

	const handleRecipeOrigin = (e) => {
		const inputRecipeOrigin = e.target.value;
		setRecipeOrigin(inputRecipeOrigin);
	};

	const handleCookingTime = (e) => {
		const inputCookingTime = e.target.value;
		setCookingTime(inputCookingTime);
	};

	const handleTags = (e) => {
		const inputTags = e.target.value;
		setTags(inputTags);
	};

	const handleCreatePost = async () => {
		setLoading(true);
		try {
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
			setCookingTime("");
			setTags("");
			setImgUrl("");
			setIngredients("");
			setDirections("");
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
			>
				<AddIcon /> <Text px={2} > Create Post</Text>
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Text
								fontSize="lg"
								fontWeight="bold"
								textAlign={"left"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								Title
							</Text>

							<Textarea
								placeholder="E.g: Chicken Nuggets..."
								onChange={handleTitleChange}
								value={postTitle}
							/>

							<Text
								fontSize="xs"
								fontWeight="bold"
								textAlign={"right"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								{remainingChar}/{MAX_CHAR}
							</Text>

							<Text
								fontSize="lg"
								fontWeight="bold"
								textAlign={"left"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								Recipe Description
							</Text>

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
										["clean"],
									],
								}}
							/>

							<Text
								fontSize="lg"
								fontWeight="bold"
								textAlign={"left"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								Cooking Time
							</Text>
							<Textarea
								placeholder="E.g: 18 minutes..."
								onChange={handleCookingTime}
								value={cookingTime}
							/>

							<Text
								fontSize="lg"
								fontWeight="bold"
								textAlign={"left"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								Recipe Origin
							</Text>
							<Textarea
								placeholder="E.g: Italy..."
								onChange={handleRecipeOrigin}
								value={recipeOrigin}
							/>

							<Text
								fontSize="lg"
								fontWeight="bold"
								textAlign={"left"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								Tags
							</Text>
							<Textarea
								placeholder="E.g: Chicken, Desi, Spicy..."
								onChange={handleTags}
								value={tags}
							/>

							<Text
								fontSize="lg"
								fontWeight="bold"
								textAlign={"left"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								Ingredients
							</Text>
							<Textarea
								placeholder="Enter each ingredient on a new line"
								onChange={(e) => setIngredients(e.target.value)}
								value={ingredients}
							/>

							<Text
								fontSize="lg"
								fontWeight="bold"
								textAlign={"left"}
								m={"1"}
								py={2}
								color={"gray.800"}
							>
								Directions
							</Text>
							<Textarea
								placeholder="Enter each direction on a new line"
								onChange={(e) => setDirections(e.target.value)}
								value={directions}
							/>

							<Input
								type="file"
								hidden
								ref={imageRef}
								onChange={handleImageChange}
							/>

							<BsFillImageFill
								style={{ marginLeft: "15px", marginTop: "15px", cursor: "pointer" }}
								size={26}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt="Selected img" />
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
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleCreatePost}
							isLoading={loading}
						>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
