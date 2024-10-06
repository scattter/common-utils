import {io, Socket} from 'socket.io-client';
import { ListenEventsMap, EmitEventsMap } from "../interfaces";

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://10.10.8.50:3000';

export const socket: Socket<ListenEventsMap, EmitEventsMap> = io(URL, {
  timeout: 5000,
  autoConnect: false,
});