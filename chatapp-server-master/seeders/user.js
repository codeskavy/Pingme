import { faker } from "@faker-js/faker";
import { User } from "../models/user.js";

/**
 * Create random users with fake data.
 * All users will have password: 'password' (will be hashed in pre-save hook)
 */
const createUser = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const user = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName().toLowerCase() + faker.string.numeric(3),
        bio: faker.lorem.sentence(10),
        password: "password", // will be hashed
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.string.uuid(),
        },
      });

      usersPromise.push(user);
    }

    await Promise.all(usersPromise);

    console.log(`✅ ${numUsers} Users created successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating users:", error);
    process.exit(1);
  }
};

export { createUser };
