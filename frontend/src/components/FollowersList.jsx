import { useEffect, useState } from "react";
import { Box, Button, Avatar, Stack, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

const FollowersList = () => {
    const [user] = useRecoilState(userAtom);
    const [followers, setFollowers] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`/api/users/followers/${user._id}`);
                setFollowers(response.data);
            } catch (error) {
                console.error("Error fetching followers:", error);
                showToast("Error", "Error fetching followers", "error");
            }
        };
        if (user?._id) {
            fetchFollowers();
        }
    }, [user, showToast]);

    const toggleFollow = async (userId) => {
        try {
            const response = await axios.post(`/api/users/follow/${userId}`);
            setFollowers((prev) =>
                prev.map((follower) =>
                    follower._id === userId ? { ...follower, isFollowing: !follower.isFollowing } : follower
                )
            );
            showToast("Success", response.data.message, "success");
        } catch (error) {
            console.error("Error toggling follow state:", error);
            showToast("Error", "Error toggling follow state", "error");
        }
    };

    return (
        <Box>
            {followers.map((follower) => (
                <Stack key={follower._id} direction="row" spacing={4} align="center" mb={4}>
                    <Avatar size="md" src={follower.profilePic} />
                    <Box>
                        <Text fontWeight="bold">{follower.name}</Text>
                        <Text fontSize="sm" color="gray.500">@{follower.username}</Text>
                    </Box>

                </Stack>
            ))}
        </Box>
    );
};

export default FollowersList;
