const { name } = require('ejs');

module.exports = {
    
    tracking: (req, res) => {     
        error = "";
        if(typeof req.query.error !== "undefined")
            error = "No se encontró el envío"; 
        res.render('tracking', { page_name: "tracking", color: "primary", error: error
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
            if(response.data.data.length) res.render('showTracking', { envio: response.data.data, page_name: "tracking", color: "primary" });
            else res.redirect('/?error=1');
        })
        .catch(function (error) {
        console.log(error);
        });
    },
    
    shippings: (req, res) => {     
        var request = require('request');
        var options = {
        'method': 'GET',
        'url': 'https://queries-test.envia.com/guide/06/2023',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 51b7a0483cecd5ab66d9dffdf3c62d4d90128ec6b91a6087328f100ca71bc514'
        }
        };
        request(options, function (error, response) {
        if (error) throw new Error(error);
            res.render('shippings', { page_name: "shippings", color: "primary", shippings: JSON.parse(response.body).data
            });
        });
    },

    search: (req, res) => {      
        error = "";
        if(typeof req.query.error !== "undefined")
            error = "No se encontró el envío"; 
        res.render('search', { page_name: "search", color: "primary", error: error
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
            envio = JSON.parse(response.body).data
            if(envio.length)
                res.render('showSearch', { envio: JSON.parse(response.body).data, page_name: "search", color: "primary" });
            else
                res.redirect('/search?error=1');
        });

    },

    create: (req, res) => {
        var request = require('request');
        const EnviaMethod = require("../models/EnviaMethod");

        if(req.method == 'GET'){
            switch(req.query.submit){
                case "update":
                    res.render('create', {page_name: "update", color: "primary", req: response.body.data});
                    break;
                case "remove":
                    res.render('create', {page_name: "remove", color: "danger", req: req.body, 
                    disabled: "disabled",});
                    break;
                default:
                    error = "";
                    if(typeof req.query.error !== "undefined")
                        error = "No se encontró el envío"; 
                    EnviaMethod.getCouriers().then((couriers) => { //Renderiza la vista con las empresas disponibles
                        
                        //Filtrar empresas no deseadas
                        couriers.data = couriers.data.filter(function(item) {
                            var couriersBlacklist = ['sendex','paquetexpress','noventa9Minutos','ivoy', 'carssa', 'quiken', 'dostavista', 'almex', 'fletesMexico', 'entrega', 'exxprezo', 'mensajerosUrbanos', 'scm', 'amPm', 'treggo', 'uruz', 'jtexpress', 'bigLogistics']
                            
                            return !couriersBlacklist.includes(item.name);
                        })
                        
                        res.render('create', {page_name: "create", color: "success", couriers: couriers.data, error: error});
                    });
            }
        }
        if(req.method == 'POST'){       
            //Generar guía
            couriers = JSON.parse(req.body.couriers);
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
                    console.log(req.body);
                    res.render('create', 
                    {page_id: "1", page_name: "create", color: "success", 
                    req: req.body, label: JSON.parse(response.body).data, 
                    disabled: "disabled", modal_title: "Guía generada con éxito",
                    modal: "<script>$(window).on('load', function() {$('#exampleModal').modal('show');});</script>"});
                  });
                return;
            }
            //Cotizar guía
            else if (typeof req.body.btnCotizar !== "undefined") {
                if(req.body.btnCotizar == "todos"){

                    EnviaMethod.getQuotes(couriers,req).then((quotes) => { //Renderiza la vista con las cotizaciones
                        
                        console.log(quotes);
                        res.render('create', 
                        {page_name: "create", color: "success", 
                        req: req.body, couriers: couriers, quotes: quotes, modal_title: "Cotizaciones para tu envío",
                        modal: "<script>$(window).on('load', function() {$('#exampleModal').modal('show');});</script>"});
                    });
                }
                else{
                    EnviaMethod.getQuote(req).then((quote) => { //Renderiza la vista con las cotizaciones
                        console.log(req.body);
                        
                        if(quote[0].carrier === "No disponible")
                            res.render('create', 
                            {page_name: "create", color: "success", 
                            req: req.body, quote: '', modal_title: '',
                            modal: '', error: "No se encontró cotización"});
                        else
                            res.render('create', 
                            {page_name: "create", color: "success",
                            req: req.body, quote: quote, modal_title: "Cotizaciones para tu envío",
                            modal: "<script>$(window).on('load', function() {$('#exampleModal').modal('show');});</script>"});
                    });
                }
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