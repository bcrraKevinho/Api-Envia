module.exports = {

    tracking: (req, res) => {
        var axios = require('axios');
        var data = '{\n\t"trackingNumbers":[\n\t"794636769127",\n\t"075580780"\n\t]\n}';

        var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api-test.envia.com/ship/generaltrack/',
        headers: { },
        data : data
        };

        axios(config)
        .then(function (response) {
        datos = response.data;
        //console.log(JSON.stringify(datos));
        })

        .catch(function (error) {
        console.log(error);
        });
        res.render('tracking', {
        });
    },

    create: (req, res) => {
        var data = JSON.stringify({
            "origin": {
                "name": "Mexico",
                "company": "Envia",
                "email": "mexico@envia.com",
                "phone": "8180162137",
                "street": "vasconcelos",
                "number": "1400",
                "district": "jardines de mirasierra",
                "city": "ensenada",
                "state": "nl",
                "country": "MX",
                "postalCode": "22785",
                "reference": "",
                "coordinates": {
                "latitude": "25.655552",
                "longitude": "-100.397811"
                }
            },
            "destination": {
                "name": "Mexico",
                "company": "Envia",
                "email": "mexico@envia.com",
                "phone": "8180100135",
                "street": "belisario dominguez",
                "number": "2470 of 310",
                "district": "obispado",
                "city": "monterrey",
                "state": "nl",
                "country": "MX",
                "postalCode": "64060",
                "reference": "",
                "coordinates": {
                "latitude": "25.672530",
                "longitude": "-100.348120"
                }
            },
            "packages": [
                {
                "content": "zapatos",
                "amount": 1,
                "type": "box",
                "weight": 1,
                "insurance": 0,
                "declaredValue": 0,
                "weightUnit": "KG",
                "lengthUnit": "CM",
                "dimensions": {
                    "length": 11,
                    "width": 15,
                    "height": 20
                }
                }
            ],
            "shipment": {
                "carrier": "estafeta",
                "type": 1
            },
            "settings": {
                "printFormat": "PDF",
                "printSize": "STOCK_4X6",
                "currency": "MXN",
                "cashOnDelivery": "500.00",
                "comments": ""
            }
            });
        console.log(data);

        res.render('create', {
        });
    },

    update: (req, res) => {
        var axios = require('axios');
        var data = '{\n\t"trackingNumbers":[\n\t"794636769127",\n\t"075580780"\n\t]\n}';

        var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api-test.envia.com/ship/generaltrack/',
        headers: { },
        data : data
        };

        axios(config)
        .then(function (response) {
        datos = response.data;
        console.log(JSON.stringify(datos));
        })

        .catch(function (error) {
        console.log(error);
        });

        res.render('update', {
        });
    },

    remove: (req, res) => {
        var axios = require('axios');
        var data = '{\n\t"trackingNumbers":[\n\t"794636769127",\n\t"075580780"\n\t]\n}';

        var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api-test.envia.com/ship/generaltrack/',
        headers: { },
        data : data
        };

        axios(config)
        .then(function (response) {
        datos = response.data;
        console.log(JSON.stringify(datos));
        })

        .catch(function (error) {
        console.log(error);
        });

        res.render('remove', {
        });
    }

};