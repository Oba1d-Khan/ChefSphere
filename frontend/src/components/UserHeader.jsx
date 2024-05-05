import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Button, useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  return (
    <>
      <div className="container mx-auto flex p-8 border-b border-b-slate-400 mb-10">
        <div className="">
          <div className="relative">

            <img
              className="w-screen h-60 object-cover "
              src="/public/cover.jpg"
              alt="Cover"
            />
            <div className="absolute bottom-0 transform translate-y-1/2 px-6 pb-6 flex items-end">
              <img
                className="h-44 w-44 rounded-full border-4 border-white object-cover "
                src={user.profilePic}
                alt="Profile picture"
              />


              <div className="ml-4">
                <h2 className="text-3xl font-semibold">{user.name}</h2>
                <p>@{user.username}</p>
              </div>
            </div>
          </div>

          <div className="mt-20 py-10">
            <p className="italic text-lg">{user.bio}</p>

            {currentUser?._id === user._id && (
              <Link as={RouterLink} to="/update">
				<button className="px-6 py-2 bg-green-400/80 mt-4 rounded-lg font-semibold">Update Profile</button>
              </Link>
            )}
          </div>

        </div>
      </div>

     
    </>
  );
};

export default UserHeader;
