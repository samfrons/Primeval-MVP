import { RecommendationCard, generateRecommendations } from './recommendations.js';
import { CropSelector, cropIcons } from './cropData.js';
import { pestList } from './pestData.js';


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



const FarmInputInterface = () => {
  const [farmData, setFarmData] = React.useState({
    crops: [],
    zipCode: '',
    growZone: '',
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

  const [location, setLocation] = React.useState('');
  const [growZone, setGrowZone] = React.useState('');
  const [mapImage, setMapImage] = React.useState(null);
  const autocompleteInputRef = React.useRef(null);


  const handlePestChange = (selectedPests) => {
    setFarmData(prev => ({ ...prev, pests: selectedPests }));
  };

  const handleRemovePest = (pestToRemove) => {
    setFarmData(prev => ({
      ...prev,
      pests: prev.pests.filter(pest => pest !== pestToRemove)
    }));
  };


  const CropGrid = ({ crops, totalArea }) => {
    const gridSize = 10; // 10x10 grid
    const totalCells = gridSize * gridSize;
    let cellsUsed = 0;

  return (
    <div className="grid grid-cols-10 gap-1 bg-gray-200 p-2 rounded">
          {crops.map(crop => {
            const cropCells = Math.round((crop.area / totalArea) * totalCells);
            const cells = [];
            for (let i = 0; i < cropCells && cellsUsed < totalCells; i++) {
              cells.push(
                <div 
                  key={`${crop.name}-${i}`} 
                  className="w-6 h-6 flex items-center justify-center"
                  title={`${crop.name}: ${crop.area} acres`}
                >
                  <img 
                    src={cropIcons[crop.name.toLowerCase()] || cropIcons.default} 
                    alt={crop.name}
                    className="w-full h-full"
                  />
                </div>
              );
              cellsUsed++;
            }
            return cells;
        })}
      {[...Array(totalCells - cellsUsed)].map((_, i) => (
        <div key={`empty-${i}`} className="w-6 h-6 bg-gray-300" />
      ))}
    </div>
  );
};


React.useEffect(() => {
    if (window.google && window.google.maps && autocompleteInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
        types: ['geocode'],
       
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('Selected place:', place);
        if (place.formatted_address) {
          setLocation(place.formatted_address);
          
          const zipComponent = place.address_components.find(component => 
            component.types.includes('postal_code')
          );
          if (zipComponent) {
            const zipCode = zipComponent.long_name;
            console.log('Extracted zip code:', zipCode);
            const zoneNumber = Math.min(Math.max(parseInt(zipCode[0]) + 1, 1), 13);
            setGrowZone(`Zone ${zoneNumber}`);
          } else {
            console.log('No zip code found in the address');
            setGrowZone('');
          }
        }
      });
    }
  }, []);

  const fetchMapImage = () => {
    console.log('Fetching map for location:', location);
    if (!location) {
      console.log('No location provided');
      return;
    }

    const apiKey = 'AIzaSyDH-Fm2hMNXkOoy90j3seegIUnb4n5Takk'; // Replace with your actual API key
    const encodedAddress = encodeURIComponent(location);
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=16&size=1600x800&maptype=satellite&key=${apiKey}`;
    setMapImage(url);
  };

  const updateFarmData = (field, value) => {
    setFarmData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSurrounding = (type) => {
    setFarmData(prev => ({
      ...prev,
      surroundings: {
        ...prev.surroundings,
        [type]: !prev.surroundings[type]
      }
    }));
  };

const handleCropSelect = (selectedCrop) => {
  console.log('Crop selected:', selectedCrop);
  setCurrentCrop(prev => ({ ...prev, name: selectedCrop.name }));
};

const handleCropSubmit = (e) => {
  e.preventDefault();
  console.log('Submitting crop:', currentCrop);
  if (currentCrop.name && currentCrop.area) {
    setFarmData(prev => {
      console.log('Previous farm data:', prev);
      let newCrops;
      if (editingCrop) {
        newCrops = prev.crops.map(crop => 
          crop.name === editingCrop.name ? currentCrop : crop
        );
      } else {
        newCrops = [...prev.crops, { ...currentCrop, area: Number(currentCrop.area) }];
      }
      const newTotalArea = newCrops.reduce((sum, crop) => sum + Number(crop.area), 0);
      console.log('New crops:', newCrops);
      console.log('New total area:', newTotalArea);
      return { ...prev, crops: newCrops, totalArea: newTotalArea };
    });
    setCurrentCrop({ name: '', area: '' });
    setEditingCrop(null);
  }
  console.log('Crop submission complete');
};

const handleCropEdit = (crop) => {
  setCurrentCrop(crop);
  setEditingCrop(crop);
};

const handleCropDelete = (cropName) => {
  setFarmData(prev => {
    const newCrops = prev.crops.filter(crop => crop.name !== cropName);
    const newTotalArea = newCrops.reduce((sum, crop) => sum + Number(crop.area), 0);
    return { ...prev, crops: newCrops, totalArea: newTotalArea };
  });
};


React.useEffect(() => {
  if (showRecommendations) {
    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = ''; // Clear previous recommendations
    generateRecommendations(farmData).forEach(rec => {
      container.appendChild(RecommendationCard(rec));
    });
  }
}, [showRecommendations, farmData]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-full mx-auto p-6">
        <div className="flex bg-white shadow rounded-lg mapimg" style={{ width: '95%', margin: '0 auto' }}>
          <div style={{ 
  width: '70%', 
  backgroundImage:  `url(${mapImage})` ,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'

}} className="p-6 border-r border-gray-200 fade-inb">
            <h2 className="bg-white text-2xl font-semibold mb-4 title">Primeval</h2>

<div className="border-0 border-dashed border-gray-300 rounded-lg h-[calc(100vh-200px)] flex items-center relative justify-center">
              {!mapImage && (
                <p className="bg-opacity-75 p-4 bg-white">Enter a location and click "Get Map" to see a satellite view.</p>
              )}
              </div>


             {farmData.totalArea === 0 && (
      <div className="flex items-center justify-center farm-placeholder">
        <div className="bg-white bg-opacity-75 p-4 border-2 border-dashed border-gray-200 shadow">
          
          <p className="text-gray-600 ">Enter crop data to see visualization and get recommendations.</p>
        </div>
      </div>
    )}

            <div className="border-0 border-dashed border-gray-000 rounded-lg h-[calc(100vh-200px)] flex items-center justify-center bg-opacity-75">
              {farmData.totalArea > 0 ? (
                <div className="text-center justify-center fade-in">
                  <div className="inline-block p-4 bg-opacity-75 bg-gray-100 mb-4">
                   <CropGrid crops={farmData.crops} totalArea={farmData.totalArea} />
                   {farmData.crops.map(crop => (
                      <div key={crop.name} className="p-4 inline-p">
                        <p className="font-semibold">{crop.name}</p>
                        <p>{crop.area} acres</p>
                      </div>
                    ))}
                    <p className="text-xl font-semibold">{farmData.totalArea} total acres</p>
                    <p className="mt-2 font-semibold">{farmData.growZone}</p>
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
                      <p className="font-semibold">Common Pests:</p>
                      <p>{farmData.pests.join(', ')}</p>
                    </div>
                  )}
                  {farmData.yield && (
                    <div className="mt-4 p-2 bg-gray-100 rounded max-w-2xl mx-auto">
                      <p className="font-semibold">Avg. Yield: {farmData.yield} bushels/acre</p>
                    </div>
                  )}
                </div>
              ) : ( 
                <p className="dnone"></p>
              )}
            </div>




            {/* Recommendations Section */}
         {showRecommendations && (
    <div className="rec fade-in mt-8 bg-white shadow rounded-lg p-6" style={{ width: '95%', margin: '0 auto' }}>
      <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="recommendationsContainer">
        {/* RecommendationCards will be appended here */}
      </div>
    </div>
  )}
          </div>

          {/* Data Input Section (30%) */}
          <div style={{ width: '30%' }} className="p-6 overflow-y-auto bg-white sidebar">
            <h1 className="text-2xl font-semibold mb-6">Farm Data Input</h1>
            
            <div className="space-y-6">
            <div>
                <label className="block mb-2 font-medium text-gray-700">Farm Location</label>
                <div className="flex">
                  <input
                    ref={autocompleteInputRef}
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-black"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter address or zip code"
                  />
                <button 
                    onClick={fetchMapImage}
                    className="bg-black text-white px-3 py-2 rounded-r hover:bg-gray-800 transition duration-200"
                  >
                    Get Map
                  </button>
                </div>
              </div>


              <div>
                <label className="block mb-2 font-medium text-gray-700">Crops</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                  <div className="flex-grow mr-2">
  {React.createElement(CropSelector, { 
    onSelect: handleCropSelect, 
    value: currentCrop.name 
  })}
</div>
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
                <label className="block mb-2 font-medium text-gray-700">Common Pests</label>
              <PestSelector
        selectedPests={farmData.pests}
        onPestChange={handlePestChange}
      />
      <SelectedPests
        pests={farmData.pests}
        onRemove={handleRemovePest}
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
              <button 
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-200 mt-6"
                onClick={() => setShowRecommendations(true)}
              >
                Generate Recommendations
              </button>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

ReactDOM.render(<FarmInputInterface />, document.getElementById('root'));