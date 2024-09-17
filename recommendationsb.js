// recommendations.js
import { calculateAmounts, calculateImpact, calculateEconomicImpact } from './calculations.js';
import { pestData } from './pestData.js';

const RecommendationCard = ({ title, description, impact, crops, treatments, economicImpact, type }) => {
  const card = document.createElement('div');
  card.className = "bg-white shadow p-4 mb-4";

  const typeEl = document.createElement('p');
  typeEl.className = "text-sm font-semibold text-gray-500 mb-2";
  typeEl.textContent = type.toUpperCase();
  card.appendChild(typeEl);

  const titleEl = document.createElement('h3');
  titleEl.className = "text-lg font-semibold mb-2";
  titleEl.textContent = title;
  card.appendChild(titleEl);

  const descEl = document.createElement('p');
  descEl.className = "text-gray-600 mb-2";
  descEl.textContent = description;
  card.appendChild(descEl);

  if (crops && crops.length > 0) {
    const cropsEl = document.createElement('ul');
    cropsEl.className = "list-disc pl-5 mb-2";
    crops.forEach(crop => {
      const li = document.createElement('li');
      li.textContent = `${crop.name}: ${crop.amount} ${crop.unit}`;
      cropsEl.appendChild(li);
    });
    card.appendChild(cropsEl);
  }

  if (treatments && treatments.length > 0) {
    const treatmentsEl = document.createElement('ul');
    treatmentsEl.className = "list-disc pl-5 mb-2";
    treatments.forEach(treatment => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${treatment.name}:</strong> ${treatment.description}`;
      treatmentsEl.appendChild(li);
    });
    card.appendChild(treatmentsEl);
  }

  if (impact) {
    const impactEl = document.createElement('div');
    impactEl.className = "flex justify-between items-center mt-4 mb-2";

    const impactTypes = [
      { key: 'yield', iconPath: '/resources/yield.svg', label: 'Yield' },
      { key: 'water', iconPath: '/resources/water.svg', label: 'Water' },
      { key: 'co2', iconPath: '/resources/co2.svg', label: 'CO₂' }
    ];

    impactTypes.forEach(type => {
      const impactItemEl = document.createElement('div');
      impactItemEl.className = "flex flex-col items-center";

      const iconEl = document.createElement('img');
      iconEl.src = type.iconPath;
      iconEl.alt = `${type.label} icon`;
      iconEl.className = `w-6 h-6 ${getImpactColorClass(impact[type.key])}`;
      impactItemEl.appendChild(iconEl);

      const valueEl = document.createElement('span');
      valueEl.className = "font-bold text-sm mt-1";
      valueEl.textContent = `${impact[type.key]}${type.key !== 'co2' ? '%' : ''}`;
      impactItemEl.appendChild(valueEl);

      const labelEl = document.createElement('span');
      labelEl.className = "text-xs text-gray-500";
      labelEl.textContent = type.label;
      impactItemEl.appendChild(labelEl);

      impactEl.appendChild(impactItemEl);
    });

    card.appendChild(impactEl);
  }

  if (economicImpact) {
    const economicImpactEl = document.createElement('div');
    economicImpactEl.className = "mt-4";
    economicImpactEl.innerHTML = `
      <h4 class="font-semibold mb-2">Economic Impact: $${economicImpact.totalBenefit.toLocaleString()}</h4>
      <p>Increased Revenue: $${economicImpact.yieldRevenue.toLocaleString()}</p>
      <p>Water Savings: $${economicImpact.waterSavings.toLocaleString()}</p>
      <p>Carbon Credits: $${economicImpact.carbonCredits.toLocaleString()}</p>
   
    `;
    card.appendChild(economicImpactEl);
  }

  return card;
};

const getImpactColorClass = (value) => {
  if (value >= 20) return 'text-green-500';
  if (value >= 10) return 'text-yellow-500';
  return 'text-red-500';
};

const generateSoilRecommendations = (crops) => {
  const soilRecommendations = [
    {
      title: "Apply Basalt Dust",
      description: "Improves soil health and sequesters carbon.",
      crops: [],
      type: "soil"
    },
    {
      title: "Add Biochar",
      description: "Enhances soil structure and water retention.",
      crops: [],
      type: "soil"
    },
    {
      title: "Inoculate with Mycorrhizal Fungi",
      description: "Increases nutrient uptake and plant resilience.",
      crops: [],
      type: "soil"
    }
  ];

  crops.forEach(crop => {
    const amounts = calculateAmounts(crop.name, crop.area);
    
    soilRecommendations.forEach((rec, index) => {
      const substrates = ['basalt', 'biochar', 'mycorrhizae'];
      const amount = amounts[substrates[index]];
      const unit = index === 2 ? "lbs" : "tons"; // mycorrhizae in lbs, others in tons
      
      rec.crops.push({ name: crop.name, amount, unit });
      
      const impact = calculateImpact(substrates[index], amount);
      rec.impact = impact;
      
      const economicImpact = calculateEconomicImpact(
        substrates[index],
        crop.name,
        crop.area,
        parseFloat(impact.yield),
        parseFloat(impact.water),
        impact.co2
      );
      rec.economicImpact = economicImpact;
    });
  });

  return soilRecommendations;
};

const generatePestRecommendations = (farmData) => {
  const pestRecommendations = [];
  
  farmData.pests.forEach(pest => {
    const pestInfo = pestData.find(p => p.name === pest);
    if (pestInfo) {
      pestRecommendations.push({
        title: `Manage ${pestInfo.name}`,
        description: pestInfo.description,
        treatments: pestInfo.treatments.map(treatment => ({
          name: treatment.name,
          description: treatment.description
        })),
        impact: calculateImpact('pest_management'),
        type: "pest"
      });
    }
  });

  return pestRecommendations;
};

const generateRecommendations = (farmData) => {
  const soilRecommendations = generateSoilRecommendations(farmData.crops);
  const pestRecommendations = generatePestRecommendations(farmData);
  
  const generalRecommendations = [
    {
      title: "Implement Drip Irrigation",
      description: "Improves water efficiency and crop yield.",
      impact: calculateImpact('drip_irrigation'),
      type: "general"
    },
    {
      title: "Introduce Cover Crops",
      description: "Between main crop rows to improve soil health and reduce erosion.",
      impact: calculateImpact('cover_crops'),
      type: "general"
    },
    {
      title: "Integrate Beneficial Insects",
      description: "Release ladybugs and lacewings to naturally control aphid populations.",
      impact: calculateImpact('beneficial_insects'),
      type: "general"
    }
  ];

  return [...soilRecommendations, ...pestRecommendations, ...generalRecommendations];
};

export { RecommendationCard, generateRecommendations };