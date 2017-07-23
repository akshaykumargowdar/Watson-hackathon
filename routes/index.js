var express = require('express');
var fs = require('file-system');
var request = require('request');
var http = require('http');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');

var Client = require('node-rest-client').Client;

var client = new Client();
var watson = require('watson-developer-cloud');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');


var conversation1 = watson.conversation({
  username: '9a594ea6-5a4c-463f-bff3-6b4bfe096aca',
  password: 'blklWZskG5SE',
  version: 'v1',
  version_date: '2017-04-14'
});

var client = require('twilio')(
  "AC6ec6ebb0c35d2c08b6f10b52934e9e31",
  "c010b47b360849f83545ba15207e01c6"
);


var context1 = {};
var db = monk('localhost:27017/CapitalMarket');

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

var discovery = new DiscoveryV1({
  username: '8689e85f-9170-4b0d-bef2-a97537bc6d3a',
  password: '77Kyhph1i1HV',
  version_date: '2016-12-01'
});


router.post('/News',function(req,res){
	discovery.query({
						environment_id: '2ee9372d-06b4-4d8b-aa3e-39fef53f9dba',
						collection_id : 'de89f4d2-eda6-4d2d-9bed-e626de244ee8',
						  "count": 5,
						  "return": "title,enrichedTitle.text,url,host,blekko.chrondate",
						  "query": req.body.company +",language:english",
						  "aggregations": [
							"nested(enrichedTitle.entities).filter(enrichedTitle.entities.type:Company).term(enrichedTitle.entities.text)",
							"nested(enrichedTitle.entities).filter(enrichedTitle.entities.type:Person).term(enrichedTitle.entities.text)",
							"term(enrichedTitle.concepts.text)",
							"term(blekko.basedomain).term(docSentiment.type)",
							"term(docSentiment.type)",
							"min(docSentiment.score)",
							"max(docSentiment.score)",
							"filter(enrichedTitle.entities.type::Company).term(enrichedTitle.entities.text).timeslice(blekko.chrondate,1day).term(docSentiment.type)"
						  ],
						  "filter": "blekko.hostrank>20,blekko.chrondate>1495564200,blekko.chrondate<1496169000"

					}, function(error, data) {
					  res.send(JSON.stringify(data, null, 2));
					});
});




router.get('/cmfirstcall', function(req, res, next) {	
  					conversation1.message({
  					workspace_id: '81bad9c9-4e87-4ad1-884c-0d8f5e572de0',
  				 	input: {'text': "" },
  						
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{
										  context1 = response.context;
										 
										  res.send(response.output);										  
										}
									     })
					});


router.post('/cmconsecutivecalls', function(req, res) {
					console.log("request received");
					conversation1.message({
  					workspace_id: '81bad9c9-4e87-4ad1-884c-0d8f5e572de0',
  				 	input: {'text': req.body.question },
  						context: context1
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{	
											context1 = response.context;
											res.send(response);
											
										}
						});
});


 router.post('/send',function(req,res){
	 
	 
client.messages.create({
  from: "+17737886740",
  to: "+918105223593",
  body: req.body.message
}, function(err, message) {
  if(err) {
    console.error(err.message);
  }
});
 });
 
 router.get('/getdata',function(req,res){
		request('https://e2b889e6-f721-4e06-aadf-aa170846c76a-bluemix.cloudant.com/iotp_29m8ko_default_2017-w22/_all_docs?include_docs=true&descending=true', function (error, response, body) {
		res.send(body); // Print the HTML for the Google homepage. 
	});
});

router.get('/', function(req,res,next){
res.render('index');
});




module.exports = router;
