# SystemRejestracji
projekt na jjit3

By odpalić użyj komendy:
npm run devStart

disclaimer: plik cookieAuth w sumie nie jest cookie a sprawdza w headerze authorization, nie mam czasu porawić ale w sumie nic to nie zmienia 

Nie umiem robić readme więc wypisze wszystkie endpointy (to jak powinno wyglądać body jest niżej) :)
GET /dupa <- endpoint testowy by sprawdzić czy backend żyje
GET /rooms <- zwraca wszystkie pokoje
GET /room/<id> <- zwraca konkretny pokój
POST /reservation <- do tworzenia rezerwacji

POST /users/login <- logowanie

Wszystko w /admin wymaga tokenu do autoryzaji w headerze który przysyłany jest w body odpowiedzi przy logowaniu
POST /admin/room <- dodawnie pokoju
DELETE /admin/room <- usuwanie pokoju (w body dajemy id)

GET /admin/reservations <- lista wszystkich rezerwacji
DELETE /admin/reservations <- usuwanie rejestracji (w body dajemy id)
POST /admin/register <- tworzenie konta, body identyczne jak przy logowaniu

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

Prawidłowy objekt logowania/rejestrowania wygląda tak:
{
	"login": String,
	"password": String
}