
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EditAllergens: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [food, setFood] = useState<any>(null);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [selectedAllergen, setSelectedAllergen] = useState<string>("");
  const [allAllergens, setAllAllergens] = useState<any[]>([]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/Food/${id}`);
        const data = await response.json();
        setFood(data);
        setAllergens(data.allergenNames);
      } catch (error) {
        console.error("Error occurred while fetching food:", error);
      }
    };

    const fetchAllAllergens = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/Allergen/GetAllAllergens"
        );
        const data = await response.json();
        setAllAllergens(data.data);
      } catch (error) {
        console.error("Error occurred while fetching allergens:", error);
      }
    };

    fetchFood();
    fetchAllAllergens();
  }, [id]);

  const handleAddAllergen = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/Food/AddAllergenToFood/${id}/allergen/${selectedAllergen}`,
        { method: "POST" }
      );
      const response = await fetch(`http://localhost:5000/api/Food/${id}`);
      const data = await response.json();
      setFood(data);
      setAllergens(data.allergenNames);
      setSelectedAllergen("");
      toast.success("Alergen adaugat cu succes!");
    } catch (error) {
      console.error("Error occurred while adding allergen to food:", error);
    }
  };

  const handleDeleteAllergen = async (allergenId: number) => {
    try {
      await fetch(
        `http://localhost:5000/api/Food/DeleteAllergenFromFood/${id}/allergens/${allergenId}`,
        { method: "DELETE" }
      );
      const response = await fetch(`http://localhost:5000/api/Food/${id}`);
      const data = await response.json();
      setFood(data);
      setAllergens(data.allergenNames);
      toast.error("Alergen eliminat cu succes!");
    } catch (error) {
      console.error("Error occurred while deleting allergen from food:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container border mt-5 p-5 bg-light">
      {food ? (
        <>
          <h3 className="px-2 text-success">Editează alergenii</h3>
          <br />
          <div>
            <h5>Nume aliment: {food.name}</h5>
            <h5>Listă alergeni:</h5>
            <ul className="allergen-list">
              {allergens.map((allergen) => (
                <li key={allergen} className="allergen-item">
                  <span>{allergen}</span>
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteAllergen(
                        allAllergens.find((a) => a.name === allergen)?.id || 0
                      )
                    }
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <select
              value={selectedAllergen}
              onChange={(e) => setSelectedAllergen(e.target.value)}
              className="allergen-select"
            >
              <option value="">Selectează alergeni</option>
              {allAllergens.map((allergen) => (
                <option key={allergen.id} value={allergen.id}>
                  {allergen.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddAllergen} className="add-button">
              Salvează
            </button>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
      <button
        className="btn btn-warning"
        onClick={() => navigate("/menuItem/menuitemlist")}
      >
        Inapoi
      </button>
      <ToastContainer />
    </div>
  );
};

export default EditAllergens;
