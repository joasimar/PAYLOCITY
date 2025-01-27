function generateRandomName() {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Taylor'];
  
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    return {
      firstName: randomFirstName,
      lastName: randomLastName,
    };
  }
  
  export default generateRandomName;
  