const express = require('express');
const router = express.Router();
const { isLogged } = require('../helpers/auth');
const Contact = require('../model/Contacts');
const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const { route } = require('.');

router.get('/contacts', isLogged, async (req, res) => {
    const contacts = await Contact.find({ user: req.user._id }).lean();

    contacts.forEach(element => {
        if (element.img == '') {
            element.img = 'contact.png';
        }
    });

    res.render('contacts/contacts', { contacts });
});

router.get('/contacts/add', isLogged, (req, res) => {
    res.render('contacts/add');
});

router.post('/contact/add', isLogged, async (req, res) => {
    const { name, lastname, tel1, tel2, email, img } = req.body;
    let imgFullName;

    if (req.file === undefined) {
        imgFullName = '';
    } else {
        const imgName = randomNumber();
        const imgPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const destinyPath = path.resolve(`src/public/img/contacts/${imgName}${ext}`);

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            await fs.rename(imgPath, destinyPath);
        }

        imgFullName = imgName + ext;
    }

    const newContact = new Contact({ name, lastname, tel1, tel2, email });
    newContact.user = req.user._id;
    newContact.img = imgFullName //imgName + ext;
    newContact.save();
    res.redirect('/contacts');

});

router.get('/contact/edit/:id', isLogged, async (req, res) => {
    const contact = await Contact.findById(req.params.id).lean();

    if (contact.img == '') {
        contact.img = 'contact.png';
    }

    res.render('contacts/edit', { contact });
});

router.post('/contact/edit/:id', isLogged,  async (req, res) => {
    const { name, lastname, tel1, tel2, email, change_photo } = req.body;

    if (change_photo == 1) {
        const contact = await Contact.findById(req.params.id);

        if (!contact.img == '') {
            await fs.unlink(`src/public/img/contacts/${contact.img}`);
        }

        const imgName = randomNumber();
        const imgPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const destinyPath = path.resolve(`src/public/img/contacts/${imgName}${ext}`);

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            await fs.rename(imgPath, destinyPath);
        }

        const img = imgName + ext;
        await Contact.findByIdAndUpdate(req.params.id, { name, lastname, tel1, tel2, email, img });

    } else {
        await Contact.findByIdAndUpdate(req.params.id, { name, lastname, tel1, tel2, email });
    }

    res.redirect('/contacts');
});

router.get('/contact/delete/:id', isLogged, async (req, res) => {

    const contact = await Contact.findById(req.params.id);

    if (!contact.img == '') {
        fs.unlink(`src/public/img/contacts/${contact.img}`);
    }

    await Contact.findByIdAndRemove(req.params.id);
    res.redirect('/contacts');
})

module.exports = router; 