import json
from typing import Dict, Any, List

import os

'''
Útmutató a féjl használatához:

Felhasználó adatainak lekérdezése:

user_id = 1
user = get_user_by_id(user_id)
print(f"Felhasználó adatai: {user}")

Felhasználó kosarának tartalmának lekérdezése:

user_id = 1
basket = get_basket_by_user_id(user_id)
print(f"Felhasználó kosarának tartalma: {basket}")

Összes felhasználó lekérdezése:

users = get_all_users()
print(f"Összes felhasználó: {users}")

Felhasználó kosarában lévő termékek összárának lekérdezése:

user_id = 1
total_price = get_total_price_of_basket(user_id)
print(f"A felhasználó kosarának összára: {total_price}")

Hogyan futtasd?

Importáld a függvényeket a filehandler.py modulból:

from filereader import (
    get_user_by_id,
    get_basket_by_user_id,
    get_all_users,
    get_total_price_of_basket
)

 - Hiba esetén ValuErrort kell dobni, lehetőség szerint ezt a 
   kliens oldalon is jelezni kell.

'''

# A JSON fájl elérési útja
JSON_FILE_PATH = "./data/data.json"

def load_json() -> Dict[str, Any]:
    if not os.path.exists(JSON_FILE_PATH):
        return {"users": [], "baskets": []}
    try:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return {"users": [], "baskets": []}

def get_user_by_id(user_id: int) -> Dict[str, Any]:
    data = load_json()
    for user in data["Users"]:
        if user["id"] == user_id:
            return user
    raise ValueError(f"User with id {user_id} not found.")

def get_basket_by_user_id(user_id: int) -> List[Dict[str, Any]]:
    data = load_json()
    for basket in data["Baskets"]:
        if basket["user_id"] == user_id:
            return basket.get("items", [])
    raise ValueError(f"Basket for user with id {user_id} not found.")
    return None

def get_all_users() -> List[Dict[str, Any]]:
    data = load_json()
    return data["Users"]

def get_total_price_of_basket(user_id: int) -> float:
    data = load_json()
    for basket in data["Baskets"]:
        if basket["user_id"] == user_id:
            total_price = sum(item["price"] * item["quantity"] for item in basket.get("items", []))
            return total_price
    raise ValueError(f"Basket for user with id {user_id} not found.")
    return 0.0
