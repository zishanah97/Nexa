import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Landingpage from "./components/Landingpage";
import TopChoices from "./components/TopChoices";
import Itinerary from "./components/Itinerary";
import DestinationDetailsPage from "./pages/DestinationDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landingpage />,
  },
  {
    path: "/home",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "top-choices",
        element: <TopChoices />,
      },
      {
        path: "itinerary",
        element: <Itinerary />,
      },
    ],
  },
  {
    path: "/destination",
    element: <DestinationDetailsPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;