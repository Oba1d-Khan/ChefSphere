import { useState, useEffect } from 'react';
import { Grid, GridItem, Collapse } from '@chakra-ui/react';
import RecipeCard from './RecipeCard';
import axios from 'axios';

const Favourites = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`/api/users/favorites/${userId}`);
                setFavorites(response.data.favorites);
            } catch (error) {
                console.error("Error fetching favorites:", error);
                setError('Error fetching favorites');
            }
        };

        fetchFavorites();
    }, [userId]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div >
            <Collapse in={true}>
                <Grid
                    templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    gap={6}
                    justifyItems="center"
                >
                    {favorites.map(recipe => (
                        <GridItem key={recipe._id}>
                            <RecipeCard post={recipe} postedBy={recipe.postedBy} />
                        </GridItem>
                    ))}
                </Grid>
            </Collapse>
        </div>
    );
};

export default Favourites;
