var express = require('express');
var router = express.Router();

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 
const ContactInformation = require('../../model/contactinfomation');  

//add contact information
router.post('/contact-info', async (req, res) => {
    try {
      const { Info_contact, Info_email, Info_address } = req.body;
  
      // Validate if data is provided (if you want additional checks, add them here)
      if (!Info_contact || !Info_email || !Info_address) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Create a new contact entry
      const newContactInfo = new ContactInformation({
        Info_contact,
        Info_email,
        Info_address,
      });
  
      // Save to the database
      await newContactInfo.save();
      res.status(201).json({ message: 'Information added successfully' });
  
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  });
  
  // PUT Route to update contact info by ID
  router.put('/contact-info/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Info_contact, Info_email, Info_address } = req.body;
  
    try {
      const contact = await ContactInformation.findById(id);
  
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      // Update the contact info
      contact.Info_contact = Info_contact || contact.Info_contact;
      contact.Info_email = Info_email || contact.Info_email;
      contact.Info_address = Info_address || contact.Info_address;
  
      await contact.save();
  
      res.status(200).json({ message: 'Contact information updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating contact information', error: error.message });
    }
  });
  
  //Display Contact Infomation
  router.get('/contact-info-display',apiKeyMiddleware, async (req, res) => {
    try {
      const data = await ContactInformation.find(); // Fetch all documents
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  });
  
  //Edit Pre Bulit Value
  router.get('/contact-info/:id',apiKeyMiddleware, async (req, res) => {
    const { id } = req.params;
  
    try {
      const contact = await ContactInformation.findById(id);
  
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      res.status(200).json(contact); // Send the specific contact info
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contact information', error: error.message });
    }
  });

  //Limited Display
router.get('/contact-info-display-limit', apiKeyMiddleware, async (req, res) => {
    try {
      // Fetch only 1 latest document sorted by createdAt in descending order
      const data = await ContactInformation.find()
        .sort({ createdAt: -1 }) // Sort by creation date in descending order (newest first)
        .limit(1); // Limit the results to 1
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  });

module.exports = router;