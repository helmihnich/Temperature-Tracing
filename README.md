                                                      Temperature-Tracing


For this project we have 2 parts:

-- ESP32 CODE --

for the esp32 code you have change : 


*   WIFI Configuration:
const char* ssid and const char* password 


*   notify my device (application) configurations:
const String endpoint and const String key

*   The http url's IP adress of the backend (line 142 - line 188)




-- WebSite CODE --

for the backend :

*   Node js is required.. 

*   mongo is requiredd..

*   In the code repository run :
    
        npm init
        npm install body-parser express socket_io http socket.io-client moment ejs mongoose
        npm install --save-dev nodemon

*   Initialization "# after you get the log message in the terminal you can exit"

        node seuil.js
        node database.js    


launch the website

        npm run server
