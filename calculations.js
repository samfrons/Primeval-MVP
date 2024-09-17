// calculations.js

export const calculateAmounts = (cropType, acreage) => {
  let basalt, biochar, mycorrhizae;

  switch(cropType.toLowerCase()) {
    case 'tomatoes':
      basalt = acreage * 8.5;
      biochar = acreage * 1.5;
      mycorrhizae = acreage * 1.75;
      break;
    case 'strawberries':
      basalt = acreage * 6.5;
      biochar = acreage * 1.25;
      mycorrhizae = acreage * 1.25;
      break;
    case 'basil':
      basalt = acreage * 6;
      biochar = acreage * 0.75;
      mycorrhizae = acreage * 1.1;
      break;
    default:
      basalt = acreage * 7.5;
      biochar = acreage * 1.25;
      mycorrhizae = acreage * 1.5;
  }

  return {
    basalt: Math.round(basalt * 10) / 10,
    biochar: Math.round(biochar * 10) / 10,
    mycorrhizae: Math.round(mycorrhizae * 10) / 10
  };
};

export const calculateImpact = (recommendationType, totalAmount) => {
  switch (recommendationType) {
    case 'basalt':
      return {
        yield: "+10",
        water: "5",
        co2: `${Math.round(totalAmount * 0.25)} tons`
      };
    case 'biochar':
      return {
        yield: "+7",
        water: "10",
        co2: `${Math.round(totalAmount * 3)} tons`
      };
    case 'mycorrhizae':
      return {
        yield: "+5",
        water: "3",
        co2: `${Math.round(totalAmount * 0.1 / 2000)} tons`
      };
    case 'drip_irrigation':
      return {
        yield: "+15",
        water: "30",
        co2: "0.5 tons/acre"
      };
    case 'cover_crops':
      return {
        yield: "+5",
        water: "10",
        co2: "1 ton/acre"
      };
    case 'beneficial_insects':
      return {
        yield: "+8",
        water: "0",
        co2: "0.1 tons/acre"
      };
    default:
      return {
        yield: "Varies",
        water: "Minimal",
        co2: "Indirect"
      };
  }
};




export const calculateEconomicImpact = (recommendationType, cropType, acreage, yieldPercentage, waterSavingsPercentage, co2Amount) => {
  // Assumptions (these could be made configurable in the future)
  const cropPricePerTon = 80; // $80 per ton
  const baseYieldPerAcre = 35; // 35 tons per acre
  const waterCostPerAcreFoot = 1000; // $1000 per acre-foot
  const waterUsagePerAcre = 3; // 3 acre-feet per acre
  const carbonCreditPricePerTon = 100; // $100 per ton of CO2

  const yieldIncrease = baseYieldPerAcre * acreage * (yieldPercentage / 100);
  const yieldRevenue = yieldIncrease * cropPricePerTon;

 const waterSavings = waterCostPerAcreFoot * waterUsagePerAcre * acreage * (waterSavingsPercentage / 100);

  const carbonCredits = parseFloat(co2Amount) * carbonCreditPricePerTon;

  // Corrected total benefit calculation
  const totalBenefit = yieldRevenue + waterSavings + carbonCredits;

  return {
    yieldRevenue: Math.round(yieldRevenue),
    waterSavings: Math.round(waterSavings),
    carbonCredits: Math.round(carbonCredits),
    totalBenefit: Math.round(totalBenefit)
  };
};