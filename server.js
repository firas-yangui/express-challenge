'use strict';

var express = require('express');
var myMethods = require('./myMethods.js');

var app = express();


/*to get body params*/
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*end body parser*/



app.get('/', function (req, res) {
  res.send('Welcome to the bikes express challenge, check the README.md for instructions!');
});

app.get('/bikes', function(req, res) {

	if(typeof req.query.price != 'undefined')
			{
				if (req.query.price.toUpperCase() == "US")
				{
  					return res.status(200).json((myMethods.convertJsonsFiel(myMethods.bikes)));
				}
			}
	return res.status(200).json((myMethods.bikes));
});

app.listen(3000, function () {
  console.log('Express challenge app listening on port 3000, check http://localhost:3000');
});


app.get('/bike/:id', function(req, res) {

	myMethods.getBikeById(req.params.id,function(err,bike){
		if(err)
		{
			res.status(500).send("No bike matching");
		}
		else
		{
			if(typeof req.query.price != 'undefined')
			{
				if (req.query.price.toUpperCase() == "US")
				{
					return res.status(200).json(myMethods.convertJsonFiel(bike));
				}
			}
		return res.status(200).json(bike); // nous pouvons utilisé .send	
		}
	});

});

//bikes with params
app.get('/bikec/', function(req, res) {
	
	//console.log(req.query.country);
	//console.log(req.query.price);

	if(typeof req.query.country != 'undefined')
	var tab = myMethods.getBikeByCountry(req.query.country);

	
	if(typeof req.query.price != 'undefined')
	{
		console.log("defined!");
		if (req.query.price.toUpperCase() == "US")
		{
		return res.status(200).json(myMethods.convertJsonsFiel(tab)); //on fait la conversion puisque la query params est US 
		}
	}

  	return res.status(200).json(tab);

});


app.delete('/bike/:id', function (req, res) {
	myMethods.getIndexBike(req.params.id,function(err,indexToRemove){
		if (err)
			{
				res.status(500);
				return res.send('Error 404: No bike found with id : '+req.params.id);
			}
			else
			{
				myMethods.bikes.splice(indexToRemove,1);
				return res.status(204).send();//status accepted!
			}
	});
});


app.put('/bikes', function(req, res) {
	
	var id = myMethods.getId(); //on genere l'id

	myMethods.bikeExiste(id,function(err){ //on test pour étre sur que l'id est unique!
		if (err) //normalement c'est un cas imposible!
		{
			res.send("Bike Existe!");
		}
		else
		{
			var name =req.body.name;
			var price =req.body.price;
			var country = req.body.country;
			//res.send("id " +id+ " name" + name+ " price " +price+ "country "+country);
			var bike = new myMethods.Bike(id,name,price,country);
			//res.status(202).send(req.body.id);
			//return res.status(200).json(Bike); // nous pouvons utilisé .send

			myMethods.bikes.push(bike);
			
			res.status(201).send(bike);
		}
	});
});

