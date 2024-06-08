import { useState, useEffect } from 'react';
import { Grid, GridItem, Collapse } from '@chakra-ui/react';
import RecipeCard from './RecipeCard';
import axios from 'axios';

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('/api/recipes');
                setRecipes(response.data.recipes);
            } catch (error) {
                console.error("Error fetching recipes:", error);
                setError('Error fetching recipes');
            }
        };

        fetchRecipes();
    }, []);

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
                            <RecipeCard post={recipe} postedBy={recipe.postedBy} isFavorite={recipe.isFavorite} />
                        </GridItem>
                    ))}
                </Grid>
            </Collapse>
        </div>
    );
};

export default HomePage;
