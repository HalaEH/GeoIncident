from flask import Blueprint
from flask import abort, jsonify, make_response, request
from backend.db import get_db
from backend.incident_state_machine import IncidentMachine
from backend.utilities import query_to_json_response

incident = Blueprint('incident', __name__, url_prefix='/api/incidents')

def abort_with_message(err_msg, http_code):
    abort(make_response(jsonify(message=err_msg), http_code))

@incident.put('/<int:incident_id>')
def update_incident(incident_id):
    db = get_db()
    error = None

    incident = db.execute(
        'SELECT * FROM incident WHERE id = ?', (incident_id,)
    ).fetchone()

    if incident is None:
        abort_with_message("Incident id {incident_id} doesn't exist.", 404)

    data = request.get_json()
    new_state = data.get('incident').get('state')

    if not new_state:
        abort_with_message("Incident state is required.", 400)

    sm = IncidentMachine(start_value = incident['state'])

    try:
        sm.send(IncidentMachine.STATE_ACTION_MAPPING[new_state])
    except:
        abort_with_message("Invalid transition from {incident['state']} to {new_state} for incident status.", 400)

    db.execute(
        'UPDATE incident SET state = ?, updated = CURRENT_TIMESTAMP'
        ' WHERE id = ?',
        (new_state, incident_id)
    )
    db.commit()
    updated_row = dict(incident)
    updated_row['state'] = new_state

    return jsonify(updated_row)


@incident.get('/')
def incidents():
    db = get_db()
    incidents = db.execute('SELECT * FROM incident').fetchall()
    return query_to_json_response(incidents)


@incident.post('/')
def add_incident():
    db = get_db()
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    alert = data.get('alert')  
    magnitude = data.get('magnitude')
    type = data.get('type')

    if not all([title, latitude, longitude, alert]):
        abort_with_message("All fields are required", 400)

    try:
        db.execute(
            'INSERT INTO incident (title, description, latitude, longitude, alert, magnitude, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (title, description, latitude, longitude, alert, magnitude, type)
        )
        db.commit()
        return jsonify({'message': 'Incident created successfully'}), 201
    except Exception as e:
        db.rollback()
        abort_with_message(f"Error creating incident: {str(e)}", 500)