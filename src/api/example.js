import axios from './httpHandler'
const baseURL = '/api/v1/user'

export function humanCode(param) {
  return axios.post(`${baseURL}/huamn-code`, param)
}

export default {}
