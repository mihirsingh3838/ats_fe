import LineChart from "../components/Chart";
import HorizentalGraph from "../components/HorizentalGraph";
import Jumbotron from "../components/Jumbotron";
import Sidebar from "../components/SideBar";
import VerticalGraph from "../components/CalendarView";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <div className="home max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="md:flex">
        <Sidebar />
        <div className="md:mx-5 mx-1">
          <div className="md:flex">
            <div>
              <div className="md:w-[500px] lg:w-[750px] w-full mb-5">
                <Jumbotron />
                <LineChart />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-3 md:mb-[50px]">
                <HorizentalGraph />
              </div>
              <div>
                <VerticalGraph />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
