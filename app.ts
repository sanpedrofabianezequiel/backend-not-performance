import env from 'dotenv';
import {Server} from './entity/server';
env.config();

const server =  new Server();
server.listen();
