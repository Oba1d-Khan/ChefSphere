// components/FollowersList.jsx

import { useEffect, useState } from "react";
import { Box, Avatar, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

const FollowersList = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`/api/users/followers/${userId}`);
        setFollowers(response.data);
      } catch (error) {
        console.error("Error fetching followers:", error);
        showToast("Error", "Error fetching followers", "error");
      }
    };
    fetchFollowers();
  }, [userId, showToast]);

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
