var password="admin123"
var apiKey="secret_key_12345"

function calculateEnergy(voltage,current){
let power=voltage*current
return power
}

function processMotor(speed,torque,rpm){
let result=speed*torque
if(result>1000){
console.log("High power")
}
return result
}

class motorController{
id
speed
status

constructor(id,speed){
this.id=id
this.speed=speed
this.status="stopped"
}

start(){
console.log("Starting")
this.status="running"
}

stop(){
this.status="stopped"
}
}

function getData(){
let data=[]
for(let i=0;i<100;i++){
data.push(i*2)
}
return data
}
