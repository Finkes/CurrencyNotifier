# CurrencyNotifier
Users can subscribe to currencies they are interested in and receive a push notification If currency value goes up.
Furtheremore, every hour the values of these currencies are updated.

## Run project

1) Install app dependencies.
```javascript
npm install
```

2) Run the tests
```javascript
npm test
```

3) Run the app
```javascript
npm start
```
## Methods
- By default the database is populated with an user:
You can list all users in 
```
http://localhost:8010/users
```

- Add a new currency to user
```
PUT http://localhost:8010/users/57105e8b238f3501650879f4/currencies
```
**Raw body**
```
{
  "codestring": "USD"
}
```

- List user's currencies
```
GET http://localhost:8010/users/57105e8b238f3501650879f4/currencies
```

- Delete an user's currency
```
DELETE http://localhost:8010/users/57105e8b238f3501650879f4/currencies
```
**Raw body**
```
{
  "codestring": "USD"
}
```

## Configuration
Config file contents the app configuration

```
{
		"cookie": {
			"parser": "",
			"key": ""
		},
		"mongodb": {
			"url": "",
			"autoReconnect": true,
			"autoRemove": "",
			"autoRemoveInterval": 10,
			"seed": true
		},
		"pusher": {
			"app_id": "",
			"key": "",
			"secret": ""
		}
	}
```
- set seed to false If you don't want to reset the db every time the server starts
