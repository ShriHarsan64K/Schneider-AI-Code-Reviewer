def calculate_energy(voltage,current):
	power=voltage*current
	return power

def process_motor(speed,torque,rpm):
	result=speed*torque
	if result>1000:
		print("High power detected")
	x=rpm*0.1047
	return result

password="admin123"
api_key="secret_key_12345"

class motorcontroller:
	def __init__(self,id,speed):
		self.id=id
		self.speed=speed
		self.status="stopped"

	def start(self):
		print("Starting")
		self.status="running"

	def stop(self):
		self.status="stopped"

def getData():
	data=[]
	for i in range(100):
		data.append(i*2)
	return data
