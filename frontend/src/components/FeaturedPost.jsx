import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { Timer, Trash2Icon, Utensils } from "lucide-react";

const FeaturedPost = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

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

  if (!user) return null;
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex
        flex={1}
        flexDirection={"column"}
        gap={2}
        shadow={"lg"}
        rounded={"lg"}
        p={6}
      >
        {post.img && (
          <Box p={6}>
            <Image
              src={post.img}
              w={"full"}
              h={32}
              objectFit={"cover"}
              mb={4}
              rounded={"lg"}
            />
          </Box>
        )}
        <Text my={3} fontSize={"2xl"} color={"black"}>
          {post.recipeTitle}
        </Text>

        <Flex gap={3} my={3}>
          <Utensils />

          <Text fontSize={"md"} color={"black"}>
            {post.recipeOrigin}
          </Text>
          <Timer />
          <Text fontSize={"md"} color={"black"}>
            {post.cookingTime}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export default FeaturedPost;
