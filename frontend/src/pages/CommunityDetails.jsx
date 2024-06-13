import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text } from "@chakra-ui/react";
import axios from 'axios';

const CommunityDetails = () => {
    const { cid } = useParams();
    const [community, setCommunity] = useState(null);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const response = await axios.get(`/api/communities/${cid}`);
                setCommunity(response.data);
            } catch (error) {
                console.error("Error fetching community", error);
            }
        };

        fetchCommunity();
    }, [cid]);

    if (!community) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box>
            <Heading as="h1">{community.name}</Heading>
            <Text>{community.description}</Text>
        </Box>
    );
};

export default CommunityDetails;
