import json
import pytest

from flask import url_for
from backend.db import get_db
from statemachine.exceptions import TransitionNotAllowed
from backend.incident_state_machine import IncidentMachine


def test_can_call_endpoint(app, client):
    with app.app_context(), app.test_request_context():
        response = client.get(url_for('incident.incidents'))
        assert b"Earthquake" in response.data

def test_incident_index(app, client):
    with app.app_context(), app.test_request_context():
        response = client.get(url_for('incident.incidents', id=1))
        assert b"Earthquake" in response.data

def test_state_change(app, client):
    with app.app_context(), app.test_request_context():
        tested_id = 1
        new_state= 'monitoring'
        data = {'incident': {'state': new_state}}
        headers = {'Content-Type': 'application/json'}
        response = client.put(url_for('incident.update_incident', incident_id = tested_id), data=json.dumps(data), headers=headers)
        updated = get_db().execute('SELECT * FROM incident WHERE id = ?', (tested_id,)).fetchone()

        assert response.status_code == 200
        assert updated['state'] == new_state

def test_invalid_state_transition(app, client):
    with app.app_context(), app.test_request_context():
        tested_id = 1
        new_state = 'closed'
        data = {'incident': {'state': new_state}}
        headers = {'Content-Type': 'application/json'}
        response = client.put(url_for('incident.update_incident', incident_id = tested_id), data=json.dumps(data), headers=headers)

        assert response.status_code == 400
        
def test_add_incident(app, client):
    with app.app_context(), app.test_request_context():
        new_title = 'Asgard Earthquake'
        new_latitude = 56.78
        new_longitude = -145.6
        new_alert = 'low'
        data = {'title': new_title, 'latitude': new_latitude, 'longitude': new_longitude, 'alert': new_alert}
        headers = {'Content-Type': 'application/json'}
        response = client.post(url_for('incident.add_incident'), data=json.dumps(data), headers=headers)
        added = get_db().execute('SELECT * FROM incident WHERE title = ?', (new_title,)).fetchone()

        assert response.status_code == 201
        assert float(added['latitude']) == 56.78
        assert added['state'] == 'created'


def test_valid_transition():
    sm = IncidentMachine()
    sm.monitor()
    assert sm.current_state_value == 'monitoring'

def test_invalid_transition():
    sm = IncidentMachine()
    with pytest.raises(TransitionNotAllowed):
        sm.send('close')
