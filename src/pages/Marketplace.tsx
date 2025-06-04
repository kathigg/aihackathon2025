// src/pages/Marketplace.tsx
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClassificationBanner from "@/components/layout/ClassificationBanner";

// Get user from localStorage
const storedUser = localStorage.getItem("user");
const mockUser = storedUser ? JSON.parse(storedUser) : null;

const user = JSON.parse(localStorage.getItem("user") || "{}");
user.karma_points = 50;
localStorage.setItem("user", JSON.stringify(user));

const demoDrones = [
  {
    id: 1,
    name: "Astro Legacy",
    brand: "Freefly",
    image: "/astro.png",
    weight_grams: 3492,
    size_category: "industrial",
    flight_time_minutes: 37,
    range_meters: 1995,
    camera_quality: "61MP Sony Alpha 7R IV",
    indoor_use: false,
    outdoor_use: true,
    price_usd: 22500.0,
    features:
      "Mapping payload, vibration-isolated gimbal, LTE modem (US-only), Herelink 1.1 RF",
  },
  {
    id: 2,
    name: "AeroScout Mini",
    brand: "DriftTech",
    image: "/miniscout.png",
    weight_grams: 450,
    size_category: "small",
    flight_time_minutes: 18,
    range_meters: 1200,
    camera_quality: "1080p",
    indoor_use: true,
    outdoor_use: true,
    price_usd: 399.99,
    features: "Stabilized gimbal, auto-hover, indoor navigation",
  },
  {
    id: 3,
    name: "Titan Surveyor Pro",
    brand: "Freefly Systems",
    image: "/titan.png",
    weight_grams: 2500,
    size_category: "large",
    flight_time_minutes: 45,
    range_meters: 8000,
    camera_quality: "5.2K",
    indoor_use: false,
    outdoor_use: true,
    price_usd: 1999.0,
    features: "Dual camera, terrain mapping, waypoint programming",
  },
  {
    id: 4,
    name: "DJI Mavic 3",
    brand: "Dronefly",
    image: "/dji.png",
    weight_grams: 200,
    size_category: "micro",
    flight_time_minutes: 20,
    range_meters: 300,
    camera_quality: "720p",
    indoor_use: false,
    outdoor_use: true,
    price_usd: 4509,
    features: "Gesture control, quick charge, safe indoor props",
  },
  {
    id: 5,
    name: "Falcon Eye X1",
    brand: "SkyWorks",
    image: "/falcon.png",
    weight_grams: 1200,
    size_category: "medium",
    flight_time_minutes: 30,
    range_meters: 5000,
    camera_quality: "4K",
    indoor_use: false,
    outdoor_use: true,
    price_usd: 899.99,
    features: "GPS, obstacle avoidance, auto-return",
  },
];

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Classification Banner */}
      <ClassificationBanner level="green" />

      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={mockUser} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          moderationCount={0}
        />

        {/* Main Marketplace Grid */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-120px)]">
          <h1 className="text-3xl font-bold mb-6">Drone Marketplace</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoDrones.map((drone) => (
              <div key={drone.id} className="bg-white rounded-lg shadow p-4">
                <img
                  src={drone.image}
                  alt={drone.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h2 className="text-xl font-semibold">{drone.name}</h2>
                <p className="text-sm text-muted-foreground">{drone.brand}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Camera: {drone.camera_quality}</p>
                  <p>Flight time: {drone.flight_time_minutes} min</p>
                  <p>Range: {drone.range_meters} m</p>
                  <p>Size: {drone.size_category}</p>
                  <p className="text-xs italic">{drone.features}</p>
                </div>
                <div className="mt-3">
                  <span className="text-lg font-bold text-blue-600 block mb-2">
                    ${drone.price_usd.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700">
                      Buy
                    </button>
                    <button
                      className="border border-blue-600 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-50"
                      onClick={() => alert("Contact Seller feature coming soon!")}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Marketplace;

