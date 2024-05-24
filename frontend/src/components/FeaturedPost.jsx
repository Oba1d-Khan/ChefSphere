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
import { Icon, useColorModeValue } from "@chakra-ui/react";

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
        gap={4}
        shadow={"lg"}
        rounded={"lg"}
        p={6}
        _hover={{ shadow: "xl" }}
        transition="all 0.3s"
        bg="white"
      >
        {post.img && (
          <Box w="full" h={{ base: 48, md: 64 }} overflow="hidden" rounded="lg">
            <Image
              src={post.img}
              w="full"
              h="full"
              objectFit="cover"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            />
          </Box>
        )}
        <Text
          my={3}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color={useColorModeValue("black", "white")}
        >
          {post.recipeTitle}
        </Text>
        <Flex
          gap={3}
          my={3}
          alignItems="center"
          flexWrap="wrap"
          color={useColorModeValue("gray.600", "gray.300")}
        >
          <Flex alignItems="center">
            <Icon as={Utensils} w={5} h={5} mr={1} />
            <Text fontSize="md">{post.recipeOrigin}</Text>
          </Flex>
          <Flex alignItems="center">
            <Icon as={Timer} w={5} h={5} mr={1} />
            <Text fontSize="md">{post.cookingTime}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default FeaturedPost;
