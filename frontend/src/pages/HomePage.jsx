import { Box, Container, Flex, Spinner, Heading, Text, Button, Grid, Image, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import FeaturedPost from "../components/FeaturedPost";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedPosts, setSearchedPosts] = useState([]);
	const [searchClicked, setSearchClicked] = useState(false);
	const showToast = useShowToast();

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!searchQuery) {
				setSearchedPosts([]);
				return;
			}

			const res = await fetch(`/api/posts/search?q=${searchQuery}`);
			const searchData = await res.json();
			console.log("search data from handle search", searchData);
			if (searchData.error) {
				showToast("Error", searchData.error, "error");
				return;
			}
			setSearchedPosts(searchData);
			setSearchClicked(true);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};

	const clearSearch = () => {
		setSearchQuery("");
		setSearchedPosts([]);
		setSearchClicked(false);
	};

	return (
		<Box>
			{/* Hero Section */}
			<Box bg="gray.800" color="white">
				<Container maxW="container.lg" py={12}>
					<Flex align="center">
						<Box w="50%" pr={8}>
							<Heading as="h1" size="2xl" mb={4}>
								Delicious Feast for Family
							</Heading>
							<Text fontSize="lg" mb={6}>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi
								provident itaque pariatur eaque ipsam suscipit. Soluta aliquam quaerat
								inventore fugit praesentium? Delectus, magni cum nostrum eos
								voluptatibus facilis esse harum libero consequuntur.
							</Text>
							<Button
								bg="blue.500"
								_hover={{ bg: "blue.700" }}
								color="white"
								fontWeight="bold"
								py={2}
								px={4}
								rounded="md"
							>
								View Recipes
							</Button>
						</Box>
						<Box w="50%">
							<Image src="/public/cover.jpg" alt="ChefSphere Image" w="full" borderRadius="lg" />
						</Box>
					</Flex>
				</Container>
			</Box>

			{/* Search Section */}
			<Box maxW="container.md" mx="auto" py={4}>
				<form onSubmit={handleSearch}>
					<Flex>
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							bg="gray.100"
							rounded="md"
							py={2}
							px={4}
							focusBorderColor="blue.500"
							placeholder="Search..."
							w="full"
						/>
						<Button
							onClick={handleSearch}
							bg="black"
							color="white"
							fontWeight="bold"
							py={2}
							px={4}
							ml={2}
							rounded="md"
							_hover={{ bg: "gray.500" }}
						>
							Search
						</Button>
						<Button
							onClick={clearSearch}
							bg="red.500"
							color="white"
							fontWeight="bold"
							py={2}
							px={4}
							ml={2}
							rounded="md"
							_hover={{ bg: "red.700" }}
						>
							Clear
						</Button>
					</Flex>
				</form>
			</Box>

			<Container maxW="container.lg" py={8}>
				{loading && searchQuery.length > 0 && searchedPosts.length === 0 && (
					<Flex justifyContent="center" py={8}>
						<Spinner size="xl" />
					</Flex>
				)}

				{!loading && searchClicked && searchedPosts.length === 0 && (
					<Heading as="h2" size="md" textAlign="center">
						No results found
					</Heading>
				)}

				{searchedPosts.length > 0 && (
					<Box>
						<Heading as="h2" size="lg" mb={4}>
							Searched Results
						</Heading>
						<Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
							{searchedPosts.map((post) => (
								<FeaturedPost key={post._id} post={post} postedBy={post.postedBy} />
							))}
						</Grid>
					</Box>
				)}

				{/* Categories Section */}
				<Box>
					<Flex align="center" justify="space-between" py={8}>
						<Text fontSize="2xl" fontWeight="semibold">
							Categories
						</Text>
						<Button bg="white" _hover={{ bg: "gray.200" }} color="black" fontWeight="bold" py={2} px={4} rounded="md">
							View All Categories
						</Button>
					</Flex>
					<Grid templateColumns="repeat(4, 1fr)" gap={4}>
						{[
							{ src: "/public/meat.png", label: "Meat" },
							{ src: "/public/vegetable.png", label: "Vegan" },
							{ src: "/public/chocolate-bar.png", label: "Chocolate" },
							{ src: "/public/cake-slice.png", label: "Cake" }
						].map((category) => (
							<Box textAlign="center" key={category.label}>
								<Image src={category.src} alt={category.label} w="16" h="16" mx="auto" mb={2} />
								<Text fontSize="sm">{category.label}</Text>
							</Box>
						))}
					</Grid>
				</Box>

				{/* Recipes Section */}
				<Box py={8}>
					<Heading as="h2" size="lg" textAlign="center" mb={8}>
						Simple and Tasty Recipes
					</Heading>
					{loading && posts.length === 0 && (
						<Flex justifyContent="center" py={8}>
							<Spinner size="xl" />
						</Flex>
					)}

					{!loading && posts.length === 0 && (
						<Heading as="h2" size="md" textAlign="center">
							Follow some users to see the feed
						</Heading>
					)}

					<Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={6}>
						{posts.map((post) => (
							<FeaturedPost key={post._id} post={post} postedBy={post.postedBy} />
						))}
					</Grid>
				</Box>
			</Container>

			{/* Footer */}
			<Box textAlign="center" color="gray.600" fontSize="sm" py={4}>
				© 2024 ChefSphere. All rights reserved.
			</Box>
		</Box>
	);
};

export default HomePage;
