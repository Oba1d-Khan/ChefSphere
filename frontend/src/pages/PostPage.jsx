import {
	Avatar,
	Box,
	Divider,
	Flex,
	Heading,
	Image,
	Spinner,
	Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { Dot, Share, Timer, Trash2, Utensils } from "lucide-react";

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();

	const currentPost = posts[0];

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();

				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!currentPost) return null;
	console.log("currentPost", currentPost);

	return (
		<>
			<Flex py={"10"}>
				<Heading
					lineHeight={1.1}
					fontSize={{ base: "2xl", sm: "3xl" }}
				></Heading>

				{/* User name & img*/}
				<Flex w={"full"} alignItems={"center"} gap={4}>
					<Avatar src={user.profilePic} size={"md"} />
					<Flex flexDirection={"column"} gap={1}>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Text fontSize={"xs"} width={36} color={"gray.light"}>
							{formatDistanceToNow(new Date(currentPost.createdAt))} ago
						</Text>
					</Flex>

					<Text fontSize={"sm"} display={"flex"} gap={3}>
						{" "}
						<Timer />
						{currentPost.cookingTime}
					</Text>

					<Dot />

					<Text fontSize={"sm"} display={"flex"} gap={3}>
						{" "}
						<Utensils />
						{currentPost.recipeOrigin}
					</Text>
				</Flex>
				{/* ---- User name & img ---- */}

				<Flex gap={4} alignItems={"center"}>
					<Share size={21} />
					{currentUser?._id === user._id && (
						<Trash2 size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
				</Flex>
			</Flex>

			<Flex gap={6}>
				<Flex gap={3} my={3}>
					<Actions post={currentPost} />
				</Flex>
				{currentPost.img && (
					<Box
						mb={10}
						maxWidth={"lg"}
						borderRadius={6}
						overflow={"hidden"}
						border={"1px solid"}
						borderColor={"gray.light"}
					>
						<Image src={currentPost.img} w={"full"} />
					</Box>
				)}
			</Flex>

			<Flex gap={3} my={3} flexDirection={"column"}>
				<Text my={3} fontSize={"2xl"} color={"black"} fontWeight={"bold"}>
					{currentPost.recipeTitle}
				</Text>
				<Text fontSize={"md"}>{currentPost.text}</Text>
				<Text fontSize={"md"} fontStyle={"italic"}> {currentPost.tags} </Text>
			</Flex>



			<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }} py={4}>
				Comments
			</Heading>
			<Divider my={4} />

			{currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={
						reply._id ===
						currentPost.replies[currentPost.replies.length - 1]._id
					}
				/>
			))}
		</>
	);
};

export default PostPage;
