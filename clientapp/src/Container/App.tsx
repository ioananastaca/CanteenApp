import { Route, Routes } from "react-router-dom";
import { Header, Footer } from "../Components/Layout";
import { FoodItemDetails, Home, NotFound } from "../Pages";

function App() {
  return (
    <div className="text-success">
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/foodItemDetails/:foodItemId" element={<FoodItemDetails/>}></Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Routes>
      </div>
    
      <Footer />
    </div>
  );
}

export default App;
