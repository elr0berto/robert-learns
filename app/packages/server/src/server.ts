import express, {NextFunction, Request, Response} from 'express';
import signIn from './routes/sign-in.js';
import signOut from "./routes/sign-out.js";
import signUp from './routes/sign-up.js';
import workspaces from './routes/workspaces.js';
import workspaceUsers from './routes/workspace-users.js';
import cardSets from './routes/card-sets.js';
import cardSetLinks from "./routes/card-set-links.js";
import cardSetCards from './routes/card-set-cards.js';
import media from './routes/media.js';
import cards from './routes/cards.js';
import users from './routes/users.js';
import logs from './routes/logs.js';
import drills from './routes/drills.js';
import drillRuns from './routes/drill-runs.js';
import drillCardSets from './routes/drill-card-sets.js';

import session from './session.js';
import logger from "./logger.js";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import {TypedResponse} from "./common.js";
import {GetVersionResponseData} from "@elr0berto/robert-learns-shared/api/version";
import {RL_SERVER_VERSION} from "./version.js";
import {RL_SHARED_VERSION} from "@elr0berto/robert-learns-shared/version";

import GoogleTokenStrategy from 'passport-google-id-token';
import FacebookTokenStrategy from 'passport-facebook-token';
import passport from 'passport';

class Server {
    public express;

    constructor() {
        this.express = express();

        this.setupPassport();
        this.middlewares();
        this.routes();
        this.setupErrorHandler();
    }

    setupPassport() {
        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new Error('GOOGLE_CLIENT_ID is not set in the environment (.env)');
        }
        if (!process.env.FACEBOOK_APP_ID) {
            throw new Error('FACEBOOK_APP_ID is not set in the environment (.env)');
        }
        if (!process.env.FACEBOOK_APP_SECRET) {
            throw new Error('FACEBOOK_APP_SECRET is not set in the environment (.env)');
        }
        passport.use(new GoogleTokenStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
            },
            (parsedToken, googleId, done) => {
                const user = {
                    email: parsedToken.payload.email,
                    name: parsedToken.payload.name,
                    givenName: parsedToken.payload.given_name,
                    familyName: parsedToken.payload.family_name,
                    googleId: googleId,
                };

                return done(null, user);
            }
        ));
        passport.use(new FacebookTokenStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
            },
            async (_accessToken: string, _refreshToken: string, profile, done) => {
                try {
                    // Handle user based on Facebook profile
                    const user = {
                        facebookId: profile.id,
                        email: profile.emails[0]?.value,
                        name: profile.displayName,
                    };

                    // You can perform database operations or further user validation here
                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        ));
    }
    middlewares() {

        this.express.use(passport.initialize());
        this.express.use(session)
        this.express.use(express.json());
    }

    routes() {
        this.express.use('/api/logs', logs);
        this.express.use('/api/sign-in', signIn);
        this.express.use('/api/sign-out', signOut);
        this.express.use('/api/sign-up', signUp);
        this.express.use('/api/workspaces', workspaces);
        this.express.use('/api/workspace-users', workspaceUsers);
        this.express.use('/api/card-sets', cardSets);
        this.express.use('/api/card-set-links', cardSetLinks);
        this.express.use('/api/card-set-cards', cardSetCards);
        this.express.use('/api/media', media);
        this.express.use('/api/cards', cards);
        this.express.use('/api/users', users);
        this.express.use('/api/drills', drills);
        this.express.use('/api/drill-runs', drillRuns);
        this.express.use('/api/drill-card-sets', drillCardSets);
        this.express.use('/api/version', (_: Request, res: TypedResponse<GetVersionResponseData>) => {
            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                version: RL_SERVER_VERSION,
                versionShared: RL_SHARED_VERSION,
            });
        })
    }

    setupErrorHandler() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.express.use((err: Error, req: Request, res: Response, _: NextFunction) => {  // this needs to be 4 params to be an error handler.......
            logger.error(`${req.method} - ${req.url} - ${err.message}`);

            const response : BaseResponseData = {
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: null,
            }
            return res.json(response);
        });
    }
}

const server = new Server();
console.log('starting to listen on port 3333');
server.express.listen(3333);