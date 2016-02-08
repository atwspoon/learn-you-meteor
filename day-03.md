# Day 3 - User Auth

So far, we've built a Twitter clone that only allows anonymous tweets. Pretty
cool in it's own right, but probably not quite what we're going for. To get a
little closer to a real Twitter application we need user accounts.

Yet again, Meteor makes this super easy.

## User auth, for free!

Meteor has it's own package repository for pulling in things that third parties
have created to be reused throughout people's projects. The `auth` package is
the first one we will work with.

Adding the `auth` package to our project is as simple as this:

```
$ meteor add accounts-ui accounts-password
```

This adds two pieces into our current project. The `accounts-ui` provides the
interface elements for logging in and creating accounts that we can easily drop
into our application's interface. The other piece, `accounts-password`, enables
password based logins for our user account system.

To view more information about these packages, we can visit their pages on
atmospherejs.com:

* [accounts-ui](https://atmospherejs.com/meteor/accounts-ui)
* [accounts-password](https://atmospherejs.com/meteor/accounts-password)

## Pulling it into our template

First we're going to want to include the newly available interface piece to our
existing interface. Again, the `accounts-ui` package gives us the ability to
drop it in with minimal effort.

Now that we have the `accounts-ui` package, we can simply drop in a short code
snippet to pull in a login and account creation modal to our interface.

Add this bit of HTML right after the closing `navbar-header` div in our navbar
markup:

```
<div class="pull-right">
  <p>{{> loginButtons align="right"}}</p>
</div>
```

And just to make it a little better aligned with the rest of the navbar, let's
also add this bit of CSS to our `tweeteor.css` file:

```
#login-buttons { margin-top: 18px; }
```

We should now have a link in the top right of our navbar that we can click to
display a login and registration modal. We can create accounts and log in to
them from here. It definitely doesn't get any easier than that.

## Usernames, not emails

The accounts package is also configurable in a number of ways. By default, it
uses an email address for signups. We are going to configure it to use usernames
only. That way we can show the usernames alongside the tweets that the users
create.

Let's add this to the bottom of our `Meteor.isClient` block:

```
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
```

Now the signup and login forms will only show a field for `username` and
`password`. We'll see how to access the user and their username shortly.

## Restricting access

Now that we have the ability to create an account and log in with it, we need to
be able to tie new tweets to a particular user. First, though, let's restrict
creating new tweets to only logged in users.

### Checking current user

What we will do is hide the "New Tweet" form if the user is not currently logged
in. To do this, we need to wrap all the HTML for our New Tweet input with the
following. Be sure to include the `.container` div as well:

```
{{#if currentUser}}
  ...
{{/if}}
```

Now that portion of our template will be hidden if a user is not currently
logged in. Awesome!

Next let's make sure that when a new tweet *is* created, it's tied to a user.

## Accessing user info in our JS

What we need to do to tie a tweet to the currently logged in user is include a
new attribute on the tweet object that we save in MongoDB.

Thanks to the accounts package that we've included, we can access the currently
logged in user by accessing `Meteor.user()`. 

Whenever a new tweet is created, we want to store the user's ID with it. The way
to do this is with `Meteor.user()._id`. Let's change our code for inserting a
new tweet to look like this:

```
Tweets.insert({
  text: event.target.text.value,
  createdAt: new Date(),
  userId: Meteor.user()._id
});
```

We've simply added the line `userId: Meteor.user()._id` to the info stored with
a tweet. Now we can tie a tweet directly to the user that created it.

*Note:* If you want to see what all information is contained within the user
object, simply open up your console in the browser dev tools and type:

```
Meteor.user()
```

You'll see all the information that is stored with the user.

## Displaying a tweet's username in the template

Now that we are recording what user has sent what tweet, we want to actually
display this in our template. We're going to add to the line that shows when a
tweet was sent and have it also show the username for that tweet.

First we will need to add a new helper to our `tweet` template. This one will be
what is responsible for fetching the username based on a userId that is stored
with the tweet:

```
username: function() {
  return Meteor.users.findOne(this.userId).username;
}
```

This will go right after the `time` helper already defined in our JS.

Now in our HTML we will update the line that is currently displaying the time of
our tweets to look like this:

```
<p class="small">Posted: {{ time }} by {{ username }}</p>
```

This will utilize the new helper we have created and will pull in the username
of the user who created that tweet. Easy as that!

# What we learned today

Today we covered:

* Adding an account system using meteor's package management system
* Configuring the account system to use username's only
* Only allowing logged in users to create new tweets
* Showing on a tweet what user created it
* Restricting access to deleting a tweet to the user who created it


# Exercise

1. Prevent other people from deleting a user's tweets
  1. Write a helper method to check if a tweet belongs to current user
  2. Use the helper in the template to hide the "X" when necessary
