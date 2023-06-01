import { Banner } from "../Components/Page/Common";
import { FoodItemList } from "../Components/Page/Home";

function Home() {
  return (
    <div>
      <Banner/>
      <div className="container p-2">
        <FoodItemList />
      </div>
    </div>
  );
}
export default Home;
