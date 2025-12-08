# Proyecto Backend

    Este servicio se encuentra construido utilizando en nodeJS con ayuda de express y mongodb para la conexión de base de datos.

Antes de levantar el servidor, por favor tener presente que es necesario configurar las variables que se encuentran definidas en el archivo '.env' que es el lugar donde definimos nuestras variables de entorno. Es este caso se solicita configurar PORT, BASE_PATH, DATABASE_CONNECTION y el JWT_SECRET

## PORT
Este es el puerto en el cual se levanta el servidor, por ejemplo el puerto '3000'

## BASE_PATH
Este es el path base de nuestra aplicación, normalmente utilizador el api para decir que se expone un endPoint, seguido de la versión y finalmente el nombre de la aplicación. Esta es la base de todos los endPoints expuestos.

## DATABASE_CONNECTION
Este se para especificar el enlace de conexión para la base de datos mongoDB, es importante que sí se requiere poner usuario y contraseña, estos deben ir en este mismo enlace para que no falle la conexión, para este caso no se requiere autenticación.

**Importante:** 
Antes de intentar levantar la aplicación, por favor tener presentes que el servidor de la base de datos mongoDB debe estar arriba o sí no, no se podrá levantar la aplicación.

## JWT_SECRET
Este es el código secreto con el cual se firma el JWT, es importante que no se comparta con nadie, por temas de seguridad, para el caso demo y para levantarlo en local, puede trabajar con el mismo.

## Para levantar el servidor tenemos tres opciones:

* Pararse en la raíz del proyecto, es decir dentro de la carpeta backend y ejecutar el comando 'npm run start' esto llamará el script que fue configurado en el package.json para levantar el proyecto.

* La otra opción es pararse en el directorio view es decir ./backend/view y correr el comando 'node app.js', esto correrá el archivo app y levantará el servidor.

* O también puede correr el comando npm run start:dev para que levante el servidor con nodemon y esté atento escuchando los cambios que se realizan en tiempo real, este caso es para quién quiera evolucionar el backend.

**Nota:** Despues de levantada la aplicación, se puede realizar una petición get al endPoint de vida o salud, para verificar el estado de la aplicación
```
http://localhost:3000/api/v1/biblioteca-digital/health

```

Puedes encontrar ejemplos de uso de la API en el archivo [`biblioteca-digital.postman_collection.json`](../biblioteca-digital.postman_collection.json).
