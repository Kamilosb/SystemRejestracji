# SystemRejestracji
projekt na jjit3

By odpalić użyj komendy:
npm run devStart

Prawidłowy objekt pokoju wygląda tak:
{
    "bedCount": Number,
    "peopleCount": Number,
    "name": String,
    "description": String,
    "shortDescription": String,
    "image": String,
    "amenities": [ String ],
    "price": Number
}

Prawidłowy objekt rezerwacji wygląda tak:
{
	"firstName": String,
	"lastName": String,
	"address": {
		"country": String,
		"city": String,
		"street": String
	},
	"dateFrom": Date,
	"dateTo": Date,
	"roomId": String
}