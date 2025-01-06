from statemachine import StateMachine, State

class IncidentMachine(StateMachine):
    # States
    created = State('created',initial=True)
    monitoring = State('monitoring')
    closed = State('closed',final=True)
    rejected = State('rejected',final=True)

    # Transitions
    reject = created.to(rejected)
    monitor = created.to(monitoring)
    close = monitoring.to(closed)

    STATE_ACTION_MAPPING = {
        "rejected": "reject",
        "monitoring": "monitor",
        "closed": "close"
    }
