import { IList } from '../store/ITaskList/reducer';
import socket from './socket';

const handleEmmitterAndUpdatedListsShared = (data: IList) => {
  socket.emit('sharedList', data);
};

export { handleEmmitterAndUpdatedListsShared };
