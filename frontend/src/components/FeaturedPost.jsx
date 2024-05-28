// src/components/FeaturedPost.jsx
import { useEffect, useState } from "react";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { Timer, Utensils } from "lucide-react";
import { Icon, useColorModeValue, Button } from "@chakra-ui/react";
import axios from "axios";

const FeaturedPost = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);

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

  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/users/favorites/${post._id}`);
      showToast("Success", "Recipe added to favorites", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleRemoveFromFavorites = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/users/favorites/${post._id}`);
      showToast("Success", "Recipe removed from favorites", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

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
        <Flex gap={3} mt={3} flexDirection={'column'}>
          <Button colorScheme="blue" onClick={handleAddToFavorites}>
            Add to Favorites
          </Button>
          <Button colorScheme="red" onClick={handleRemoveFromFavorites}>
            Remove from Favorites
          </Button>
          <Button colorScheme="red" onClick={handleDeletePost}>
            Delete Post
          </Button>
        </Flex>
      </Flex>
    </Link>
  );
};

export default FeaturedPost;
