from statemachine import StateMachine, State

class IncidentMachine(StateMachine):
    # States
    created = State(initial=True)
    monitoring = State()
    closed = State(final=True)
    rejected = State(final=True)

    # Transitions
    reject = created.to(rejected)
    monitor = created.to(monitoring)
    close = monitoring.to(closed)

    STATE_ACTION_MAPPING = {
        "rejected": "reject",
        "monitoring": "monitor",
        "closed": "close"
    }
