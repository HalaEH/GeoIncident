import { useState } from 'react'

import { IncidentActionButton } from "./IncidentActionButton.tsx"

interface IncidentProps {
  incidentId: number
  incidentTitle: string
  incidentLatitude: number
  incidentLongitude: number
  incidentMagnitude: number
  incidentDescription: string
  incidentType: string
  incidentCreated: string
  incidentUpdated: string
  incidentState: string
  refreshIncidents: () => void;
}

export function Incident({ incidentId, incidentTitle, incidentLatitude, incidentLongitude, incidentMagnitude, incidentDescription, incidentType, incidentCreated, incidentUpdated, incidentState, refreshIncidents }: IncidentProps) {
  const [incidentStatus, setIncidentStatus] = useState<string>(incidentState)

  return (
    <div className="col-sm-8">
      <div className="card h-100 shadow-lg bg-white">
        <div className="card-header border-0 bg-dark text-white py-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fs-4" style={{ textTransform: 'capitalize' }}>{incidentTitle}</h5>
            <span className="badge rounded-pill bg-warning text-white fs-6 py-2 px-3">
              {incidentStatus}
            </span>
          </div> </div>

        <div className="card-body p-4">
          <div className="row g-4">
            <div className="d-flex flex-column gap-4">
              <div>
                <label className="card-text text-muted">Latitude</label>
                <div className="fw-semibold">{incidentLatitude}</div>
              </div>

              <div>
                <label className="card-text text-muted">Longitude</label>
                <div className="fw-semibold">{incidentLongitude}</div>
              </div>

              <div>
                <label className="card-text text-muted">Description</label>
                <div className="fw-semibold">{incidentDescription ? incidentDescription : '--'}</div>
              </div>

              <div>
                <label className="card-text text-muted">Type</label>
                <div className="fw-semibold">{incidentType ? incidentType : '--'}</div>
              </div>

              <div>
                <label className="card-text text-muted">Magnitude</label>
                <div className="fw-semibold">{incidentMagnitude ? incidentMagnitude : '--'}</div>
              </div>

              <div>
                <label className="card-text text-muted">Created on</label>
                <div className="fw-semibold">{incidentCreated}</div>
              </div>

              <div>
                <label className="card-text text-muted">Last updated</label>
                <div className="fw-semibold">{incidentUpdated}</div>
              </div>

            </div>
            <IncidentActionButton
              incidentId={incidentId}
              incidentState={incidentStatus}
              setIncidentStatus={setIncidentStatus}
              refreshIncidents={refreshIncidents}
            />

          </div>


        </div>
      </div>
    </div>
  )
}
