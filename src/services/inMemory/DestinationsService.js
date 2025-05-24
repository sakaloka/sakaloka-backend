class DestinationsService {
  constructor() {
    this._destinations = [];
  }

  getAllDestinations = () => this._destinations;

  getDestinationById = (id) => this._destinations.find(d => d.id === parseInt(id));

  addDestination = ({ name, cityId, latitude, longitude, description }) => {
    const id = this._destinations.length + 1;
    const timestamp = new Date().toISOString();
    const destination = { id, city_id: cityId, name, latitude, longitude, description, created_at: timestamp, updated_at: timestamp };
    this._destinations.push(destination);
    return destination;
  };

  updateDestination = (id, data) => {
    const index = this._destinations.findIndex(d => d.id === parseInt(id));
    if (index === -1) return false;

    this._destinations[index] = {
      ...this._destinations[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return true;
  };

  deleteDestination = (id) => {
    const index = this._destinations.findIndex(d => d.id === parseInt(id));
    if (index === -1) return false;
    this._destinations.splice(index, 1);
    return true;
  };
}

export default DestinationsService;