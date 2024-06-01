import { useEffect, useState } from "react";
import { Box, Button, Avatar, Stack, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

const FollowingList = () => {
    const [user] = useRecoilState(userAtom);
    const [following, setFollowing] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`/api/users/following/${user._id}`);
                setFollowing(response.data);
            } catch (error) {
                console.error("Error fetching following:", error);
                showToast("Error", "Error fetching following", "error");
            }
        };
        if (user?._id) {
            fetchFollowing();
        }
    }, [user, showToast]);

    const toggleFollow = async (userId) => {
        try {
            const response = await axios.post(`/api/users/follow/${userId}`);
            setFollowing((prev) =>
                prev.filter((followed) => followed._id !== userId)
            );
            showToast("Success", response.data.message, "success");
        } catch (error) {
            console.error("Error toggling follow state:", error);
            showToast("Error", "Error toggling follow state", "error");
        }
    };

    return (
        <Box>
            {following.map((followed) => (
                <Stack key={followed._id} direction="row" spacing={4} align="center" mb={4}>
                    <Avatar size="md" src={followed.profilePic} />
                    <Box>
                        <Text fontWeight="bold">{followed.name}</Text>
                        <Text fontSize="sm" color="gray.500">@{followed.username}</Text>
                    </Box>
                    <Button
                        size="sm"
                        onClick={() => toggleFollow(followed._id)}
                    >
                        Unfollow
                    </Button>
                </Stack>
            ))}
        </Box>
    );
};

export default FollowingList;
