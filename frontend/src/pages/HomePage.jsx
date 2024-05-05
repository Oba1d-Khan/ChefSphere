import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import FeaturedPost from "../components/FeaturedPost";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
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

	return (

		<div>

			<div className="">
				<div className="container flex items-center py-12 mx-auto">
					<div className="w-1/2 pr-8">
						<h1 className="mb-4 text-4xl font-bold">Delicious Feast for Family</h1>
						<p className="mb-6 text-lg">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi provident itaque pariatur eaque ipsam suscipit. Soluta aliquam quaerat inventore fugit praesentium? Delectus, magni cum nostrum eos voluptatibus facilis esse harum libero consequuntur.</p>
						<button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">View Recipes</button>
					</div>
					<div className="w-1/2">
						<img src="/public/cover.jpg" alt="ChefSphere Image" className="w-full rounded-lg" />
					</div>
				</div>
			</div>

			<div className="max-w-lg px-6 py-4 mx-auto">
				<div className="flex items-center">
					<input type="text" className="w-full px-4 py-2 bg-gray-100 border rounded-md border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search..." />
					<button className="px-4 py-2 ml-2 font-bold text-white bg-black rounded hover:bg-gray-500 ">Search</button>
				</div>
			</div>

			<div className="flex items-center justify-between py-8">
				<h2 className="text-2xl font-semibold">Categories</h2>

				<button className="px-4 py-2 font-bold text-black bg-white rounded hover:bg-gray-200">View All Categories</button>
			</div>

			<div className="grid grid-cols-4 gap-4">
				<div className="text-center">
					<img src="/public/meat.png" alt="Category 1" className="w-16 h-16 mx-auto mb-2" />
					<p className="text-sm">Meat</p>
				</div>

				<div className="text-center">
					<img src="/public/vegetable.png" alt="Category 2" className="w-16 h-16 mx-auto mb-2" />
					<p className="text-sm">Vegan</p>
				</div>

				<div className="text-center">
					<img src="/public/chocolate-bar.png" alt="Category 3" className="w-16 h-16 mx-auto mb-2" />
					<p className="text-sm">Chocolate</p>
				</div>

				<div className="text-center">
					<img src="/public/cake-slice.png" alt="Category 4" className="w-16 h-16 mx-auto mb-2" />
					<p className="text-sm">Cake</p>
				</div>
			</div>

			<div className="container py-8 mx-auto">

				<div className="text-center">
					<h2 className="mb-4 text-3xl font-semibold">Simple and Tasty Recipes</h2>
					<p className="mb-8 text-lg">Discover delicious recipes that are easy to make and packed with flavor.</p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{

					}
				</div>
			</div>

			<div className="container py-8 mx-auto">

			

				<div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-4">

				

					{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

					{loading && (
						<div className="">
							<Spinner size='xl' />
						</div>
					)}

					{posts.map((post) => (
						<FeaturedPost key={post._id} post={post} postedBy={post.postedBy} />

					))}
				</div>


		
			</div>
			<footer className="mt-10 text-sm text-center text-gray-600">
				© 2024 ChefSphere. All rights reserved.
			</footer>
		</div>



	);
};

export default HomePage;
