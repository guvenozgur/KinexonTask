class BatterySimulator:
    """A simple battery simulator class."""
    def __init__(self, name):
        """Initialize the battery simulator with 100.0 State of Charge (SOC)."""
        self.soc = 100.0
        self.charging = False
        self.name = name
    def get(self):
        """Get the current SOC of the battery simulator."""
        tmp = self.soc
        if self.charging:
            self.soc = tmp + 1 if tmp < 100.0 else 100.0
        else:
            self.soc = tmp - 1 if tmp > 0.0 else 0.0
        return {"isCharging": self.charging, "currentState": tmp}
    def charge(self, state):
        """Set the simulators charge state.
        Args:
        - state (bool): Desired charging state.
        """
        self.charging = state