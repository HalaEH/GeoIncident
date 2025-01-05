import { useState } from 'react'
import { useEffect } from 'react'
import { useCallback } from "react"
import { Search, Plus, AlertTriangle } from 'lucide-react'
import AddIncidentForm from './components/AddIncidentForm.tsx'
import Map from './components/Map.tsx'
import './styles/styles.css'

import { Incident } from "./components/Incident.tsx"

function getIncidents() {
  return fetch('/api/incidents')
    .then(data => data.json())
}

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'high':
      return '#EF4444';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#008000';
    default:
      return '#6B7280';
  }
};

function App({ refreshTrigger }: { refreshTrigger: any }) {
  const [incidents, setIncidents] = useState<Object[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Object | null>(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    }
  }, []);

  const handleIncidentClick = (incident: Object) => {
    setSelectedIncident(incident);
  };

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents, refreshTrigger]);


  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <main className="my-4">
      <div className="container-fluid">

        {/* Header*/}
        <header className="p-2 bg-dark">
          <div className="row">
            <div className="col d-flex justify-content-between">
              <h1 className="text-white">GeoIncident</h1>
              <button type="button"
                onClick={() => setIsFormOpen(true)}
                className="btn btn-primary ms-auto">
                <Plus size={20} /> New Incident
              </button>
              <hr />
            </div>
          </div>
        </header>

        {isFormOpen && <AddIncidentForm setIsFormOpen={setIsFormOpen} onIncidentAdded={fetchIncidents} />}

        <div className="row">

          {/* Left sidebar with search and incident list */}
          <div className="col-lg-3">
            <div className="card shadow-sm vh-100 bg-light">
              <div className="card-body">

                <div className="position-relative mb-3">
                  <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={20} />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search incidents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="list-group">
                  {filteredIncidents.map(incident => (
                    <button
                      key={incident.id}
                      className={`list-group-item list-group-item-action ${selectedIncident?.id === incident.id ? 'active' : ''}`}
                      onClick={() => handleIncidentClick(incident)}>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <AlertTriangle
                          size={20}
                          color={getSeverityColor(incident.alert)} />
                        <h6 className="mb-1" style={{ textTransform: 'capitalize' }}>{incident.title}</h6>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-2 text-muted">
                        <small style={{ color: getSeverityColor(incident.alert), textTransform: 'capitalize' }}>
                          {incident.alert}
                        </small>
                        <small>{incident.created}</small>
                      </div>
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>

          <div className="col-lg-5 g-4">
            <div className="card shadow-sm" style={{ minHeight: '600px' }}>
              <div className="card-body p-0 position-relative">
                <Map
                  incidents={filteredIncidents}
                  selectedIncident={selectedIncident}
                  zoom={zoom}
                  handleIncidentClick={handleIncidentClick}
                />
              </div>
            </div>
          </div>

          {/* Right section with incident details */}
          <div className="col-lg-4 g-4">
            {selectedIncident ? (
              <Incident
                key={selectedIncident.id}
                incidentId={selectedIncident.id}
                incidentTitle={selectedIncident.title}
                incidentLatitude={selectedIncident.latitude}
                incidentLongitude={selectedIncident.longitude}
                incidentMagnitude={selectedIncident.magnitude}
                incidentDescription={selectedIncident.description}
                incidentType={selectedIncident.type}
                incidentCreated={selectedIncident.created}
                incidentUpdated={selectedIncident.updated}
                incidentState={selectedIncident.state}
                refreshIncidents={fetchIncidents}
              />
            ) : (
              <div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
