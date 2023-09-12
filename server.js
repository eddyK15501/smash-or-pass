const express = require('express');
const path = require('path');
const session = require('express-session');
const handlebars = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'todolist secret session key',
  cookie: {
    //   maxAge: 30000 * 6,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUnitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

const hbs = handlebars.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log('Listening on Port 3001');
  });
});
