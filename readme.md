# Lineauno bot

Puedes obtener los proximos horarios de una estacion del metro de Lima, Linea Uno

# Slack

![](https://media.giphy.com/media/13ntPEg7GKf08E/giphy.gif)

# Requisitos

* Node >=4

# Instalacion
* npm install

# Configuracion

Configurar las siguientes variables en un archivo .env en la raiz del proyecto, como ejemplo puede tomar el archivo .env.example

* Aplicacion
    - APP_PORT = 3000
    - APP_HOST = localhost
    
* Slack
    - Crear nueva aplicacion
    - Configurar slash command, con la URL del servidor
    - Habilitar interactive messages

# Ejecucion
* npm start


# Datos

Los datos se obtiene de la siguiente web: http://www.lineauno.pe/horarios/, para obtener los datos en formato json simplemente
ejecutar el script initdata.js que esta dentro del folder scripts
 
