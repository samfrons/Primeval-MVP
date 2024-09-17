// pestData.js

export const pestData = [
  {
    name: "Aphids",
    description: "Small sap-sucking insects that can quickly reproduce and damage crops.",
    treatments: [
      {
        name: "Ladybugs",
        description: "Release ladybugs as natural predators to control aphid populations."
      },
      {
        name: "Neem Oil",
        description: "Spray neem oil solution to repel and disrupt aphid feeding."
      },
      {
        name: "Companion Planting",
        description: "Plant marigolds or nasturtiums near affected crops to repel aphids."
      }
    ]
  },
  {
    name: "Tomato Hornworms",
    description: "Large caterpillars that can quickly defoliate tomato plants.",
    treatments: [
      {
        name: "Bacillus thuringiensis (Bt)",
        description: "Apply Bt, a natural bacteria that's toxic to caterpillars but safe for other organisms."
      },
      {
        name: "Companion Planting",
        description: "Plant dill or borage to attract parasitic wasps that prey on hornworms."
      },
      {
        name: "Hand-picking",
        description: "Manually remove hornworms from plants and relocate them."
      }
    ]
  },
  {
    name: "Spider Mites",
    description: "Tiny arachnids that suck plant fluids, causing stippling on leaves.",
    treatments: [
      {
        name: "Predatory Mites",
        description: "Introduce predatory mites that feed on spider mites."
      },
      {
        name: "Neem Oil",
        description: "Apply neem oil to suffocate and repel spider mites."
      },
      {
        name: "Kaolin Clay Spray",
        description: "Apply kaolin clay spray to create a protective barrier on plants."
      }
    ]
  },
  {
    name: "Colorado Potato Beetle",
    description: "Striped beetle that can quickly defoliate potato and other nightshade plants.",
    treatments: [
      {
        name: "Crop Rotation",
        description: "Rotate crops annually to disrupt the beetle's life cycle."
      },
      {
        name: "Neem Oil",
        description: "Spray neem oil to repel beetles and prevent egg-laying."
      },
      {
        name: "Diatomaceous Earth",
        description: "Apply food-grade diatomaceous earth around plants to deter beetles."
      }
    ]
  },
  {
    name: "Cucumber Beetles",
    description: "Spotted or striped beetles that damage cucurbit crops and spread bacterial wilt.",
    treatments: [
      {
        name: "Row Covers",
        description: "Use row covers until flowering to prevent early-season infestations."
      },
      {
        name: "Kaolin Clay Spray",
        description: "Apply kaolin clay spray to create a protective barrier on plants."
      },
      {
        name: "Companion Planting",
        description: "Plant radishes or nasturtiums as trap crops to lure beetles away from main crops."
      }
    ]
  }
];


export const pestList = pestData.map(pest => pest.name);