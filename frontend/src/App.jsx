import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import RecipesPage from "./pages/RecipesPage";
import CommunityPage from "./pages/CommunityPage";
import CommunityDetails from "./pages/CommunityDetails";

function App() {
	const user = useRecoilValue(userAtom);
	const { pathname } = useLocation();

	return (
		<Box position="relative" w="full" fontFamily="Poppins">
			<Container maxW={pathname === "/" ? { base: "1000px", md: "1200px" } : "1200px"}>
				<Header />
				<Routes>
					<Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
					<Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
					<Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
					<Route path="/:username" element={user ? <UserPage /> : <Navigate to="/auth" />} />
					<Route path="/:username/post/:pid" element={<PostPage />} />
					<Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
					<Route path="/recipes" element={user ? <RecipesPage /> : <Navigate to="/auth" />} />
					<Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
					<Route path="/community" element={user ? <CommunityPage /> : <Navigate to="/auth" />} />
					<Route path="/community/:cid" element={user ? <CommunityDetails /> : <Navigate to="/auth" />} />
				</Routes>
			</Container>
		</Box>
	);
}

export default App;
