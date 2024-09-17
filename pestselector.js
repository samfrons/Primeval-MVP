import { pestList } from './pestData.js';




const PestSelector = ({ selectedPests, onPestChange }) => {
  const handleSelectChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    onPestChange(value);
  };

  return (
    <div className="mb-4">
      <select 
        multiple 
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        value={selectedPests}
        onChange={handleSelectChange}
      >
        {pestList.map(pest => (
          <option key={pest} value={pest}>{pest}</option>
        ))}
      </select>
    </div>
  );
};

const SelectedPests = ({ pests, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {pests.map(pest => (
        <div key={pest} className="bg-gray-200 px-2 py-1 rounded flex items-center">
          <span>{pest}</span>
          <button 
            onClick={() => onRemove(pest)} 
            className="ml-2 delete"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};





const PestSelector = ({ selectedPests, onPestChange }) => {
  const handleSelectChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    onPestChange(value);
  };

  return (
    <div className="mb-4">
      <select 
        multiple 
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        value={selectedPests}
        onChange={handleSelectChange}
      >
        {pestList.map(pest => (
          <option key={pest} value={pest}>{pest}</option>
        ))}
      </select>
    </div>
  );
};





export { PestSelector, handleSelectChange };
