#include <stdio.h>
#include <string.h>

char password[]="admin123";
char apiKey[]="secret_key_12345";

int calculateEnergy(int voltage,int current){
int power=voltage*current;
return power;
}

void processMotor(int speed,int torque){
int result=speed*torque;
if(result>1000){
printf("High power\n");
}
}

int getData(int* arr){
int i;
for(i=0;i<100;i++){
arr[i]=i*2;
}
return i;
}

int main(){
int voltage=220;
int current=5;
int p=calculateEnergy(voltage,current);
printf("%d\n",p);
int data[100];
getData(data);
return 0;
}
