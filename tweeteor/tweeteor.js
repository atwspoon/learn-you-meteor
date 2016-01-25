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
    }
  });

  Template.body.events({
    'submit .new-tweet': function(event) {
      event.preventDefault();

      Tweets.insert({
        text: event.target.text.value,
        createdAt: new Date()
      });

      event.target.text.value = '';
    }
  });

  Template.tweet.events({
    'click .delete-tweet': function(event) {
      Tweets.remove(this._id);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
