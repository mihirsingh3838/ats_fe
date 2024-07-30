 
import React from "react";
import { FaHeart, FaHome, FaCamera, FaChartBar } from "react-icons/fa";
import HorizentalGraphItem from "./HorizentalGraphItem";
import { ImBriefcase } from "react-icons/im";
import { HiClipboardList } from "react-icons/hi";

const HorizentalGraph = () => {
  return (
    <>
      <div className="text-gray-400 font-normal mb-5 mx-2">Details</div>
      <div className="flex mb-3 md:mb-[25px]">
        <HorizentalGraphItem
          title="Holidays"
          value="16"
          color="bg-green-500"
          textColor="text-green-500"
          iconColor="bg-green-200"
          icon={<FaHeart />}
          width="100"
        />
        <HorizentalGraphItem
          title="Present"
          value="160"
          color="bg-gray-800"
          textColor="text-gray-800"
          iconColor="bg-blue-200"
          icon={<HiClipboardList />}
          width="100"
        />
      </div>
      <div className="flex">
        <HorizentalGraphItem
          title="Work Days"
          value="260"
          color="bg-gray-400"
          textColor="text-gray-800"
          iconColor="bg-gray-200"
          width="100"
          icon={<ImBriefcase />}
        />
        <HorizentalGraphItem
          title="Absent"
          value="4"
          color="bg-indigo-500"
          textColor="text-black-500"
          iconColor="bg-red-400"
          icon={<FaChartBar />}
          width="100"
        />
      </div>
    </>
  );
};

export default HorizentalGraph;
