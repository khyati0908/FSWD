import axios from 'axios';

export const fetchFrom = (path, params = {}) => axios.get(path, { params }).then(r => r.data);
