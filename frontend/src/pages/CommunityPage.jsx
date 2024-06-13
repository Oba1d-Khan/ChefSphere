import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, List, ListItem, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const CommunityPage = () => {
    const user = useRecoilValue(userAtom);
    const [communities, setCommunities] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await axios.get('/api/communities/all');
                setCommunities(response.data);
            } catch (error) {
                console.error("Error fetching communities", error);
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
        } catch (error) {
            console.error("Error creating community", error);
        }
    };

    return (
        <Box>
            <Box mb={4} maxW="500px" bgColor={"gray.400"} p={4}>
                <Heading as="h2" size="md" mb={2}>Create a New Community</Heading>
                <form onSubmit={handleCreateCommunity}>
                    <FormControl mb={2}>
                        <FormLabel>Community Name</FormLabel>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl mb={2}>
                        <FormLabel>Description</FormLabel>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </FormControl>
                    <Button type="submit">Create</Button>
                </form>
            </Box>
            <Heading as="h1" mb={4}>Communities</Heading>
            <List spacing={3}>
                {communities.map(community => (
                    <ListItem key={community._id}>
                        <Link to={`/community/${community._id}`}>
                            {community.name}
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CommunityPage;
