import lodash from 'lodash';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './models/sql/user';

const UNAUTH_URLS = [
  '/member/login',
];

export const initializePassport = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    if (UNAUTH_URLS.indexOf(req.path) > -1) {
      return next();
    } if (req.isAuthenticated()) {
      return next();
    }

    return res.status(401).send({ error: 'unauthorized' }).end();
  });

  passport.use(new LocalStrategy(
    ((username, password, done) => {
      User.findOne({
        where: {
          username,
          password,
        },
      }).then((user) => {
        if (!user) {
          return done(null, false);
        }

        return done(null, lodash.pick(user, ['uuid', 'username', 'firstname', 'lastname']));
      });
    }),
  ));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
