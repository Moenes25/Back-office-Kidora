// Mock API for Super Admin
export const login = async ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "superadmin@domain.com" && password === "123456") {
        resolve({
          token: "fake-jwt-token",
          user: {
            id: 1,
            email: "superadmin@domain.com",
            role: "SUPER_ADMIN",
            username: "SuperAdmin",
          },
        });
      } else {
        reject("Invalid email or password");
      }
    }, 500);
  });
};

export const register = async ({ email, password, username }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: "User registered successfully",
        user: {
          id: 2,
          email,
          username,
          role: "USER",
        },
      });
    }, 500);
  });
};
