import { useEffect, useState } from 'react';
import axios from 'axios';
import FeaturedPost from './FeaturedPost';

const Favorites = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}/favorites`);
                setFavorites(response.data.favorites);
            } catch (error) {
                console.error('Error fetching favorites', error);
            }
        };

        fetchFavorites();
    }, [userId]);

    return (
        <div>
            <h2>Your Favorite Recipes</h2>
            <div className="recipe-list">
                {favorites.map(recipe => (
                    <FeaturedPost key={recipe._id} post={recipe} postedBy={recipe.postedBy} />
                ))}
            </div>
        </div>
    );
};

export default Favorites;
