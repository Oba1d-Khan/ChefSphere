import { useState, useEffect } from 'react';
import { Grid, GridItem, IconButton, Collapse } from '@chakra-ui/react';
import { BookMarked } from 'lucide-react';
import RecipeCard from './RecipeCard';
import axios from 'axios';
const Favourites = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const [showFavorites, setShowFavorites] = useState(false);

    const toggleFavorites = () => {
        setShowFavorites(!showFavorites);
    };

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
        <div>
            <h2>
                Your Favorite Recipes{' '}
                <IconButton
                    icon={<BookMarked />
                    }
                    aria-label="Toggle favorites"
                    onClick={toggleFavorites}
                />
            </h2>
            <Collapse in={showFavorites}>
                <Grid
                    templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
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
