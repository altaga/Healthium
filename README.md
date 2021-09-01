# He_alth_AWS
 
<img src="LogoPendiente">

# Table of Contents:

- [He_alth_AWS](#he_alth_aws)
- [Table of Contents:](#table-of-contents)
- [Introduction:](#introduction)
- [Solution:](#solution)
- [Materials:](#materials)
  - [Hardware:](#hardware)
  - [Software:](#software)
  - [Cloud Services:](#cloud-services)
- [Connection Diagram:](#connection-diagram)
  - [Hardware Diagram:](#hardware-diagram)
  - [AWS Diagram:](#aws-diagram)
- [M5 Core2 AWS Setup:](#m5-core2-aws-setup)
  - [Main Code:](#main-code)
- [AWS Services:](#aws-services)
  - [Device Services:](#device-services)
    - [AWS IoT:](#aws-iot)
      - [Create a Thing:](#create-a-thing)
    - [AWS DynamoDB:](#aws-dynamodb)
    - [AWS IoT Rule:](#aws-iot-rule)
  - [WebPage Services:](#webpage-services)
    - [AWS Lambda:](#aws-lambda)
    - [AWS API Gateway:](#aws-api-gateway)
      - [Postman Test:](#postman-test)
      - [CORS:](#cors)
    - [AWS S3:](#aws-s3)
    - [AWS CloudFront:](#aws-cloudfront)
- [Final Product:](#final-product)
  - [Device:](#device)
  - [WebPage:](#webpage)
- [Field Test:](#field-test)
- [EPIC DEMO:](#epic-demo)

# Introduction:

COVID-19 has changed our daily lives and continues to do so. Many retail stores and companies have gone out of business, unable to offer their services to their clients. However some others which have opted for the reopening of their businesses in turn have had to adapt to the times.This includes public institutions such as museums, libraries, etc. All these establishments have taken their precautionary measures, generating new regulations, such as take the temperature at the entrance and maintain good ventilation inside.
 
Given this new environment, businesses have had to create new kinds of jobs or jobs to be done. One of these is to check the temperature of the customers before entering the establishment, risking not only the worker who is checking the temperature of the customers, but also the customers who enter the place.
 
This job generates an annual cost per worker of at least $30, 000 [1] and if that employee were to become ill with covid-19, by law (in the United States) they would have to pay him at least $511 a day [2].
These costs (both monetary and health wise) for an employee who performs a repetitive task is excessive but necessary, because the solutions currently created are not yet sufficient to replace this position.

1. https://www.ziprecruiter.com/Salaries/Retail-Security-Officer-Salary
2.https://www.dol.gov/sites/dolgov/files/WHD/posters/FFCRA_Poster_WH1422_Non-Federal.pdf

# Solution:



# Materials:

## Hardware:

1. M5Stack Core2 ESP32 IoT Development Kit for AWS IoT EduKit - [Product Link](https://shop.m5stack.com/collections/stack-series/products/m5stack-core2-esp32-iot-development-kit-for-aws-iot-edukit)
2. Infrared Temperature Sensor - [Product Link](https://www.amazon.com/dp/B071VF2RWM/ref=cm_sw_em_r_mt_dp_KEJ8WFJZ8B0FFXJ1XK6P?_encoding=UTF8&psc=1)
3. MQ135 - [Product Link](https://www.amazon.com/dp/B07L73VTTY/ref=cm_sw_em_r_mt_dp_2PFBGBTKYNTBXT1SCTFS)
4. Pycom Fipy or Lopy - [Product Link](https://pycom.io/product/fipy/)

## Software:

1. Arduino IDE - [Program Link](https://www.arduino.cc/en/software)
2. Arduino M5Core2 Library - [Library Link](https://github.com/m5stack/M5Core2)

## Cloud Services:

1. IoT Core - [Service Link](https://aws.amazon.com/iot-core/)
2. DynamoDb - [Service Link](https://aws.amazon.com/dynamodb/?nc2=type_a)
3. API Gateway - [Service Link](https://aws.amazon.com/api-gateway/?nc2=type_a)
4. Lambda - [Service Link](https://aws.amazon.com/lambda/?nc2=type_a)
5. CodeCommit - [Service Link](https://aws.amazon.com/codecommit/)
6. Amplify - [Service Link](https://aws.amazon.com/amplify/)

# Connection Diagram:

## Hardware Diagram:

<img src="./Images/hardware.png">

## AWS Diagram:

<img src="./Images/software.png">

# M5 Core2 AWS Setup:

El M5Core2 por fortuna para mi tiene muchos frameworks para poder programarlos, sin embargo ya que mi mayor conocimiento y code snippets los he realizado en el Arduino IDE, apoveche el soporte de Arduino del dispositivo para desarrollar mas eficientemente la solucion.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Arudino_Logo.svg/1200px-Arudino_Logo.svg.png">

Instala el soporte de las placas ESP32 y la libreria M5Core2 para empezar a trabajar con el Arduino IDE.

1. Arduino IDE - [Program Link](https://www.arduino.cc/en/software)
2. Arduino M5Core2 Library - [Library Link](https://github.com/m5stack/M5Core2)

Aunque el Arduino IDE viene ya con varios ejemplos para utilizar la placa, dejo varios codigos optimizados y mejorados para que te acostumbres a programar en esta placa.

[Test Sketches](https://github.com/altaga/BlueSpace/tree/main/Arduino%20Test%20Sketch)

Video:
[![DEMO](./Images/logo.png)](https://youtu.be/wViDAwuF3z8)

Advertencia: El compilado de el codigo en Arduino puede tardar hasta 5 min, no desesperes si la primera compilacion es tardada.

## Main Code:

El codigo principal de BlueSpace realiza lo siguiente:

<img src="./Images/softDiagram.png">

El utilizar un formato JSON tiene dos motivos principales:

1. Al realizar el escaneo de dispositivos de BT, es normal obtener dos o mas detecciones del mismo dispositivo, al guardarlo en JSON nos permite usar la Address como una Key, la cual eliminara las refrencias multiples.

        class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
            void onResult(BLEAdvertisedDevice advertisedDevice) {
              doc[getAddress(advertisedDevice.toString().c_str())][0] = advertisedDevice.getRSSI();
              // Device Address as a JSON Key
              doc[getAddress(advertisedDevice.toString().c_str())][1] = dist(advertisedDevice.getRSSI());
              // Saving the distance
              if (minDist >= dist(advertisedDevice.getRSSI())) {
                minDist = dist(advertisedDevice.getRSSI());
              }
            }
        };

2. En el Backend y en Frontend de la aplicacion el formato json permite una manipulacion y organizacion de datos mas sencilla.

// Realizar video en la barranca de BT para mostrar mejor el funcionamiento.

Para configurar las credenciales del archivo [certs.h](https://github.com/altaga/BlueSpace/blob/main/Arduino%20Code/BlueSpace/certs.h) favor de ir a la seccion [AWS IoT Thing Creation](#create-a-thing)

# AWS Services:

Todos los servicios de Cloud usados fueron exclusivamente de AWS para el desarrollo de la app, no necesitas experiencia previa para este tutorial, sin embargo recomendamos leer toda la documentacion de los servicios que vamos a utilizar para evitar que te confundas con algun termino.

[AWS All Link](#cloud-services)

Los servicios utilizados los dividi en dos grandes ramas, los servicios que utiliza el device principalmente y los servicios que utiliza la WebApp para consumir AWS.

## Device Services:

### AWS IoT:

Este servicio es principalmente destinado a poder comunicar a nuestro device de forma segura con AWS, esto se realiza mediante MQTTS, osea un servicio de suscripbion y publicacion de datos a traves de topicos.

<img src="https://www.luisllamas.es/wp-content/uploads/2019/02/protocolos-iot-pubsub.png">

En este caso nuestro device sera el publisher, como se puede ver en el codigo principal.

    client.publish(AWS_IOT_TOPIC, string2char(output1));

Para poder establecer la conexion correctamente con AWS se utiliza un sistema de 2 certificados y una private Key que identifican al device ante AWS cuando mandamos mensajes a un Endpoint en HTTPS.

<img src="./Images/mqtts.png">

#### Create a Thing:

Los pasos para poder crear una thing son actualmente muy sencillos, primero deberemos entrar al servicio AWS IoT Core desde AWS Management Console.

<img src="./Images/iot1.png">

Ahora crearemos nuestra thing, si es la primera vez que creas una no deberian aparecer things como se muestra en pantalla.

<img src="./Images/iot2.png">

Con AWS es posible crear toda una brigada de devices a la vez, sin embargo para este proyecto solo necesitaremos crear una.

<img src="./Images/iot3.png">

Como podemos ver en el siguiente menu, veremos que podemos configurar muchas caracteristicas de las things con el fin de poder crear categorias, permidos dintitos entre things, etc. Sin embargo solo le pondremos el nombre a nuestra thing y presionaremos next al fondo de la pantalla.

<img src="./Images/iot4.png">

Recomiendo ampliamente que dejen a AWS crear los certificarlos y gestionarlos, asi que dejamos la configuracion que nos ofrece AWS como recommended y presionamos Next.

<img src="./Images/iot5.png">

Para que nuestro device pueda mandar datos correctamente a AWS deberemos agregar una policy la cual permita esto correctamente.

<img src="./Images/iot6.png">

La policy que debemos implementar para este prototipo sin ninguna complicacion va a ser la siguiente.

<img src="./Images/iot7.png">

Al momento de crear la Thing AWS nos dara todos los certificados necesarios, descargalos todos.

<img src="./Images/iot8.png">

Con esto el unico dato que nos faltaria para configurar nuestro device seria el Endpoint de AWS, sin embargo ese se encuentra en la seccion de Settings.

<img src="./Images/iot9.png">

Asi deberas ver los datos llegar a tu monitor en AWS.

<img src="./Images/mqtt.gif">

### AWS DynamoDB:

Ya que podemos mandar datos a AWS, no podemos dejar que se desperdicien, los datos debemos analizarlos para poder hacer un exposure tracing posteriormente en nuestra app, asi que como primer paso iremos ahora al servicio de DynamoDB y crearemos una DB con las siguientes caracteristicas.

<img src="./Images/db1.png">

Nada mas tenemos que recordar el nombre de la DB para el siguiente paso.

<img src="./Images/db2.png">

### AWS IoT Rule:

La forma mas sencilla de poder almacenar los datos recibimos en la cloud de forma automatica, ser a travez de una IoT Rule, esta rule es una proceso que se ejecutara cada vez que recibamos un mensaje en nuestro Topic, como una funcion serverless. Para crear la rule deberemos ir la seccion de rules de AWS IoT.

<img src="./Images/rule1.png">

Crearemos nuestra rule solo colocando el name que queramos y poniendo en la seccion de Rule query statement lo siguiente.

<img src="./Images/rule2.png">

La rule requiere que configuremos una accion que ocurrira cada entrada de datos, para este caso sera la siguiente.

<img src="./Images/rule3.png">

Dentro de esta action la configuracion requerida sera la siguiente.

<img src="./Images/rule4.png">

Una vez terminemos esta configuracion, tendremos la accion de subir datos a la DB de forma automatica.

<img src="./Images/rule5.png">

## WebPage Services:

Ya que tenemos todos los servicios del device corriendo y mandando datos a nuestra DB, ahora debemos consumirlos en nuestra App para mostrar datos relevantes.

### AWS Lambda:

Como dice el [Connection Diagram](#connection-diagram) el primer paso para consumir la DB sera crear una lambda que realice una lectura de los datos, ademas ya que nuestra app debe de poder realizar lecturas por fecha, deberemos programar correctamente un scan de la DB.

En mi caso mi solucion fue utilizar python como Backend de la funcion lambda.

    import json
    import boto3
    from boto3.dynamodb.conditions import Key

    dynamodb = boto3.resource('dynamodb')

    def lambda_handler(event, context):
        
        table = dynamodb.Table("BlueSpace")
        try:
            response = table.scan(FilterExpression = Key('Time').gte(event["headers"]["first"]) & Key('Time').lte(event["headers"]["last"]))
            return(response['Items'])
        except:
            return("Error")

Notaremos que el codigo contiene la refrencia de event["headers]["ANY_LABEL"], esto hara que API Gateway pueda mandar las variables en los headers.

### AWS API Gateway:

Para poder consumir desde nuestra pagina web la funcion lambda, deberemos crear una API que podamos llamar desde la app.

<img src="./Images/api1.png">

Ponemos el nombre que querramos a nuestra API y le damos next hasta que se cree.

<img src="./Images/api2.png">

Una vez teniendo nuestra API, tendremos que crear una route, la cual va a ser el "path" al cual haras la llamada.

<img src="./Images/api3.png">

La integracion de Lambda en la API sera la siguiente.

<img src="./Images/api4.png">

NOTA: Al momento de agregar la integracion de Lambda a nuestra API Gateway, se configurara automaticamente los permisos.

#### Postman Test:

Para probar que esta funcionando nuestra API, usaremos algun software para probar el request como Postman. Si ponemos dos fechas en la API nos regresara nuestro escaneo como muestra la imagen.

<img src="./Images/api5.png">

#### CORS:

Ahora si queremos consumir en nuestra pagina web la API deberemos configurar el Cross-Origin Resource Sharing como se muestra en a imagen, la parte importante de esta configuracion es permitir nuestras paginas web como Origin autorizado.

<img src="./Images/api6.png">

NOTA: sin esto no podremos consumir la API desde la pagina web.

### AWS S3:

Para poder desplegar la web app a todo internet, deberemos crear un bucket S3, el cual se encargara de almacenar los achivos de la pagina web y realizar el static web site hosting.

<img src="./Images/s3-1.png">

Al ser una aplicacion echa con el framework de ReactJS, unicamente es necesario colocar los archivos dentro de el bucket arrastrandolos.

<img src="./Images/s3-2.png">

En la seccion de propiedades podremos activar el static website hosting, esto nos entregara un URL el cual podremos acceder desde cualquier parte del mundo, sin embargo para el despliegue de una aplicacion a produccion, solo esto NO es suficiente.

### AWS CloudFront:

Con este servicio podremos asegurar que nuestra pagina obtenga un certificado SSL y darnos los beneficios del [CDN](https://aws.amazon.com/cloudfront/?nc1=h_ls).

<img src="./Images/cdn.png">

Ya que este servicio funciona sin problema, podremos ver nuestra pagina web corriendo, con acceso a la api que creamos y con su certificado SSL.

<img src="./Images/cdn1.png">

Sientete libre de entrar a la pagina y explorar mi historico de exposicion a personas en mi dia a dia.

WebPage: https://d628z7yj7y4ti.cloudfront.net/

# Final Product:

## Device:
<img src="./Images/product1.jpg">
<img src="./Images/product2.jpg">

## WebPage:

<img src="./Images/cdn1.png" width="600px">
<img src="./Images/cdn2.png" width="200px">

# Field Test:

Para probar que el dispositivo funcionaba en un ambiente real, realice una prueba de campo con el device en mi visita semanal al supermercado.

[![FIELD](./Images/logo.png)](https://youtu.be/Wrq1BNmZRns)

# EPIC DEMO:

[![DEMO](./Images/logo.png)](https://youtu.be/gp_sZPsd5kc)