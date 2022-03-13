class CreateUsers {
    constructor(userID, name, email, password, passwordReminder, phoneNumber) {
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.password = password;
        this.passwordReminder = passwordReminder;
        this.phoneNumber = phoneNumber;
    } 
}

module.exports = { CreateUsers }