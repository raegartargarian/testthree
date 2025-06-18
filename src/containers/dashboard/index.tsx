import { appRoutes } from "@/shared/constants/routes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GlobalSelectors } from "../global/selectors";
import { ArrowIcon } from "./Arrow";
import { dashboardActions } from "./slice";

const Dashboard = () => {
  const nftData = useSelector(GlobalSelectors.data);
  const tokenCodes = useSelector(GlobalSelectors.tokens);
  console.log(nftData);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dashboardActions.fetchData());
  }, [dispatch]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] w-full bg-black overflow-hidden">
      {" "}
      {/* Blurry background elements */}
      <div className="absolute top-[70px] left-1/4 w-20 h-20 rounded-full bg-white opacity-20 blur-md"></div>
      <div className="absolute bottom-2/4 right-1/4 w-20 h-20 rounded-full bg-gray-100 opacity-20 blur-xl"></div>
      <div className="absolute top-1/4 right-1/4 w-12 h-12 rounded-full bg-gray-300 opacity-20 blur-xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-14 h-14 rounded-full bg-gray-300 opacity-20 blur-xl"></div>
      {/* Main content */}
      <div className="flex flex-col items-center z-10 w-full px-4">
        {/* Circle image */}
        <div className="w-80 h-80 rounded-full bg-green-300 mb-16"></div>

        {/* Text content */}
        <h1 className="text-white text-4xl md:text-5xl  mb-7 text-center font-light ">
          AI Models
        </h1>
        <p className="text-gray-125 text-lg mb-12 text-center font-extralight">
          A small description about the process goes here.
        </p>

        {/* Button */}
        <Link
          to={
            tokenCodes
              ? `${appRoutes.attachments.path}?token=${tokenCodes[0].name}`
              : ""
          }
          className="bg-green-300 text-gray-950 w-36 h-[35px] rounded-[8px] flex items-center hover:bg-green-400 transition duration-300 justify-evenly"
        >
          <p className="font-light  text-gray-950">Get started</p>
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
