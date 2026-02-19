"""
Perfect Python code example for testing 100/100 score.
This should pass all checks.
"""


def calculate_power(voltage: float, current: float) -> float:
    """
    Calculate electrical power using P = V * I.
    
    Args:
        voltage: Voltage in volts
        current: Current in amperes
        
    Returns:
        Power in watts
        
    Raises:
        ValueError: If voltage or current is negative
    """
    if voltage < 0 or current < 0:
        raise ValueError("Voltage and current must be positive")
    return voltage * current


def calculate_energy(power: float, time_hours: float) -> float:
    """
    Calculate energy consumption.
    
    Args:
        power: Power in watts
        time_hours: Time in hours
        
    Returns:
        Energy in watt-hours
    """
    if power < 0 or time_hours < 0:
        raise ValueError("Power and time must be positive")
    return power * time_hours


class EnergyMonitor:
    """Monitor and track energy consumption."""
    
    def __init__(self, device_id: str):
        """
        Initialize energy monitor.
        
        Args:
            device_id: Unique device identifier
        """
        self.device_id = device_id
        self.total_energy = 0.0
        self.is_active = False
    
    def start_monitoring(self) -> None:
        """Start energy monitoring."""
        self.is_active = True
        print(f"Monitoring started for device {self.device_id}")
    
    def stop_monitoring(self) -> None:
        """Stop energy monitoring."""
        self.is_active = False
        print(f"Monitoring stopped for device {self.device_id}")
    
    def record_consumption(self, energy: float) -> None:
        """
        Record energy consumption.
        
        Args:
            energy: Energy consumed in watt-hours
        """
        if energy < 0:
            raise ValueError("Energy must be positive")
        self.total_energy += energy


if __name__ == "__main__":
    # Example usage
    voltage = 230.0
    current = 5.0
    power = calculate_power(voltage, current)
    print(f"Power: {power} watts")
    
    monitor = EnergyMonitor("DEVICE-001")
    monitor.start_monitoring()
    monitor.record_consumption(1500.0)
    monitor.stop_monitoring()