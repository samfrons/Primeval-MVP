import React from 'react';
import { RecommendationCard } from './recommendations.js'; // Adjust path if needed

const Sandbox = () => {
  // Sample data for the RecommendationCard
  const sampleRecommendation = {
    title: "Sample Recommendation",
    description: "This is a sample recommendation to demonstrate the card component.",
    impact: {
      yield: "+10%",
      water: "-5%",
      co2: "0.5 tons"
    },
    crops: [
      { name: "Tomatoes", amount: 5, unit: "tons" },
      { name: "Strawberries", amount: 2, unit: "tons" }
    ],
    treatments: [
      { name: "Treatment 1", description: "Description of treatment 1." },
      { name: "Treatment 2", description: "Description of treatment 2." }
    ]
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-6">Sandbox</h1>
      <p className="mb-4">Experiment with the RecommendationCard component here:</p>

      {/* Render the RecommendationCard with sample data */}
      <RecommendationCard {...sampleRecommendation} /> 
    </div>
  );
};

export default Sandbox;