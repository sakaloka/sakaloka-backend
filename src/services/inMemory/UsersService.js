class UsersService {
  constructor() {
    this._users = [
      {
        id: 1,
        email: 'test@example.com',
        password: '123456',
        name: 'Rifa',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  addUser = ({ email, password, name }) => {
    const id = this._users.length + 1;
    const timestamp = new Date().toISOString();
    const user = { 
      id, 
      email, 
      password, 
      name,
      created_at: timestamp,
      updated_at: timestamp,
    };
    this._users.push(user);
    return user;
  };
  
  findUserByEmailAndPassword = (email, password) => {
    return this._users.find(u => u.email === email && u.password === password);
  };
  
  findUserById = (id) => {
    return this._users.find(u => u.id === parseInt(id));
  };
  
  updateUserById = (id, { name }) => {
    const index = this._users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return null;
  
    this._users[index] = {
      ...this._users[index],
      name,
      updated_at: new Date().toISOString(),
    };
  
    return this._users[index];
  };
}

export default UsersService;