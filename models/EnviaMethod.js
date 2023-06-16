var request = require('request');
module.exports = {
    getQuote: async (req) => {

        return new Promise((resolve, reject) => {
            var carrier = req.body.btnCotizar;
            
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
                    "state": req.body.estadoOrigen,
                    "country": req.body.paisOrigen,
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
                    "state": req.body.estadoDestino,
                    "country": req.body.paisDestino,
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
                    'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
                },
                body: JSON.stringify(bodyJson)    
            };

            request(options, function (error, response) {
                var quotes = [];
                if (error) throw new Error(error);
                    json2 = JSON.parse(response.body);

                    console.log(json2);

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
                'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
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
                'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
            }
            };
            request(options, async function (error, response) {
                if (error) throw new Error(error);    
                resolve(JSON.parse(response.body));
            });  
        })
    }, 
    getQuotes: async (carriers, req) => {
        return new Promise( async (resolve, reject) => {
            var quotes = [];
            //req.body.btnGenerar
            for(var i = 0; i < carriers.length; i++){
                req.body.btnCotizar = carriers[i].name;
                quotes.push(await module.exports.getQuote(req));
            }
            resolve(quotes);  
        });
    }
};
