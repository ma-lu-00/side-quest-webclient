

class User {
    constructor(id, displayName, email, password) {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.password = password;
    }

    toJSON() {
        return {}
    }

    static fromJSON(data) {
        const user = new User(
            data.id,
            data.display_name,
            data.email,
            data.password
        )
        //load main quests
        return user;
    }
}