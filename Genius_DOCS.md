Annotations
An annotation is a piece of content about a part of a document. The document may be a song (hosted on Genius) or a web page (hosted anywhere). The part of a document that an annotation is attached to is called a referent.

Annotation data returned from the API includes both the substance of the annotation and the necessary information for displaying it in its original context.

  
GET /annotations/:id
Data for a specific annotation.

id	ID of the annotation
10225840
text_format	Format for text bodies related to the document. One or more of dom, plain, and html, separated by commas (defaults to dom). 


Referents
Referents are the sections of a piece of content to which annotations are attached. Each referent is associated with a web page or a song and may have one or more annotations. Referents can be searched by the document they are attached to or by the user that created them.

When a new annotation is created either a referent is created with it or that annotation is attached to an existing referent.

api.genius.com/
referents?web_page_id=10347
 Authorization: Bearer
rrbfQC7CGh5glhmxScyQm65HLSUrRCAlyK_AtafX9MDZIaZE-WtxEm94AvU8hIzb
See details about using an access token in the authentication section below.
  
GET /referents
Referents by content item or user responsible for an included annotation.

You may pass only one of song_id and web_page_id, not both.

created_by_id	ID of a user to get referents for
User ID
song_id	ID of a song to get referents for
Song ID
web_page_id	ID of a web page to get referents for
10347
text_format	Format for text bodies related to the document. One or more of dom, plain, and html, separated by commas (defaults to dom). See details of each option here
Text Format
per_page	Number of results to return per request
Per Page
page	Paginated offset, (e.g., per_page=5&page=3 returns songs 11–15)
Page
Songs
A song is a document hosted on Genius. It's usually music lyrics.

Data for a song includes details about the document itself and information about all the referents that are attached to it, including the text to which they refer.

api.genius.com/
songs/378195
 Authorization: Bearer
rrbfQC7CGh5glhmxScyQm65HLSUrRCAlyK_AtafX9MDZIaZE-WtxEm94AvU8hIzb
See details about using an access token in the authentication section below.
  
GET /songs/:id
Data for a specific song.

id	ID of the song
378195
text_format	Format for text bodies related to the document. One or more of dom, plain, and html, separated by commas (defaults to dom). See details of each option here
Text Format
Artists
An artist is how Genius represents the creator of one or more songs (or other documents hosted on Genius). It's usually a musician or group of musicians.

api.genius.com/
artists/16775
 Authorization: Bearer
rrbfQC7CGh5glhmxScyQm65HLSUrRCAlyK_AtafX9MDZIaZE-WtxEm94AvU8hIzb
See details about using an access token in the authentication section below.
  
GET /artists/:id
Data for a specific artist.

id	ID of the artist
16775
text_format	Format for text bodies related to the document. One or more of dom, plain, and html, separated by commas (defaults to dom). See details of each option here
Text Format
api.genius.com/
artists/16775/songs
 Authorization: Bearer
rrbfQC7CGh5glhmxScyQm65HLSUrRCAlyK_AtafX9MDZIaZE-WtxEm94AvU8hIzb
See details about using an access token in the authentication section below.
  
GET /artists/:id/songs
Documents (songs) for the artist specified. By default, 20 items are returned for each request.

id	ID of the artist.
16775
sort	title (default) or popularity
Sort
per_page	Number of results to return per request
Per Page
page	Paginated offset, (e.g., per_page=5&page=3 returns songs 11–15)
Page
Web Pages
A web page is a single, publicly accessible page to which annotations may be attached. Web pages map 1-to-1 with unique, canonical URLs.

api.genius.com/
web_pages/lookup?raw_annotatable_url=https%3A%2F%2Fdocs.genius.com
 Authorization: Bearer
rrbfQC7CGh5glhmxScyQm65HLSUrRCAlyK_AtafX9MDZIaZE-WtxEm94AvU8hIzb
See details about using an access token in the authentication section below.
  
GET /web_pages/lookup
Information about a web page retrieved by the page's full URL (including protocol). The returned data includes Genius's ID for the page, which may be used to look up associated referents with the /referents endpoint.

Data is only available for pages that already have at least one annotation.

Provide as many of the following variants of the URL as possible:

raw_annotatable_url	The URL as it would appear in a browser
https://docs.genius.com
canonical_url	The URL as specified by an appropriate <link> tag in a page's <head>
Canonical URL
og_url	The URL as specified by an og:url <meta> tag in a page's <head>
OG URL
Search
The search capability covers all content hosted on Genius (all songs).

api.genius.com/
search?q=Kendrick%20Lamar
 Authorization: Bearer
rrbfQC7CGh5glhmxScyQm65HLSUrRCAlyK_AtafX9MDZIaZE-WtxEm94AvU8hIzb
See details about using an access token in the authentication section below.
  
GET /search
Search documents hosted on Genius.

q	The term to search for
Kendrick Lamar
Account
Account information includes general contact information and Genius-specific details about a user.

api.genius.com/
account
 Authorization: Bearer
rrbfQC7CGh5glhmxScyQm65HLSUrRCAlyK_AtafX9MDZIaZE-WtxEm94AvU8hIzb
See details about using an access token in the authentication section below.
  
GET /account
Requires scope: me

Account information for the currently authenticated user.

text_format	Format for text bodies related to the document. One or more of dom, plain, and html, separated by commas (defaults to dom). See details of each option here
Text Format
Authentication
Access for Apps Without Users
If your application doesn't include user-specific behaviors you can use the client access token associated with your API instead of tokens for authenticated users. These tokens are only valid for read-only endpoints that are not restricted by a required scope.

You can get a client access token by clicking "Generate Access Token" on the API Client management page.

Genius uses the OAuth2 standard for making API calls on behalf of individual users. Requests are authenticated with an Access Token sent in an HTTP header (or as a request parameter if you must).

All interaction with the API must be done over HTTPS.

An example request would look like this:

https://api.genius.com/oauth/authorize?
client_id=YOUR_CLIENT_ID&
redirect_uri=YOUR_REDIRECT_URI&
scope=REQUESTED_SCOPE&
state=SOME_STATE_VALUE&
response_type=code
Getting an Access Token
Start by directing a user of your application to Genius's authentication page at https://api.genius.com/oauth/authorize with the following query parameters:

client_id: Your application's Client ID, as listed on the API Client management page
redirect_uri: The URI Genius will redirect the user to after they've authorized your application; it must be the same as the one set for the API client on the management page
scope: The permissions your application is requesting as a space-separated list (see available scopes below)
state: A value that will be returned with the code redirect for maintaining arbitrary state through the authorization process
response_type: Always "code"
More About State
One important use for this value is increased security—by including a unique, difficult to guess value (say, a hash of a user session value), potential attackers can be prevented from sending phony redirects to your app.

On the authentication page the user can choose to allow your application to access Genius on their behalf. They'll be asked to sign in (or, if necessary, create an account) first. Then the user is redirected to https://YOUR_REDIRECT_URI/?code=CODE&state=SOME_STATE_VALUE.

Your application can exchange the code query parameter from the redirect for an access token by making a POST request to https://api.genius.com/oauth/token with the following request body data:

{
  "code": "CODE_FROM_REDIRECT",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "YOUR_REDIRECT_URI",
  "response_type": "code",
  "grant_type": "authorization_code"
}
code: The code query parameter from the redirect to your redirect_uri
client_secret: Your application's Client Secret, as listed on the API Client management page
grant_type: Aways "authorization_code"
client_id: As above
redirect_uri: As above
response_type: As above
Most of these are the same values as used in the initial request.

{
  "access_token": "ACCESS_TOKEN"
}
The response body will be an object with the token as the value for the access_token key. Save the token and use it to make requests on behalf of the authorizing user.

Available Scopes
Access tokens can only be used for resources that are covered by the scopes provided when they created. These are the available scopes and the endpoints they grant permission for:

Scope	Endpoints
me	GET /account
create_annotation	POST /annotations
manage_annotation	PUT /annotations/:id
DELETE /annotations/:id
vote	PUT /annotations/:id/upvote
PUT /annotations/:id/downvote
PUT /annotations/:id/unvote
Using An Access Token
GET /some-endpoint HTTP/1.1
User-Agent: CompuServe Classic/1.22
Accept: application/json
Host: api.genius.com
Authorization: Bearer ACCESS_TOKEN
To make authenticated requests with an access token, include it in an HTTP Authorization header preceded by the word "Bearer" and a space. For example, the value of the header could be Bearer 1234tokentokentoken.

Passing the token in the authorization header is the preferred way to authenticate API requests. However, the API also supports providing the token as the access_token query parameter of a GET request or element of a POST body.

Response Format
GET https://api.genius.com/web_pages/lookup?canonical_url=http://example.com
{
  "meta": {
    "status": 200
  },
  "response": {
    "web_page": {
      "annotation_count":7,
      "id": 1480,
      ...
    }
  }
}
All Genius API responses are JSON. Every JSON response has a meta field with a status value that is an integer representation of the HTTP status code for the response.

For successful requests, there is also a top-level response field which will be a nested object. For example, a request for details about annotations on a web page:

Errors
GET https://api.genius.com/apples
{
  "meta": {
    "status": 404,
    "message": "Not found"
  }
}
If a request fails or errors (i.e. the status values is 4xx or 5xx). the meta field will also have a message value that is a string with details about the error. For example, a request to a non-existent API endpoint:

Text Formatting (text_format option)
{
  "plain": "A hilarious word!",
  "html": "<p>A hilarious word!</p>",
  "dom": {
    "tag": "root",
    "children": [ {
      "tag": "p",
      "children": [ "A hilarious word!" ]
    } ]
  }
}
Many API requests accept a text_format query parameter that can be used to specify how text content is formatted. The value for the parameter must be one or more of plain, html, and dom. The value returned will be an object with key-value pairs of formats and results:

plain is just plain text, no markup
html is a string of unescaped HTML suitable for rendering by a browser
dom is a nested object representing and HTML DOM hierarchy that can be used to programmatically present structured content