Tweets = new Mongo.Collection('tweets');

if (Meteor.isClient) {

  Template.body.helpers({
    tweets: function () {
      return Tweets.find({}, {
        sort: { createdAt: -1 }
      });
    }
  });

  Template.tweet.helpers({
    time: function() {
      return moment(this.createdAt).fromNow();
    },
    username: function() {
      return Meteor.users.findOne(this.userId).username;
    },
    belongsToCurrentUser: function() {
      return Meteor.user() && Meteor.user()._id === this.userId;
    }
  });

  Template.body.events({
    'submit .new-tweet': function(event) {
      event.preventDefault();

      if (event.target.text.value === '') {
        return FlashMessages.sendWarning('Tweet must have content.');
      }

      Meteor.call('createTweet', event.target.text.value);
      event.target.text.value = '';
      FlashMessages.sendInfo('Tweet created!');
    }
  });

  Template.tweet.events({
    'click .delete-tweet': function(event) {
      Meteor.call('deleteTweet', this._id);
      FlashMessages.sendError('Tweet deleted!');
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  createTweet: function(text) {
    if (!Meteor.userId()) throw new Meteor.Error('not-authorized');

    Tweets.insert({
      text: text,
      createdAt: new Date(),
      userId: Meteor.user()._id
    });
  },
  deleteTweet: function(tweetId) {
    Tweets.remove(tweetId);
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
