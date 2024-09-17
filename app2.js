import { RecommendationCard, generateRecommendations } from './recommendations.js';

const CropEntry = ({ crop, onEdit, onDelete }) => (
  <div className="flex items-center justify-between bg-gray-100 p-2 rounded mt-2">
    <span>{crop.name} - {crop.area} acres</span>
    <div>
      <button onClick={() => onEdit(crop)} className="text-black mr-2 hover:text-gray-700 action">
        Edit
      </button>
      <button onClick={() => onDelete(crop.name)} className="text-black hover:text-gray-700 action">
        Delete
      </button>
    </div>
  </div>
);

const FarmInputInterface = () => {
  const [farmData, setFarmData] = React.useState({
    zipCode: '',
    growZone: '',
    crops: [],
    totalArea: 0,
    surroundings: {
      forest: false,
      urban: false,
      water: false,
      farmland: false
    },
    pests: [],
    yield: '',
    rainfall: ''
  });

  const [currentCrop, setCurrentCrop] = React.useState({ name: '', area: '' });
  const [editingCrop, setEditingCrop] = React.useState(null);
  const [showRecommendations, setShowRecommendations] = React.useState(false);


  React.useEffect(() => {
    if (farmData.zipCode.length === 5) {
      setFarmData(prev => ({ ...prev, growZone: `Zone ${farmData.zipCode[0]}` }));
    } else {
      setFarmData(prev => ({ ...prev, growZone: '' }));
    }
  }, [farmData.zipCode]);

  React.useEffect(() => {
    const totalArea = farmData.crops.reduce((sum, crop) => sum + Number(crop.area), 0);
    setFarmData(prev => ({ ...prev, totalArea }));
  }, [farmData.crops]);

  const updateFarmData = (field, value) => {
    setFarmData(prev => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
  if (showRecommendations) {
    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = ''; // Clear previous recommendations
    generateRecommendations().forEach(rec => {
      container.appendChild(RecommendationCard(rec));
    });
  }
}, [showRecommendations]);

  const toggleSurrounding = (type) => {
    setFarmData(prev => ({
      ...prev,
      surroundings: {
        ...prev.surroundings,
        [type]: !prev.surroundings[type]
      }
    }));
  };

  const handleCropSubmit = (e) => {
    e.preventDefault();
    if (currentCrop.name && currentCrop.area) {
      setFarmData(prev => {
        let newCrops;
        if (editingCrop) {
          newCrops = prev.crops.map(crop => 
            crop.name === editingCrop.name ? currentCrop : crop
          );
        } else {
          newCrops = [...prev.crops, { ...currentCrop, area: Number(currentCrop.area) }];
        }
        return { ...prev, crops: newCrops };
      });
      setCurrentCrop({ name: '', area: '' });
      setEditingCrop(null);
    }
  };

  const handleCropEdit = (crop) => {
    setCurrentCrop(crop);
    setEditingCrop(crop);
  };

  const handleCropDelete = (cropName) => {
    setFarmData(prev => ({
      ...prev,
      crops: prev.crops.filter(crop => crop.name !== cropName)
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-full mx-auto p-6">
        <div className="flex bg-white shadow rounded-lg" style={{ width: '95%', margin: '0 auto' }}>
          {/* Visualization Section (70%) */}
          <div style={{ width: '70%' }} className="p-6 border-r border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Farm Visualization</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-[calc(100vh-200px)] flex items-center justify-center">
              {farmData.totalArea > 0 ? (
                <div className="text-center">
                  <div className="inline-block p-4 bg-gray-100 rounded-lg mb-4">
                    <p className="text-2xl font-semibold">{farmData.totalArea} acres total</p>
                    <p className="mt-2 font-semibold">{farmData.growZone}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                    {farmData.crops.map(crop => (
                      <div key={crop.name} className="p-4 bg-gray-100 rounded">
                        <p className="font-semibold">{crop.name}</p>
                        <p>{crop.area} acres</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto">
                    {Object.entries(farmData.surroundings).map(([key, value]) => (
                      value && (
                        <div key={key} className="p-2 bg-gray-100 rounded">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                      )
                    ))}
                  </div>
                  {farmData.pests.length > 0 && (
                    <div className="mt-4 p-2 bg-gray-100 rounded max-w-2xl mx-auto">
                      <p className="font-semibold">Historical Pests:</p>
                      <p>{farmData.pests.join(', ')}</p>
                    </div>
                  )}
                  {farmData.yield && (
                    <div className="mt-4 p-2 bg-gray-100 rounded max-w-2xl mx-auto">
                      <p className="font-semibold">Avg. Yield: {farmData.yield} bushels/acre</p>
                    </div>
                  )}
                  {farmData.rainfall && (
                    <div className="mt-4 p-2 bg-gray-100 rounded max-w-2xl mx-auto">
                      <p className="font-semibold">Avg. Rainfall: {farmData.rainfall} inches/year</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-xl">Enter farm data to see visualization</p>
              )}
            </div>
          </div>

          {/* Data Input Section (30%) */}
          <div style={{ width: '30%' }} className="p-6 overflow-y-auto">
            <h1 className="text-2xl font-semibold mb-6">Farm Data Input</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={farmData.zipCode}
                  onChange={(e) => updateFarmData('zipCode', e.target.value)}
                  placeholder="Enter zip code"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Grow Zone</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  value={farmData.growZone}
                  readOnly
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Crops</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="flex-grow p-2 border border-gray-300 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-black"
                      value={currentCrop.name}
                      onChange={(e) => setCurrentCrop(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Crop name"
                    />
                    <input
                      type="number"
                      className="w-20 p-2 border border-gray-300 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-black"
                      value={currentCrop.area}
                      onChange={(e) => setCurrentCrop(prev => ({ ...prev, area: e.target.value }))}
                      placeholder="Acres"
                    />
                    <button 
                      onClick={handleCropSubmit}
                      className="bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition duration-200"
                    >
                      {editingCrop ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
                <div className="mt-2 max-h-32 overflow-y-auto">
                  {farmData.crops.map(crop => (
                    <CropEntry 
                      key={crop.name} 
                      crop={crop} 
                      onEdit={handleCropEdit} 
                      onDelete={handleCropDelete} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Total Area (acres)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  value={farmData.totalArea}
                  readOnly
                  placeholder="Auto-calculated"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Surrounding Area</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(farmData.surroundings).map(([key, value]) => (
                    <button
                      key={key}
                      className={`px-3 py-1 rounded text-sm ${value ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} hover:bg-gray-800 hover:text-white transition duration-200`}
                      onClick={() => toggleSurrounding(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Historical Pests</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={farmData.pests.join(', ')}
                  onChange={(e) => updateFarmData('pests', e.target.value.split(',').map(pest => pest.trim()))}
                  placeholder="Comma-separated"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Average Yield (bushels/acre)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={farmData.yield}
                  onChange={(e) => updateFarmData('yield', e.target.value)}
                  placeholder="Enter avg yield"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Average Annual Rainfall (inches)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={farmData.rainfall}
                  onChange={(e) => updateFarmData('rainfall', e.target.value)}
                  placeholder="Enter avg rainfall"
                />
              </div>

              <button 
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-200 mt-6"
                onClick={() => setShowRecommendations(true)}
              >
                Generate Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
         {showRecommendations && (
    <div className="mt-8 bg-white shadow rounded-lg p-6" style={{ width: '95%', margin: '0 auto' }}>
      <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="recommendationsContainer">
        {/* RecommendationCards will be appended here */}
      </div>
    </div>
  )}

      </div> 
    </div>
  );
};

ReactDOM.render(<FarmInputInterface />, document.getElementById('root'));