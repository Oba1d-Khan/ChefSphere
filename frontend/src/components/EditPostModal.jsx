// EditPostModal.jsx
import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, Input, Textarea, useToast } from "@chakra-ui/react";

const EditPostModal = ({ post, onClose, onSave }) => {
    const [title, setTitle] = useState(post.recipeTitle);
    const [text, setText] = useState(post.text);
    const [cookingTime, setCookingTime] = useState(post.cookingTime);
    const [recipeOrigin, setRecipeOrigin] = useState(post.recipeOrigin);
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeTitle: title,
                    text,
                    cookingTime,
                    recipeOrigin,
                }),
            });
            const updatedPost = await res.json();
            if (updatedPost.error) {
                toast({
                    title: "Error",
                    description: updatedPost.error,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                onSave(updatedPost);
                toast({
                    title: "Post updated",
                    description: "Your post has been updated successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Post</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <Input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <Textarea
                            placeholder="Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <Input
                            placeholder="Cooking Time"
                            value={cookingTime}
                            onChange={(e) => setCookingTime(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <Input
                            placeholder="Recipe Origin"
                            value={recipeOrigin}
                            onChange={(e) => setRecipeOrigin(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSave}
                        isLoading={isSaving}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditPostModal;
