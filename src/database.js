const mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost/electrondb',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db=> console.log('DB is connected'))
    .catch(err => console.log(err));
