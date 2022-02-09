const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const sequelizestore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers');
const sequelize = require('./config/connection');
const customUtils = require('./utils/customUtils');

const exp = express();
const PORT = process.env.PORT || 3001;


const sess = {
    secret: 'Posilutely top secret string',
    cookie: {
        sameSite: 'strict',
    },
    resave: false,
    saveUnitialized: true,
    store: new sequelizestore({
        db: sequelize,
    }),
};

exp.use(session(sess));

const hbs = exphbs.create({ customUtils });

exp.engine('handlebars', hbs.engine);
exp.set('view engine', 'handlebars');

exp.use(express.json());
exp.use(express.urlencoded({ extended: true}));
exp.use(express.static(path.join(__dirname, 'public')));

exp.use(routes);

sequelize.sync({ force: false}).then(() => {
    exp.listen(PORT, () => console.log(`Server live at: http://localhost:${PORT}`));
});