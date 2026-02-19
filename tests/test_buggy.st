PROGRAM motorControl
VAR
id:INT;
spd:INT;
stat:BOOL;
pwd:STRING:='admin123';
x:INT;
y:INT;
result:INT;
END_VAR

IF spd>0 THEN
stat:=TRUE;
x:=spd*2;
result:=x+id;
END_IF

IF result>1000 THEN
stat:=FALSE;
END_IF

FOR x:=0 TO 100 DO
y:=x*2;
END_FOR

FUNCTION calculateEnergy:INT
VAR_INPUT
voltage:INT;
current:INT;
END_VAR
calculateEnergy:=voltage*current;
END_FUNCTION

FUNCTION_BLOCK MotorFB
VAR_INPUT
motorId:INT;
motorSpeed:INT;
END_VAR
VAR_OUTPUT
status:BOOL;
power:INT;
END_VAR
VAR
temp:INT;
END_VAR
temp:=motorSpeed*2;
power:=temp+motorId;
status:=TRUE;
END_FUNCTION_BLOCK
