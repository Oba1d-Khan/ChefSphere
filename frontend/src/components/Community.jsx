import {
    Box,
    Button,
    Flex,
    Text,
} from "@chakra-ui/react";
import { useRecoilValue, useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import communityAtom from "../atoms/communityAtom";
import useShowToast from "../hooks/useShowToast";

const Community = ({ community }) => {
    const user = useRecoilValue(userAtom);
    const [communities, setCommunities] = useRecoilState(communityAtom);
    const showToast = useShowToast();

    const handleJoinCommunity = async () => {
        try {
            const res = await fetch(`/api/communities/${community._id}/join`, {
                method: "POST",
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setCommunities(communities.map(c => c._id === community._id ? { ...c, members: [...c.members, user._id] } : c));
            showToast("Success", "Joined community successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const isMember = community.members.includes(user._id);

    return (
        <Flex justify="space-between" align="center" p={4} borderWidth={1} borderRadius="lg" mb={4}>
            <Box>
                <Text fontWeight="bold">{community.name}</Text>
                <Text fontSize="sm" color="gray.500">{community.members.length} members</Text>
            </Box>
            <Flex>
                {!isMember ? (
                    <Button size="sm" onClick={handleJoinCommunity} colorScheme="teal">
                        Join
                    </Button>
                ) : (
                    <Button size="sm" as={Link} to={`/community/${community._id}`} colorScheme="teal">
                        View
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

export default Community;
