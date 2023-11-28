const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        console.log("resolvers.js query me before findone")
        const results = User.findOne({ _id: context.user._id });
        console.log("resolvers.js query me after findone results" + results)
        return results;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      console.log("resolvers.js addUser:" + username + " email:" + email + " pass:" + password )
      const user = await User.create({ username, email, password });
      console.log("resolvers.js addUser user:" + user )

      const token = signToken(user);
      console.log("resolvers.js addUser token:" + token )

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      console.log("resolvers.js logi enter")
      const user = await User.findOne({ email });
      console.log("resolvers.js login user" + user)

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (
      parent,
      { bookId, authors, description, title, image, link },
      context
    ) => {
      console.log("resolvers.js savebook author:" + authors)
      //console.log("resolvers.js savebook context:" + JSON.stringify(context))
      console.log("resolvers.js savebook context:" + context)
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { bookId, authors, description, title, image, link },
            },
          },
          { new: true, runValidators: true }
        );
      } else {
        throw new AuthenticationError("You need to be logged in!");
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true, runValidators: true }
        );
      } else {
        throw new AuthenticationError("You need to be logged in!");
      }
    },
  },
};

module.exports = resolvers;
