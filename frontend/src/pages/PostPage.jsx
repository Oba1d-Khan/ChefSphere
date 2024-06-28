import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    Heading,
    Icon,
    Image,
    Input,
    Spinner,
    Text,
    VStack,
    Checkbox,
    HStack,
    SimpleGrid,
} from "@chakra-ui/react";
import { Star, Users } from 'lucide-react';
import Actions from "../components/Actions";
import { useEffect, useRef, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { Dot, Timer, Trash2, Utensils } from "lucide-react";
import parse from "html-react-parser";
import { animateScroll as scroll } from "react-scroll";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";
import Rating from "../components/Rating";

const PostPage = () => {
    const { user, loading } = useGetUserProfile();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const { pid } = useParams();
    const currentUser = useRecoilValue(userAtom);
    const navigate = useNavigate();
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [reply, setReply] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const currentPost = posts[0];
    const commentsRef = useRef(null);
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const [checkedDirections, setCheckedDirections] = useState({});

    const handleIngredientCheck = (index) => {
        setCheckedIngredients((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handleDirectionCheck = (index) => {
        setCheckedDirections((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

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

    const handleReply = async () => {
        if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch(`/api/posts/reply/${currentPost._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: reply }),
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            const updatedPosts = posts.map((p) => {
                if (p._id === currentPost._id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            showToast("Success", "Reply posted successfully", "success");
            setReply("");
            setShowCommentInput(false);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsReplying(false);
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

    const scrollToComments = () => {
        scroll.scrollTo(commentsRef.current.offsetTop, {
            duration: 500,
            smooth: "easeInOutQuad",
        });
    };

    const postUrl = window.location.href;
    const postTitle = currentPost.recipeTitle;

    return (
        <>
            <Flex py={"10"} gap={6}>
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
                        <Timer />
                        {currentPost.cookingTime}
                    </Text>
                    <Dot />
                    <Text fontSize={"sm"} display={"flex"} gap={3}>
                        <Utensils />
                        {currentPost.recipeOrigin}
                    </Text>
                    <Dot />
                    <Text fontSize={"sm"} display={"flex"} gap={3}>
                        <Users />
                        {currentPost.servings}
                    </Text>

                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Flex gap={2}>
                        <FacebookShareButton url={postUrl} quote={postTitle}>
                            <FacebookIcon size={24} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={postUrl} title={postTitle}>
                            <TwitterIcon size={24} round />
                        </TwitterShareButton>
                        <WhatsappShareButton url={postUrl} title={postTitle} separator=":: ">
                            <WhatsappIcon size={24} round />
                        </WhatsappShareButton>
                    </Flex>
                    {currentUser?._id === user._id && (
                        <Trash2 size={20} cursor={"pointer"} onClick={handleDeletePost} />
                    )}
                </Flex>
            </Flex>

            <Flex gap={6}>
                <Flex gap={3} my={3} cursor={"pointer"}>
                    <Actions post={currentPost} setShowCommentInput={setShowCommentInput} scrollToComments={scrollToComments} />
                </Flex>
                {currentPost.img && (
                    <Box
                        mb={10}
                        maxWidth={"2xl"}
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
                <Box fontSize={"md"}>{parse(currentPost.text)}</Box>
                <Text fontSize={"md"} fontStyle={"italic"}>
                    {currentPost.tags}
                </Text>
            </Flex>

            <Flex justifyContent="flex-start" mt={5} gap={1}>
                <Rating
                    postId={currentPost._id}
                    initialRating={currentPost.averageRating}
                    initialReviewsCount={currentPost.ratings.length}
                    size={60} // Adjust the size as per your design needs
                />

            </Flex >

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={10}>
                <Box>
                    <Heading as="h3" size="md" mb={4}>
                        Ingredients
                    </Heading>
                    <VStack align="start" spacing={3}>
                        {currentPost.ingredients && currentPost.ingredients.map((ingredient, index) => (
                            <HStack key={index} onClick={() => handleIngredientCheck(index)} cursor="pointer">
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedIngredients[index]}
                                    onChange={() => handleIngredientCheck(index)}
                                />
                                <Text
                                    as={checkedIngredients[index] ? "del" : "span"}
                                    transition="all 0.3s ease-in-out"
                                >
                                    {ingredient}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>
                </Box>
                <Box>
                    <Heading as="h3" size="md" mb={4}>
                        Directions
                    </Heading>
                    <VStack align="start" spacing={4}>
                        {currentPost.directions && currentPost.directions.map((direction, index) => (
                            <HStack key={index} onClick={() => handleDirectionCheck(index)} cursor="pointer">
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedDirections[index]}
                                    onChange={() => handleDirectionCheck(index)}
                                />
                                <Text
                                    as={checkedDirections[index] ? "del" : "span"}
                                    transition="all 0.3s ease-in-out"
                                >
                                    {direction}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>
                </Box>
            </SimpleGrid>

            <Box mt={10}>
                <Heading as="h3" size="md" mb={4}>
                    Servings
                </Heading>
                <Text>{currentPost.servings}</Text>
            </Box>

            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }} py={4} ref={commentsRef}>
                Comments
            </Heading>
            <Divider my={4} />

            {showCommentInput && (
                <Flex flexDirection="column" mt={4} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                    <FormControl>
                        <Input
                            placeholder='Write a comment...'
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                    </FormControl>
                    <Flex mt={2} justifyContent="flex-end">
                        <Button size="sm" colorScheme="whatsapp" isLoading={isReplying} onClick={handleReply}>
                            Post Comment
                        </Button>
                    </Flex>
                </Flex>
            )}

            {currentPost.replies.map((reply) => (
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply={
                        reply._id === currentPost.replies[currentPost.replies.length - 1]._id
                    }
                />
            ))}
        </>
    );



};

export default PostPage;
