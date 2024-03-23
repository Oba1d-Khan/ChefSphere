const UserProfile = ({ params }: any) => {

    return (
        <div className="h-screen flex justify-center items-center border border-gray-500 text-2xl">

            <h1 className="">Welcome!
                <span className="capitalize p-2 ">{params.user_id} </span>
            </h1>

        </div>
    );
}

export default UserProfile;