import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, List, ListItem, FormControl, FormLabel, Input, Button, Textarea, Flex, Icon, Divider, Avatar, Spinner, useDisclosure, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Image, CloseButton, Tag, TagLabel } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios';
import { useRecoilValue, useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import Actions from "../components/Actions";
import useShowToast from '../hooks/useShowToast';
import Comment from "../components/Comment";
import usePreviewImg from '../hooks/usePreviewImg';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import parse from 'html-react-parser';
import { BsFillImageFill } from "react-icons/bs";
import { formatDistanceToNow } from 'date-fns';

const MAX_CHAR = 5000;

const CommunityDetails = () => {
    const { cid } = useParams();
    const user = useRecoilValue(userAtom);
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [newPost, setNewPost] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [recipeOrigin, setRecipeOrigin] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [tags, setTags] = useState('');
    const [reply, setReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [comment, setComment] = useState('');
    const [replyPostId, setReplyPostId] = useState(null);
    const [joinStatus, setJoinStatus] = useState(false);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const showToast = useShowToast();
    const commentsRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const response = await axios.get(`/api/communities/${cid}`);
                setCommunity(response.data);
                const postsResponse = await axios.get(`/api/communities/${cid}/posts`);
                setPosts(postsResponse.data);
                setJoinStatus(response.data.members.includes(user._id));
            } catch (error) {
                console.error("Error fetching community", error);
            }
        };

        fetchCommunity();
    }, [cid, user._id]);

    const handleAddPost = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/communities/${cid}/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postedBy: user._id,
                    recipeTitle: postTitle,
                    text: newPost,
                    cookingTime: cookingTime,
                    recipeOrigin: recipeOrigin,
                    img: imgUrl,
                    tags: tags,
                }),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post created successfully", "success");
            setPosts([data, ...posts]);
            onClose();
            setPostTitle("");
            setNewPost("");
            setRecipeOrigin("");
            setCookingTime("");
            setTags("");
            setImgUrl("");
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (postId) => {
        if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch(`/api/posts/reply/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: reply }),
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            const updatedPosts = posts.map((p) => {
                if (p._id === postId) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            showToast("Success", "Reply posted successfully", "success");
            setReply('');
            setReplyPostId(null);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsReplying(false);
        }
    };

    const handleLikeAndUnlike = async (postId) => {
        if (!user) return showToast("Error", "You must be logged in to like a post", "error");
        try {
            const res = await fetch("/api/posts/like/" + postId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            const updatedPosts = posts.map((p) => {
                if (p._id === postId) {
                    return p.likes.includes(user._id)
                        ? { ...p, likes: p.likes.filter((id) => id !== user._id) }
                        : { ...p, likes: [...p.likes, user._id] };
                }
                return p;
            });
            setPosts(updatedPosts);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const handleJoinCommunity = async () => {
        try {
            await axios.post(`/api/communities/join/${cid}`, {}, { withCredentials: true });
            setJoinStatus(true);
            setCommunity({ ...community, members: [...community.members, user._id] });
        } catch (error) {
            console.error("Error joining community", error);
        }
    };

    const setShowCommentInput = (postId) => {
        setReplyPostId(postId);
    };

    const handleTitleChange = (e) => {
        const inputTitle = e.target.value;
        setPostTitle(inputTitle);
    };

    const handleTextChange = (value) => {
        setNewPost(value);
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

    if (!community) {
        return <Flex justifyContent={"center"}><Spinner size={"xl"} /></Flex>;
    }

    return (
        <Box>
            <Flex py={"10"} gap={6}>
                <Flex w={"full"} alignItems={"center"} gap={4}>
                    <Avatar src={user.profilePic} size={"md"} />
                    <Flex flexDirection={"column"} gap={1}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user.username}
                        </Text>
                        <Text fontSize={"xs"} width={36} color={"gray.light"}>
                            {community.createdAt && formatDistanceToNow(new Date(community.createdAt))} ago
                        </Text>
                    </Flex>
                    <Text fontSize={"sm"} display={"flex"} gap={3}>
                        Members: {community.members.length}
                    </Text>
                    <Text fontSize={"sm"} display={"flex"} gap={3}>
                        Admin: {community.adminUsername}
                    </Text>
                </Flex>
            </Flex>

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
                            <Text fontSize="lg" fontWeight="bold" textAlign={"left"} m={"1"} py={2} color={"gray.800"}>
                                Title{" "}
                            </Text>
                            <Textarea placeholder="E.g: Chicken Nuggets..." onChange={handleTitleChange} value={postTitle} />

                            <Text fontSize="xs" fontWeight="bold" textAlign={"right"} m={"1"} py={2} color={"gray.800"}>
                                remaining
                            </Text>

                            <Text fontSize="lg" fontWeight="bold" textAlign={"left"} m={"1"} py={2} color={"gray.800"}>
                                Recipe Description
                            </Text>

                            <ReactQuill value={newPost} onChange={handleTextChange} theme="snow"
                                modules={{
                                    toolbar: [
                                        [{ header: "1" }, { header: "2" }, { font: [] }],
                                        [{ list: "ordered" }, { list: "bullet" }],
                                        ["bold", "italic", "underline"],
                                        [{ color: [] }, { background: [] }],
                                        [{ align: [] }],
                                        ["clean"],
                                    ],
                                }} />

                            <Text fontSize="xs" fontWeight="bold" textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Text fontSize="lg" fontWeight="bold" textAlign={"left"} m={"1"} py={2} color={"gray.800"}>
                                Cooking Time
                            </Text>
                            <Textarea placeholder="E.g: 18 minutes..." onChange={handleCookingTime} value={cookingTime} />

                            <Text fontSize="lg" fontWeight="bold" textAlign={"left"} m={"1"} py={2} color={"gray.800"}>
                                Recipe Origin
                            </Text>
                            <Textarea placeholder="E.g: Italy..." onChange={handleRecipeOrigin} value={recipeOrigin} />

                            <Text fontSize="lg" fontWeight="bold" textAlign={"left"} m={"1"} py={2} color={"gray.800"}>
                                Tags
                            </Text>
                            <Textarea placeholder="E.g: Chicken, Desi, Spicy..." onChange={handleTags} value={tags} />

                            <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
                            <BsFillImageFill style={{ marginLeft: "15px", marginTop: "15px", cursor: "pointer" }} size={26} onClick={() => imageRef.current.click()} />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt="Selected img" />
                                <CloseButton onClick={() => { setImgUrl(""); }} bg={"gray.800"} position={"absolute"} top={2} right={2} />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddPost} isLoading={isReplying}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Heading size="md" mt={4}>Posts</Heading>
            <List>
                {posts.map(post => (
                    <Box key={post._id} p={4} bg="gray.200" borderRadius="md" mt={2}>
                        <Flex alignItems="center" mb={2}>
                            <Avatar src={post.postedBy.profilePic} size="sm" />
                            <Flex direction="column" ml={2}>
                                <Text fontWeight="bold">{post.postedBy.username}</Text>
                                <Text fontSize="sm" color="gray.500">
                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                </Text>
                            </Flex>
                        </Flex>
                        <Text fontSize="xl" fontWeight="bold">{post.recipeTitle}</Text>
                        <Box className="ql-editor">{parse(post.text)}</Box>
                        {post.img && <Image src={post.img} alt="Post image" borderRadius="md" mt={2} />}
                        <Text mt={2}>Cooking Time: {post.cookingTime}</Text>
                        <Text>Recipe Origin: {post.recipeOrigin}</Text>
                        <Flex mt={2} gap={2} wrap="wrap">
                            {post.tags.split(',').map((tag, index) => (
                                <Tag key={index} size="md" variant="subtle" colorScheme="teal">
                                    <TagLabel>{tag}</TagLabel>
                                </Tag>
                            ))}
                        </Flex>
                        <Flex alignItems="center" gap={2} mt={2}>
                            <Button size="sm" colorScheme="teal" onClick={() => handleLikeAndUnlike(post._id)}>
                                Like ({post.likes.length})
                            </Button>
                            <Button size="sm" onClick={() => setShowCommentInput(post._id)} colorScheme="teal">Comment ({post.replies.length})</Button>
                        </Flex>
                        {replyPostId === post._id && (
                            <Flex flexDirection="column" mt={4} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                                <FormControl>
                                    <Input placeholder='Write a comment...' value={reply} onChange={(e) => setReply(e.target.value)} />
                                </FormControl>
                                <Flex mt={2} justifyContent="flex-end">
                                    <Button size="sm" colorScheme="whatsapp" isLoading={isReplying} onClick={() => handleReply(post._id)}>
                                        Post Comment
                                    </Button>
                                </Flex>
                            </Flex>
                        )}
                        {post.replies.map((reply) => (
                            <Comment key={reply._id} reply={reply} lastReply={reply._id === post.replies[post.replies.length - 1]._id} />
                        ))}
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default CommunityDetails;
