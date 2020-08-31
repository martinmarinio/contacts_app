const mongoose =  require('mongoose');

mongoose.connect('mongodb://localhost/app-db', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(db => console.log('Conectado a DB'))
.catch(err => console.error(err));