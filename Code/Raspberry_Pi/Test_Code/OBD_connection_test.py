import obd
#obd.logger.setLevel(obd.logging.DEBUG)

connection = obd.OBD()
c = obd.commands.RPM
a = obd.commands.SPEED

i = 0
while(i < 10):
  response = connection.query(c)
  response2 = connection.query(a)
  print (response.value)
  print (response2.value)
  i = i+1


connection.close()