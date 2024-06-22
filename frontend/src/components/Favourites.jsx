import { useState, useEffect } from 'react';
import { Grid, GridItem, Collapse } from '@chakra-ui/react';
import RecipeCard from './RecipeCard';
import axios from 'axios';

const Favourites = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('/api/users/favorites');
                setRecipes(response.data.favorites);
            } catch (error) {
                console.error("Error fetching favorites:", error);
                setError('Error fetching favorites');
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFromFavorites = async (postId) => {
        try {
            await axios.delete(`/api/users/favorites/${postId}`);
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== postId));
        } catch (error) {
            console.error("Error removing from favorites:", error);
            setError('Error removing from favorites');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Collapse in={true}>
                <Grid
                    templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    gap={6}
                    justifyItems="center"
                >
                    {recipes.map(recipe => (
                        <GridItem key={recipe._id}>
                            <RecipeCard post={recipe} handleRemoveFromFavorites={handleRemoveFromFavorites} />
                        </GridItem>
                    ))}
                </Grid>
            </Collapse>
        </div>
    );
};

export default Favourites;
