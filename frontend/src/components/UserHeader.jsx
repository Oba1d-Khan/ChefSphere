import { Link } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { Tab, TabList, TabPanel, TabPanels, Tabs, Box } from "@chakra-ui/react";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingsList";
import Favourites from "../components/Favourites";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom); // logged in user

  return (
    <>
      <div className="container flex flex-col p-8 mx-auto mb-10 border-b border-b-slate-400">
        <div className="relative">
          <img
            className="object-cover w-screen h-60"
            src="/public/cover.jpg"
            alt="Cover"
          />
          <div className="absolute bottom-0 flex items-end px-6 pb-6 transform translate-y-1/2">
            <img
              className="object-cover border-4 border-white rounded-full h-44 w-44"
              src={user.profilePic}
              alt="Profile picture"
            />
            <div className="ml-4">
              <h2 className="text-3xl font-semibold">{user.name}</h2>
              <p>@{user.username}</p>
            </div>
          </div>
        </div>

        <div className="py-10 mt-20">
          <p className="text-lg italic">{user.bio}</p>

          {currentUser?._id === user._id && (
            <Link as={RouterLink} to="/update">
              <button className="px-6 py-2 mt-4 font-semibold border border-green-500 rounded-lg bg-green-300/80">
                Update Profile
              </button>
            </Link>
          )}
        </div>

      </div>
      <Box mb={20}>
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>Followers</Tab>
            <Tab>Following</Tab>
            <Tab>Favorites</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <FollowersList />
            </TabPanel>
            <TabPanel>
              <FollowingList />
            </TabPanel>
            <TabPanel>
              <Favourites userId={user._id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default UserHeader;
