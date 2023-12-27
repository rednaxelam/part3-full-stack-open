import { useEffect, useState } from 'react';
import ContactList from './components/ContactList';
import HTag from './components/HTag';
import TextualInputDefault from './components/TextualInputDefault';
import SuccessMessage from './components/SuccessMessage';
import personsService from './services/persons';
import ErrorMessage from './components/ErrorMessage';

const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSearch, setNewSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService
    .getAll()
    .then(contacts => setPersons(contacts))
  }, [])

  const addContact = (e) => {
    e.preventDefault();

    const contactName = newName;
    const contactPhone = newPhone;
    
    if (contactName.trim().length === 0) {
      setErrorMessage(`Please enter a name`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if (contactPhone.trim().length === 0) {
      setErrorMessage(`Please enter a number`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    personsService.getAll().then(dbPersons => {
      
      const contactIndex = persons.findIndex(contact => contactName === contact.name);
      const dbContactIndex = dbPersons.findIndex(contact => contactName === contact.name);
      
      // the code below is added for the purpose of completing exercise 2.17

      // if (contactIndex !== -1 && dbContactIndex === -1) {
      //   personsService
      //     .amendContactNumber(persons[contactIndex], newPhone)
      //     .then(updatedContact => {
      //       const newPersonsArray = persons.map(person => (person.id === updatedContact.id) ? updatedContact : person);
      //       setPersons(newPersonsArray);
      //       setNewName('');
      //       setNewPhone('');
      //       setSuccessMessage(`${updatedContact.name}'s number has been updated`);
      //       setTimeout(() => setSuccessMessage(null), 3000);
      //     }).catch( error => {
      //       const newPersonsArray = persons.filter(person => person.name !== contactName);
      //       setNewName('');
      //       setNewPhone('');
      //       setErrorMessage(`Information of ${contactName} has already been removed from the server`);
      //       setTimeout(() => setErrorMessage(null), 3000);
      //       setTimeout(() => setPersons(newPersonsArray), 1000)
      //     }
      //     )
      //   return;
      // }

      // the code above is added for the purpose of completing the exercise

      if (dbContactIndex !== -1) {
        if (dbPersons[dbContactIndex].number === newPhone) {
          if (contactIndex === -1 || (dbPersons[dbContactIndex].number !== persons[contactIndex].number)) {
            alert(`${contactName} is already in the phonebook with this number. Updating contact list to most recent version...`);
            setPersons(dbPersons);
            setNewName('');
            setNewPhone('');
          } else {
            alert(`${contactName} is already in the phonebook`);
          }
          return;
        }
        else {
          const confirmText = `${contactName} is already in the phonebook. Would you like to replace their old number with their new one?`;
          if (window.confirm(confirmText)) {
            personsService
              .amendContactNumber(dbPersons[dbContactIndex], newPhone)
              .then(updatedContact => {
                const newPersonsArray = dbPersons.map(person => (person.id === updatedContact.id) ? updatedContact : person);
                setPersons(newPersonsArray);
                setNewName('');
                setNewPhone('');
                setSuccessMessage(`${updatedContact.name}'s number has been updated`);
                setTimeout(() => setSuccessMessage(null), 3000);
              })
              .catch(error => {
                setErrorMessage(error.response.data.error);
                setTimeout(() => setErrorMessage(null), 3000);
              });
            return;
          } else {
            setPersons(dbPersons);
            setNewName('');
            setNewPhone('');
            return;
          }
        }
      };

      personsService
        .createContact({ name: contactName, number: contactPhone})
        .then(newContact => {
          setPersons(dbPersons.concat(newContact));
          setNewName('');
          setNewPhone('');
          setSuccessMessage(`${contactName} has been added to the phonebook`);
          setTimeout(() => setSuccessMessage(null), 3000);
        })
        .catch(error => {
          setErrorMessage(error.response.data.error);
          setTimeout(() => setErrorMessage(null), 3000);
        });
    })
  }

  const displayedContacts = persons.filter(person => person.name.toUpperCase().includes(newSearch.toUpperCase()));

  return (
    <div>
      <HTag textContent={'Phonebook'} level={2}/>
      <SuccessMessage textContent={successMessage}/>
      <ErrorMessage textContent={errorMessage}/>
      <TextualInputDefault label={'filter shown with'} type={'text'} nameID={'filter'} state={newSearch} setter={setNewSearch}/>
      <HTag textContent={'add a new'} level={2} />
      <form id='form-add-contact' onSubmit={addContact}>
        <TextualInputDefault label={'name'} type={'text'} nameID={'name'} state={newName} setter={setNewName}/>
        <TextualInputDefault label={'phone'} type={'tel'} nameID={'phone'} state={newPhone} setter={setNewPhone}/>
        <button type="submit" >add</button>
      </form>
      <HTag textContent={'Numbers'} level={2}/>
      <ContactList persons={displayedContacts} setPersons={setPersons}/>
    </div>
  )
}

export default App