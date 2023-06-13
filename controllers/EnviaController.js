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
                        console.log(response.body);
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
                        "carrier": "fedex",
                        "service": "express",
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
                console.log(response.body);

                res.render('create', 
                {page_name: "create", color: "success", 
                req: req.body, res: response.data.data, 
                disabled: "disabled", modal: "<script>$(window).on('load', function() {$('#exampleModal').modal('show');});</script>"});
              });
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