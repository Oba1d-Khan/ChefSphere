import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, List, ListItem, FormControl, FormLabel, Input, Button, Text, InputGroup, InputRightElement, Flex, Avatar, Spinner, useColorModeValue, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from "@chakra-ui/react";
import { SearchIcon, AddIcon, CheckIcon } from "@chakra-ui/icons";
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { formatDistanceToNow } from 'date-fns';

const CommunityPage = () => {
    const user = useRecoilValue(userAtom);
    const [communities, setCommunities] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await axios.get('/api/communities/all');
                setCommunities(response.data);
            } catch (error) {
                console.error("Error fetching communities", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    const handleCreateCommunity = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/communities/create',
                { name, description },
                { withCredentials: true }
            );
            setCommunities([...communities, response.data]);
            setName('');
            setDescription('');
            toast({
                title: "Community created.",
                description: "Your community has been created successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: "Unable to create community.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating community", error);
        }
    };

    const handleJoinCommunity = async (communityId) => {
        setJoining((prev) => ({ ...prev, [communityId]: true }));
        try {
            await axios.post(`/api/communities/join/${communityId}`, {}, { withCredentials: true });
            setCommunities((prevCommunities) =>
                prevCommunities.map((community) =>
                    community._id === communityId
                        ? { ...community, members: [...community.members, user._id] }
                        : community
                )
            );
            toast({
                title: "Joined community.",
                description: "You have successfully joined the community.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: "Unable to join community.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error joining community", error);
        } finally {
            setJoining((prev) => ({ ...prev, [communityId]: false }));
        }
    };

    const filteredCommunities = communities.filter(community =>
        community.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box p={4}>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Heading as="h1">Communities</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>Add Community</Button>
            </Flex>
            <Box mb={4}>
                <InputGroup>
                    <Input
                        placeholder="Search communities"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <InputRightElement>
                        <IconButton icon={<SearchIcon />} onClick={() => setSearch('')} size="sm" />
                    </InputRightElement>
                </InputGroup>
            </Box>
            {loading ? (
                <Flex justify="center" align="center" h="200px">
                    <Spinner size="xl" />
                </Flex>
            ) : (
                <List spacing={4}>
                    {filteredCommunities.map(community => (
                        <ListItem key={community._id} p={4} bg={useColorModeValue("gray.100", "gray.800")} borderRadius="md" shadow="sm">
                            <Flex alignItems="center" justify="space-between">
                                <Flex alignItems="center">
                                    <Avatar name={community.name} mr={4} />
                                    <Box>
                                        <Link to={`/community/${community._id}`}>
                                            <Text fontSize="xl" fontWeight="bold">{community.name}</Text>
                                            <Text fontSize="md">{community.description}</Text>
                                            <Text fontSize="sm" color="gray.500">Members: {community.members.length}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Created {formatDistanceToNow(new Date(community.createdAt))} ago
                                            </Text>
                                        </Link>
                                    </Box>
                                </Flex>
                                <Button
                                    onClick={() => handleJoinCommunity(community._id)}
                                    size="sm"
                                    colorScheme="teal"
                                    isLoading={joining[community._id]}
                                    leftIcon={joining[community._id] ? null : <CheckIcon />}
                                >
                                    {joining[community._id] ? "Joining..." : "Join"}
                                </Button>
                            </Flex>
                        </ListItem>
                    ))}
                </List>
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg="blackAlpha.600" />
                <ModalContent>
                    <ModalHeader>Create a New Community</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleCreateCommunity}>
                            <FormControl mb={4}>
                                <FormLabel>Community Name</FormLabel>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Description</FormLabel>
                                <Input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </FormControl>
                            <Button type="submit" colorScheme="teal" width="full">Create</Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default CommunityPage;
