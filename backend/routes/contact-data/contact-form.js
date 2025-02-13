var express = require('express');
var router = express.Router();

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const Contact = require('../../model/contactform'); // Contact DataBase Table

//Contact Form Data API
router.post('/contactformdata',function(req,res,next){
  var contactdata = {
    Contact_name: req.body.name,
    Contact_email: req.body.email,
    Contact_number: req.body.contactnumber,
    Contact_msg: req.body.message
  };
  var result = new Contact(contactdata);
  result.save()
  .then(contactdata => {
    res.send(JSON.stringify({ "flag": 1, "data": contactdata }));
  })
  .catch(err => {
    // console.log("Error",err);
    res.status(500).send('NetWork Error');
  });
});

//Display Contact Form Data
router.get('/displaycontactform',apiKeyMiddleware, (req, res) => {
  // Fetch all products from the database (or return a static array for now)
  Contact.find()
    .sort({ contact_time: -1 })
    .then(Contacts => {
      res.status(200).json(Contacts); // Send product data to the frontend
    })
    .catch(err => {
      res.status(500).send();
    });
});

module.exports = router;