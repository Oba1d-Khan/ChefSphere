import React, { useState, useEffect } from 'react';
import { Flex, Icon, Box, useToast } from "@chakra-ui/react";
import { Star } from "lucide-react";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Rating = ({ postId, initialRating, initialReviewsCount }) => {
    const currentUser = useRecoilValue(userAtom);
    const toast = useToast();
    const showToast = useShowToast();
    const [rating, setRating] = useState(initialRating);
    const [reviewsCount, setReviewsCount] = useState(initialReviewsCount);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setRating(initialRating);
        setReviewsCount(initialReviewsCount);
    }, [initialRating, initialReviewsCount]);

    const handleRating = async (newRating) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/posts/rate`, {
                postId,
                rating: newRating,
            }, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });

            const data = res.data;

            if (data.error) {
                toast({
                    title: "Error",
                    description: data.error,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Success",
                    description: "Post rated successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                setRating(data.averageRating);
                setReviewsCount(data.ratings.length);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex alignItems="center">
            {Array(5).fill("").map((_, i) => (
                <Icon
                    as={Star}
                    key={i}
                    fill={i < Math.round(rating) ? "teal.300" : "gray.100"}
                    stroke={"teal.500"}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoading) {
                            handleRating(i + 1);
                        }
                    }}
                    cursor="pointer"
                />
            ))}
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
                ({reviewsCount})
            </Box>
        </Flex>
    );
};

export default Rating;
