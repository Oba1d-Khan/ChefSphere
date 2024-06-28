// UserPage.jsx
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner, Menu, MenuButton, MenuList, MenuItem, Button, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import CreatePost from "../components/CreatePost";
import EditPostModal from "../components/EditPostModal"; // Import the EditPostModal component

const UserPage = () => {
    const { user, loading } = useGetUserProfile();
    const { username } = useParams();
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);
    const currentUser = useRecoilValue(userAtom);
    const [editingPost, setEditingPost] = useState(null); // State to track the post being edited

    useEffect(() => {
        const getPosts = async () => {
            if (!user) return;
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };

        getPosts();
    }, [username, showToast, setPosts, user]);

    const handleEditPost = (post) => {
        setEditingPost(post);
    };

    const handleDeletePost = async (postId) => {
        try {
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post deleted", "success");
            setPosts(posts.filter(post => post._id !== postId));
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

    if (!user && !loading) return <h1>User not found</h1>;

    return (
        <>
            <UserHeader user={user} />
            {fetchingPosts && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
            <Flex gap='10' alignItems={"flex-start"}>
                <Box flex={70}>
                    {posts.map((post) => (
                        <Box key={post._id} mb={4}>
                            <Post post={post} postedBy={post.postedBy} />
                            {currentUser._id === post.postedBy._id && (
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label="Options"
                                        icon={<HamburgerIcon />}
                                        variant="outline"
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => handleEditPost(post)}>Edit Post</MenuItem>
                                        <MenuItem onClick={() => handleDeletePost(post._id)}>Delete Post</MenuItem>
                                    </MenuList>
                                </Menu>
                            )}
                        </Box>
                    ))}
                </Box>
                <Box
                    flex={30}
                    display={{
                        base: "none",
                        md: "block",
                    }}
                >
                    <SuggestedUsers />
                </Box>
                <CreatePost />
            </Flex>

            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    onClose={() => setEditingPost(null)}
                    onSave={(updatedPost) => {
                        setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
                        setEditingPost(null);
                    }}
                />
            )}
        </>
    );
};

export default UserPage;
