const { name } = require('ejs');

module.exports = {
    
    tracking: (req, res) => {      
        res.render('tracking', { page_name: "tracking", color: "primary"
        });
    },

    showTracking: (req, res) => {
        var axios = require('axios');
        var data = '{\n\t"trackingNumbers":[\n\t"'+ req.query.trackingNumber +'"\n\t]\n}';
        var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api-test.envia.com/ship/generaltrack/',
        headers: { },
        data : data
        };

        axios(config)
        .then(function (response) {
        res.render('showTracking', { envio: response.data.data, page_name: "tracking", color: "primary" });
        })
        .catch(function (error) {
        console.log(error);
        });
    },

    search: (req, res) => {      
        res.render('search', { page_name: "search", color: "primary"
        });
    },

    showSearch: (req, res) => {
        var request = require('request');
        var options = {
        'method': 'GET',
        'url': 'http://queries-test.envia.com/guide/' + req.query.trackingNumber,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
          }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            res.render('showSearch', { envio: JSON.parse(response.body).data, page_name: "search", color: "primary" });
        });

    },

    create: (req, res) => {
                
        if(req.method == 'GET'){
            switch(req.query.submit){
                case "update":

                    var request = require('request');
                    var options = {
                    'method': 'GET',
                    'url': 'http://queries-test.envia.com/guide/'+ req.query.trackingNumber,
                    'headers': {
                        'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
                    }
                    };
                    request(options, function (error, response) {
                    if (error) throw new Error(error);
                        res.render('create', {page_name: "update", color: "primary", req: response.body.data});
                    });
                    break;
                case "remove":
                    res.render('create', {page_name: "remove", color: "danger", req: req.body, 
                    disabled: "disabled",});
                    break;
                default:
                    res.render('create', {page_name: "create", color: "success"});
            }
            
        }

        if(req.method == 'POST'){    
            var request = require('request'); 
            //Generar guía
            if(typeof req.body.btnGenerar !== "undefined"){ 
                var carrier = req.body.btnGenerar.split(",")[0];
                var service = req.body.btnGenerar.split(",")[1];
                
                var options = {
                    'method': 'POST',
                    'url': 'https://api-test.envia.com/ship/generate/',
                    'headers': {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
                    },
                    body: JSON.stringify({
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
                            "dimensions": {
                                "length": Number(req.body.largo),
                                "width": Number(req.body.ancho),
                                "height": Number(req.body.alto)
                            },
                            "weight": Number(req.body.peso),
                            "insurance": Number(req.body.seguro),
                            "declaredValue": Number(req.body.valor),
                            "weightUnit": "KG",
                            "lengthUnit": "CM"
                            }
                        ],
                        "shipment": {
                            "carrier": carrier,
                            "service": service,
                            "type": 1
                        },
                        "settings": {
                            "printFormat": "PDF",
                            "printSize": "STOCK_4X6",
                            "comments": "comentarios de el envío"
                        }
                    })
                };
                
                request(options, function (error, response) {
                    if (error) throw new Error(error);
                    res.render('create', 
                    {page_id: "1", page_name: "create", color: "success", 
                    req: req.body, label: JSON.parse(response.body).data, 
                    disabled: "disabled", modal_title: "Guía generada con éxito",
                    modal: "<script>$(window).on('load', function() {$('#exampleModal').modal('show');});</script>"});
                  });
                return;
            }
            //Cotizar
            else {
                async function getQuote(carrier){ //Cotiza con una empresa
                    return new Promise((resolve, reject) => {
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
                    });}

                async function getQuotes(){ //Cotiza con todas las empresas
                    return new Promise((resolve, reject) => {
                        var options = {
                        'method': 'GET',
                        'url': 'https://queries-test.envia.com/available-carrier/MX/0',
                        'headers': {
                            'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
                        }
                        };
                        request(options, async function (error, response) {
                            var quotes = [];
                            if (error) throw new Error(error);    
                            json = JSON.parse(response.body);
                            for(var i = 0; i < json.data.length; i++){
                                quotes.push(await getQuote(json.data[i].name));
                            }
                            resolve(quotes);
                        });  
                    })};
                
                getQuotes().then((quotes) => { //Renderiza la vista con las cotizaciones
                    res.render('create', 
                    {page_name: "create", color: "success", 
                    req: req.body, quotes: quotes, modal_title: "Cotizaciones para tu envío",
                    modal: "<script>$(window).on('load', function() {$('#exampleModal').modal('show');});</script>"});
                });
            }
        }
    },

    update: (req, res) => {
        res.render('update', { page_name: "update", color: "secondary"
        });
    },

    remove: (req, res) => {
        res.render('remove', { page_name: "remove", color: "danger"
        });
    }

};