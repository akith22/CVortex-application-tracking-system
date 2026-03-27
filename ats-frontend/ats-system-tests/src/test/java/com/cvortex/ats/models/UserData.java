package com.cvortex.ats.models;

public class UserData {

    private String name;
    private String email;
    private String password;
    private String role;

    public static Builder builder() {
        return new Builder();
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public static final class Builder {
        private final UserData target = new UserData();

        public Builder name(String value) {
            target.name = value;
            return this;
        }

        public Builder email(String value) {
            target.email = value;
            return this;
        }

        public Builder password(String value) {
            target.password = value;
            return this;
        }

        public Builder role(String value) {
            target.role = value;
            return this;
        }

        public UserData build() {
            return target;
        }
    }
}
