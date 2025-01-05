from flask import jsonify


def query_to_json_response(db_result):
    response = jsonify([dict(row) for row in db_result])
    response.headers['Content-Type'] = 'application/json'
    return response
