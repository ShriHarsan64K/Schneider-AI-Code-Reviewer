var password = "admin123"
var apiKey = "secret_key_12345"

function calculateEnergy(voltage,current){
var power=voltage*current
return power
}

function processMotor(speed,torque){
var result=speed*torque
if(result>1000){
console.log("High power")
}
return result
}

var motorData=[]
for(var i=0;i<100;i++){
motorData.push(i*2)
}

function getData(){
var x=[]
var y=0
while(y<50){
x.push(y)
y++
}
return x
}

function unused(){
var a=1
var b=2
}
