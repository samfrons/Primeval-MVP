// cropData.js

const crops = [
  { name: "Grapes", id: "grapes" },
  { name: "Tomatoes", id: "tomatoes" },
  { name: "Strawberries", id: "strawberries" },
  { name: "Basil", id: "basil" },
  { name: "Almonds", id: "almonds" },
  { name: "Pistachios", id: "pistachios" }
];
const cropIcons = {
  grapes: '/resources/grape.svg',
  tomatoes: '/resources/tomato.svg',
  strawberries: '/resources/strawberry.svg',
  basil: '/resources/basil.svg',
  almonds: '/resources/almond.svg',
  pistachios:'/resources/pistachio.svg',
  default: '🌱'
};



const CropSelector = ({ onSelect, value }) => {
  const [inputValue, setInputValue] = React.useState(value || '');
  const [suggestions, setSuggestions] = React.useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = crops.filter(crop =>
        crop.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (crop) => {
    setInputValue(crop.name);
    onSelect(crop);
    setSuggestions([]);
  };

  return React.createElement('div', { className: 'relative' },
    React.createElement('input', {
      type: 'text',
      className: 'w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black',
      value: inputValue,
      onChange: handleInputChange,
      placeholder: 'Select a crop'
    }),
    suggestions.length > 0 && React.createElement('ul', {
      className: 'absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg'
    },
      suggestions.map(crop =>
        React.createElement('li', {
          key: crop.id,
          className: 'p-2 hover:bg-gray-100 cursor-pointer',
          onClick: () => handleSelect(crop)
        }, crop.name)
      )
    )
  );
};

export { crops, CropSelector, cropIcons };


