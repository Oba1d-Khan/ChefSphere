import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text, IconButton, Menu, MenuButton, MenuItem, MenuList, Button, Input, Textarea } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { Trash2Icon, EditIcon, MoreVertical } from "lucide-react";
import parse from "html-react-parser";

const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const navigate = useNavigate();
	const [editingPost, setEditingPost] = useState(false);
	const [editedPost, setEditedPost] = useState({
		recipeTitle: post.recipeTitle,
		text: post.text,
		recipeOrigin: post.recipeOrigin,
		cookingTime: post.cookingTime,
		tags: post.tags,
	});

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		try {
			e.preventDefault();
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handleEditPost = () => {
		setEditingPost(true);
	};

	const handleSavePost = async () => {
		try {
			const res = await fetch(`/api/posts/${post._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editedPost),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			const updatedPosts = posts.map((p) => (p._id === post._id ? data : p));
			setPosts(updatedPosts);
			showToast("Success", "Post updated", "success");
			setEditingPost(false);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handleChange = (e) => {
		setEditedPost({
			...editedPost,
			[e.target.name]: e.target.value,
		});
	};

	const handleLinkClick = (e) => {
		if (e.target.closest(".menu-button")) {
			e.preventDefault();
		}
	};

	if (!user) return null;

	return (
		<Flex gap={3} mb={4} py={5}>
			<Flex flexDirection={"column"} alignItems={"center"}>
				<Avatar
					size='md'
					name={user.name}
					src={user?.profilePic}
					onClick={(e) => {
						e.preventDefault();
						navigate(`/${user.username}`);
					}}
				/>
			</Flex>
			<Flex flex={1} flexDirection={"column"} gap={2}>
				<Flex justifyContent={"space-between"} w={"full"}>
					<Flex w={"full"} alignItems={"center"}>
						<Text
							fontSize={"sm"}
							fontWeight={"bold"}
							onClick={(e) => {
								e.preventDefault();
								navigate(`/${user.username}`);
							}}
						>
							{user?.username}
						</Text>
					</Flex>
					<Flex gap={4} alignItems={"center"}>
						<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
							{formatDistanceToNow(new Date(post.createdAt))} ago
						</Text>

						{currentUser?._id === user._id && (
							<Menu>
								<MenuButton
									as={IconButton}
									aria-label="Options"
									icon={<MoreVertical />}
									variant="outline"
									onClick={(e) => e.stopPropagation()}
									className="menu-button"
								/>
								<MenuList onClick={(e) => e.stopPropagation()}>
									<MenuItem icon={<EditIcon />} onClick={handleEditPost}>Edit Post</MenuItem>
									<MenuItem icon={<Trash2Icon />} onClick={handleDeletePost}>Delete Post</MenuItem>
								</MenuList>
							</Menu>
						)}
					</Flex>
				</Flex>

				{editingPost ? (
					<Flex flexDirection={"column"} gap={3} my={3}>
						<Input
							name="recipeTitle"
							value={editedPost.recipeTitle}
							onChange={handleChange}
							placeholder="Recipe Title"
						/>
						<Textarea
							name="text"
							value={editedPost.text}
							onChange={handleChange}
							placeholder="Recipe Description"
						/>
						<Input
							name="recipeOrigin"
							value={editedPost.recipeOrigin}
							onChange={handleChange}
							placeholder="Recipe Origin"
						/>
						<Input
							name="cookingTime"
							value={editedPost.cookingTime}
							onChange={handleChange}
							placeholder="Cooking Time"
						/>
						<Input
							name="tags"
							value={editedPost.tags}
							onChange={handleChange}
							placeholder="Tags"
						/>
						<Flex gap={2} justifyContent={"flex-end"}>
							<Button onClick={() => setEditingPost(false)}>Cancel</Button>
							<Button onClick={handleSavePost} colorScheme="blue">Save</Button>
						</Flex>
					</Flex>
				) : (
					<>
						<Link to={`/${user.username}/post/${post._id}`}>
							<Text my={3} fontSize={"2xl"} color={"black"}>{post.recipeTitle}</Text>

							<Flex gap={3} my={1}>
								<Flex gap={3}>
									<Actions post={post} />
								</Flex>
								{post.img && (
									<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
										<Image src={post.img} w={"full"} minHeight={"xl"} />
									</Box>
								)}
							</Flex>

							<Flex gap={3} my={3} flexDirection={"column"}>
								<Box fontSize={"md"}>{parse(post.text)}</Box>
								<Text fontSize={"md"}>{post.recipeOrigin}</Text>
								<Text fontSize={"md"}>{post.cookingTime}</Text>
							</Flex>
							<Text fontSize={"md"}>{post.tags}</Text>

							{post.replies.length === 0 && <Text textAlign={"center"} color={"gray.light"} fontSize={"xs"}>no comments yet</Text>}
						</Link>
					</>

				)}

			</Flex>
		</Flex>
	);
};

export default Post;
