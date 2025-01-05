import { useCallback } from 'react'

interface IncidentActionButtonProps {
  incidentId: number
  incidentState: string
  setIncidentStatus: (newStatus: string) => void
}

function getCreatedStateButtons(incidentId: number, updateIncidentState: Function) {
  const monitorArgs = { incidentAction: "monitor"}
  const rejectArgs = { incidentAction: "reject"}

  return (
    <div className="d-grid gap-2">
      <button
        className="btn btn-primary"
        onClick={() => confirmAction(monitorArgs) && updateIncidentState("monitoring", incidentId)}
      >Monitor</button>
      <button
        className="btn btn-outline-danger"
        onClick={() => confirmAction(rejectArgs) && updateIncidentState("rejected", incidentId)}
      >Reject</button>
    </div>
  )
}

function getMonitoringStateButtons(incidentId: number, updateIncidentState: Function) {
  const closeArgs = { incidentAction: "close"}

  return (
    <div className="d-grid gap-2">
      <button
        className="btn btn-success"
        onClick={() => confirmAction(closeArgs) && updateIncidentState("closed", incidentId)}
      >Close</button>
    </div>
  )
}

function confirmAction(action): boolean {
  return confirm(`Are you sure you want to ${action.incidentAction} the incident?`)
}

export function IncidentActionButton({ incidentId, incidentState, setIncidentStatus, refreshIncidents }: IncidentActionButtonProps & { refreshIncidents: () => void}) {
  const updateIncidentState = useCallback((newState: string, incidentId: number) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident: { state: newState }})
    };

    fetch(`/api/incidents/${incidentId}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setIncidentStatus(data.state)
        refreshIncidents(); 
      })
      .catch((error) => console.error('Error updating incident state:', error));
  }, [refreshIncidents]);

  const buttonsForIncidentState = useCallback((incidentState: string) => {
    switch (incidentState) {
      case "created":
        return getCreatedStateButtons(incidentId, updateIncidentState)
        break
      case "monitoring":
        return getMonitoringStateButtons(incidentId, updateIncidentState)
        break
      case "rejected":
      case "closed":
        break
      default:
        console.error(`Invalid state: ${incidentState}`)
    }
  }, [incidentId, incidentState, updateIncidentState]);

  return (
    <>
      {buttonsForIncidentState(incidentState)}
    </>
  )
}
