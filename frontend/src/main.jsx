import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'

import Landingpage from './components/Landingpage.jsx'
import Home from './components/Home.jsx'
import TopChoices from './components/TopChoices.jsx'
import Itinerary from './components/Itinerary.jsx'
import MainLayout from './components/MainLayout.jsx'
import LoaderPage from './components/LoaderPage.jsx'

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store.js";
import Trending from './components/Trending.jsx'
// DO NOT import RouterProvider again or router from './router' here!

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landingpage />,
  },
  {
    path: "/loader",
    element: <LoaderPage />,
  },
  {
    path: "/home",
    element: <MainLayout />,
    children: [
      {
        index: true,
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
])

// Debug function to check persistence
const debugPersistence = () => {
  console.log('Checking localStorage for persisted data...');
  const keys = Object.keys(localStorage);
  const persistKeys = keys.filter(key => key.startsWith('persist:'));
  console.log('Persist keys found:', persistKeys);
  
  persistKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      console.log(`Data for ${key}:`, data);
    } catch (e) {
      console.log(`Error parsing ${key}:`, e);
    }
  });
};

// Check persistence on load
debugPersistence();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading your saved data...</p>
            </div>
          </div>
        } 
        persistor={persistor}
        onBeforeLift={() => {
          console.log('PersistGate: About to lift (rehydrate data)');
        }}
        onAfterLift={() => {
          console.log('PersistGate: Data rehydration complete');
          debugPersistence();
        }}
      >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
)
