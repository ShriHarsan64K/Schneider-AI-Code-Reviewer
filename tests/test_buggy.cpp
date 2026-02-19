#include <iostream>
#include <vector>
#include <string>
using namespace std;

string password="admin123";
string apiKey="secret_key_12345";

class motorController{
public:
int id;
int speed;
string status;

motorController(int id,int speed){
this->id=id;
this->speed=speed;
this->status="stopped";
}

void start(){
cout<<"Starting"<<endl;
this->status="running";
}

void stop(){
this->status="stopped";
}

int calculateEnergy(int voltage,int current){
int power=voltage*current;
return power;
}

vector<int> getData(){
vector<int> data;
for(int i=0;i<100;i++){
data.push_back(i*2);
}
return data;
}
};

int main(){
motorController mc=motorController(1,100);
mc.start();
int x=mc.calculateEnergy(220,5);
cout<<x<<endl;
return 0;
}
