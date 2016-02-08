# Day 4 - Security & Deployment

Up until this point we have been executing code on the client side that is
directly affecting the database. This defies all security concerns as far as web
applications go, so what gives?

## Security

Every new meteor project comes equipped with a package called `insecure`. This
package is what allows the direct database calls on the client. Before we deploy
anything we will want to remove it.

```
$ meteor remove insecure
```

But now if we try using our application, we notice that new tweets can't be
created, and we can't delete tweets either. The code that was calling to the
database is now longer functional.

What we have to use instead is..

### Meteor Methods

Outside of both our `isClient` and `isServer` blocks in the JS, we will need to
define some methods that will be shared between the client and server. Any code
of ours that defines an operation involving the database should exist as a
"Meteor method".

```
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
```

These methods are now available to use with the `Meteor.call('methodName',
arguments)` syntax. Meteor automatically wires these up so that when we "call"
it from the client side, it sends a request to the server to execute that code.
If anything goes wrong there, then the server sends back an error.

Let's replace the `Tweets.insert` lines in our submit new tweet body template
event handler with the following:

```
Meteor.call('createTweet', event.target.text);
```

And our `Tweets.remove` line in the delete-tweet event handler:

```
Meteor.call('deleteTweet', this._id);
```

And our application should be back to a working state now!

One cool this is that meteor uses what is called "Optimistic UI". So the client
will assume right off the bat that the code worked and will update quickly. Then
if the server comes back and says there was a problem, it will revert. But this
increase performance significantly.

Now that our application is secured, let's find out how to deploy it!

## Deploying to Meteor servers

Deploying our application may just be the easiest thing we have to cover here.
Meteor's command line utility comes packed with everything you need to deploy
your working application to their test servers.

All it requires is an account. If you type in..

```
$ meteor deploy projectname.meteor.com
```

..it will prompt you to create an account and then will proceed to deploy your
application to the domain you specify. Give it a shot, then visit the URL and
see for yourself.

## Custom domain

To deploy to a custom domain that you own, you can simply set the DNS of the
domain to point to `origin.meteor.com`. By doing this, you can then simply do

```
$ meteor deploy yourdomain.com
```

..and the rest will be taken care of. Easy!

## Mobile deployment

Meteor also comes with the tools we need to deploy our application to a mobile
platform. We'll cover iOS first. Note that this will require an Apple Developer
account if we want to send it directly to an iOS device. Otherwise, a simulator
will be used.

Running `meteor install-sdk android` or `meteor install-sdk ios` will give you
instructions on getting your system ready to deploy to either of these
platforms. Once you've done everything for each one, you can use:

```
$ meteor add-platform ios/android
$ meteor run ios/android
```

To add the platform to your project and then to run it in their respective
simulators. If you wish to run the project on a device that is connected, you
can use:

```
$ meteor run ios-device/android-device
```

Which will install the application locally on the device. You can also have it
pointed at a server that the application was deployed to in previous steps with

```
$ meteor run ios-device/android-device --mobile-server=yourappname.meteor.com
```

# Now what?

There are tons of great resources available online for learning more about
Meteor, and an ecosystem of packages available on
[atmosphere](2).


[1]: https://github.com/meteor/meteor/wiki/Mobile-Development-Install:-iOS-on-Mac
[2]: https://atmospherejs.com
