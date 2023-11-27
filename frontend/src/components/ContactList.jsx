import personsService from '../services/persons'

const ContactList = ({persons, setPersons}) => {
  
  const deleteContact = (person) => {
    if (window.confirm(`delete ${person.name}?`)) {
      personsService.deleteContact(person);
      const newPersonsArray = persons.filter(contact => contact.id !== person.id);
      setPersons(newPersonsArray);
    }
  }

  return (
    <>
      {persons.map(person => 
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deleteContact(person)}>delete</button>
        </p>)
      }
    </>
  )
}

export default ContactList