from network import LoRa
import socket
import time
from machine import UART
from config import dev_eui, app_eui, app_key

uart = UART(1, baudrate=115200)
data = None

lora = LoRa(mode=LoRa.LORAWAN, region=LoRa.US915)

# imported from config.py dev_eui, app_eui, app_key

for i in range(0,8):
    lora.remove_channel(i)
for i in range(16,65):
    lora.remove_channel(i)
for i in range(66,72):
    lora.remove_channel(i)

lora.join(activation=LoRa.OTAA, auth=(dev_eui, app_eui, app_key), timeout=0)

while not lora.has_joined():
    time.sleep(2.5)
    uart.write("sending")
    print('Not yet joined...')

time.sleep(1)
print('Joined')
uart.write("ok")
s = socket.socket(socket.AF_LORA, socket.SOCK_RAW)
s.setsockopt(socket.SOL_LORA, socket.SO_DR, 1)

while 1:
    data = uart.readline() # read up to 5 bytes}
    if data == None:
        ...
    elif data==b'\x00' or data==b'\xff':
        uart.write("ok")
    else:
        print(data)
        uart.write("sending")
        s.setblocking(True)
        s.send(data)
        s.setblocking(False)
        uart.write("ok")