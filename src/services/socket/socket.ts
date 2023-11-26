import io from 'socket.io-client';
import { token } from '../../config/index.json';

// const socket = io('http://192.168.0.115:3002');
const socket = io('https://socket.dashboardsb2b.com.br');

socket.emit('auth', token);

export default socket;
