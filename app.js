const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.mail;

  console.log(firstName,lastName,email);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/d669062b3a";

  const options={
    method: "post",
    auth: "k:edafce140beec9f8652013d990ca77aa-us8"
  };

  const request = https.request(url,options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/public/success.html");
    } else {
      res.sendFile(__dirname + "/public/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
request.write(jsonData);

request.end();

});



app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server Started at port 3000");
});

//d669062b3a
//edafce140beec9f8652013d990ca77aa-us8
