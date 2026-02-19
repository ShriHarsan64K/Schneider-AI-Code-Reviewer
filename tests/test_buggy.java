import java.util.ArrayList;

public class motorController {
    String password="admin123";
    String apiKey="secret_key";
    int id;
    int speed;
    String status;

    public motorController(int id,int speed){
        this.id=id;
        this.speed=speed;
        this.status="stopped";
    }

    public void start(){
        System.out.println("Starting");
        this.status="running";
    }

    public void stop(){
        this.status="stopped";
    }

    public int calculateEnergy(int voltage,int current){
        int power=voltage*current;
        return power;
    }

    public ArrayList getData(){
        ArrayList data=new ArrayList();
        for(int i=0;i<100;i++){
            data.add(i*2);
        }
        return data;
    }

    public static void main(String[] args){
        motorController mc=new motorController(1,100);
        mc.start();
        int x=mc.calculateEnergy(220,5);
        System.out.println(x);
    }
}
