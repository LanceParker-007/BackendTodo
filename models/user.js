//Mongoose entity model,
//I used firebase so I don't need one
//I can create a class called User here
class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date().toLocaleString();
  }
}

export default User;
