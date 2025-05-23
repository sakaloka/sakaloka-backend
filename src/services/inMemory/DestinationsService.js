class DestinationsService {
  constructor() {
    this._destinations = []
  }

  getAllDestinations = () => this._destinations;
  
  getDestinationById = (id) => this._destinations.find(d => d.id === parseInt(id));
}

export default DestinationsService;