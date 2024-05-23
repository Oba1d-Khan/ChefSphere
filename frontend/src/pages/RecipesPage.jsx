import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
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
    }
    return (
        <div>

            <div className="max-w-lg px-6 py-4 mx-auto">
                <form onSubmit={handleSearch} className="flex items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 border rounded-md border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search..."
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 ml-2 font-bold text-white bg-black rounded hover:bg-gray-500 "
                    >
                        Search
                    </button>
                    <button
                        onClick={clearSearch}
                        className="px-4 py-2 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                    >
                        Clear
                    </button>
                </form>
            </div>

            <div className="">
                {loading && searchQuery.length > 0 && searchedPosts.length === 0 && (
                    <div className="">
                        <Spinner size="xl" />
                    </div>

                )}

                {
                    !loading && searchedPosts.length === 0 && (
                        <div>
                            <h1>No results found</h1>
                        </div>
                    )
                }


                {searchedPosts.length > 0 && (
                    <div className="container py-8 mx-auto">
                        <h2 className="mb-4 text-3xl font-semibold">Searched Results</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {searchedPosts.map((post) => (
                                <FeaturedPost
                                    key={post._id}
                                    post={post}
                                    postedBy={post.postedBy}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="container py-8 mx-auto">
                <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-4">
                    {!loading && posts.length === 0 && (
                        <h1>Follow some users to see the feed</h1>
                    )}

                    {loading && (
                        <div className="">
                            <Spinner size="xl" />
                        </div>
                    )}

                    {posts.map((post) => (
                        <FeaturedPost key={post._id} post={post} postedBy={post.postedBy} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default HomePage;
