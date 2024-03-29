var request = require('request');
module.exports = {
    getQuote: async (req) => {

        return new Promise((resolve, reject) => {

            var carrier = req.body.btnCourier;
            var bodyJson = {
                "origin": {
                    "name": req.body.nombreOrigen,
                    "company": req.body.empresaOrigen,
                    "email": req.body.emailOrigen,
                    "phone": req.body.telefonoOrigen,
                    "street": req.body.calleOrigen,
                    "number": req.body.numeroOrigen,
                    "district": req.body.coloniaOrigen,
                    "city": req.body.ciudadOrigen,
                    "state": req.body.estadoCodOrigen,
                    "country": req.body.paisCodOrigen,
                    "postalCode": req.body.cpOrigen,
                    "reference": req.body.referenciaOrigen
                },
                "destination": {
                    "name": req.body.nombreDestino,
                    "company": req.body.empresaDestino,
                    "email": req.body.emailDestino,
                    "phone": req.body.telefonoDestino,
                    "street": req.body.calleDestino,
                    "number": req.body.numeroDestino,
                    "district": req.body.coloniaDestino,
                    "city": req.body.ciudadDestino,
                    "state": req.body.estadoCodDestino,
                    "country": req.body.paisCodDestino,
                    "postalCode": req.body.cpDestino,
                    "reference": req.body.referenciaDestino
                },
                "packages": [
                {
                    "content": req.body.contenido,
                    "amount": Number(req.body.cantidad),
                    "type": req.body.tipo,
                    "weight": Number(req.body.peso),
                    "insurance": Number(req.body.seguro),
                    "declaredValue": Number(req.body.valor),
                    "weightUnit": "KG",
                    "lengthUnit": "CM",
                    "dimensions": {
                        "length": Number(req.body.largo),
                        "width": Number(req.body.ancho),
                        "height": Number(req.body.alto)
                    }
                }
                ],
                "shipment": {
                "carrier": carrier,
                "type": 1
                },
                "settings": {
                "printFormat": "PDF",
                "printSize": "STOCK_4X6",
                "currency": "MXN",
                "cashOnDelivery": "500.00",
                "comments": ""
                }
            };
            var options = {
                'method': 'POST',
                'url': 'https://api-test.envia.com/ship/rate/',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 67874633b737c6f8fb636e019e33181fd0c46c15e169f530ae948e51295462a0'
                },
                body: JSON.stringify(bodyJson)    
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var quotes = [];
                json2 = JSON.parse(response.body);
                    if(json2.meta === "rate" && typeof json2.data === "object"){
                        for(var j = 0; j < json2.data.length; j++)
                        {
                            if(json2.data[j].carrier !== "")
                                quotes.push({
                                    carrier: json2.data[j].carrier,
                                    service: json2.data[j].service,
                                    deliveryEstimate: json2.data[j].deliveryEstimate,
                                    totalPrice: json2.data[j].totalPrice
                                });
                        }
                        resolve(quotes);
                    }
                    resolve([{carrier: "No disponible", service: "No disponible", deliveryEstimate: "No disponible", totalPrice: "No disponible"}]);
                }
                );
        });
    },
    getServices: async () => {
        return new Promise((resolve, reject) => {
            var options = {
            'method': 'GET',
            'url': 'https://queries-test.envia.com/available-service/MX/0/1',
            'headers': {
                'Authorization': 'Bearer 67874633b737c6f8fb636e019e33181fd0c46c15e169f530ae948e51295462a0'
            }
            };
            request(options, async function (error, response) {
                if (error) throw new Error(error);    
                resolve(JSON.parse(response.body));
            });  
        })
    },
    getCouriers: async () => {
        return new Promise((resolve, reject) => {
            var options = {
            'method': 'GET',
            'url': 'https://queries-test.envia.com/available-carrier/MX/0',
            'headers': {
                'Authorization': 'Bearer 67874633b737c6f8fb636e019e33181fd0c46c15e169f530ae948e51295462a0'
            }
            };
            request(options, async function (error, response) {
                if (error) {
                    console.log(error);
                    reject(error);
                }    
                else resolve(JSON.parse(response.body));
            });  
        })
    }, 
    getQuotes: async (req) => {
        carriers = JSON.parse(req.body.couriers);
        return new Promise( async (resolve, reject) => {
            var quotes = [];
            //req.body.btnGenerar
            for(var i = 0; i < carriers.length; i++){
                req.body.btnCourier = carriers[i].name;
                quotes.push(await module.exports.getQuote(req));
            }
            resolve(quotes);  
        });
    }
};
