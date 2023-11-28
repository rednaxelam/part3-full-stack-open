import axios from 'axios';
const baseURL = 'https://fso-part-3-backend.fly.dev/api/persons';

const createContact = newContact => {
  return axios.post(baseURL, newContact).then(response => response.data);
}

const getAll = () => {
  return axios.get(baseURL).then(response => response.data);
}

const deleteContact = contact => {
  axios.delete(`${baseURL}/${contact.id}`);
  return;
}

const amendContactNumber = (contact, newNumber) => {
  const newContact = {...contact, number: newNumber};
  return axios.put(`${baseURL}/${contact.id}`, newContact).then(response => response.data);

}

export default {createContact, getAll, deleteContact, amendContactNumber};