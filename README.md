# Mobilize Scraper

I was moving my community off Mobilize and wanted to have the data of my team formatted in a specific way.

I built this scraper to pull the data out.

There is an optional CSV formatter as I needed it to add people to a group in G Suite.

# Prerequisites

- Be a member in a Mobilize Group
- `npm install`

# Using it

Set the following things in your environment:

- `DOMAIN`: this is the subdomain `xxx.mobilize.io` that your group lives under. Just pass in the `xxx` part.
- `GROUP_ID`: this is a number that represents your account on Mobilize - it can be found in the URL when browsing your group
- `COOKIE`: You need to be authenticated to use this, so you need to extract your session cookie from a browser. There's an example below.

Then you just need to do `npm start`.

Here's an example:

```
DOMAIN=freemanindustries GROUP_ID=123 COOKIE="see example below" npm start
```

The user list will be outputted in `results.json` in the top level directory. Make sure you move this somewhere else before running again as it will be overwritten.

`progress.json` is also generated and periodically updated to allow fast resuming in the event of an error.

# Cookie formatting

The cookie should look like this:

```
_mobilize_session_r=65592d8afakeGUIDsothisisnotarealcookie8fca51; Expires=Thu, 20 Apr 2021 16:20:69 GMT; Domain=mobilize.io; Path=/; Secure; HttpOnly`;
```

Set the whole string as your environment variable,

The other cookies in your browser aren't needed for API access.

# CSV conversion

```
npm run csv
```

This turns your `results.json` into a CSV file that most parts of G Suite can ingest.

It will not run unless there is a `results.json` file in the top level directory.

It outputs a `results.csv` in the top level directory.