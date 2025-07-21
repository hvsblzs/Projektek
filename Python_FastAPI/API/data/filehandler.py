import json
from typing import Dict, Any

import os


'''
Útmutató a fájl függvényeinek a használatához

Új felhasználó hozzáadása:

new_user = {
    "id": 4,  # Egyedi felhasználó azonosító
    "name": "Szilvás Szabolcs",
    "email": "szabolcs@plumworld.com"
}

Felhasználó hozzáadása a JSON fájlhoz:

add_user(new_user)

Hozzáadunk egy új kosarat egy meglévő felhasználóhoz:

new_basket = {
    "id": 104,  # Egyedi kosár azonosító
    "user_id": 2,  # Az a felhasználó, akihez a kosár tartozik
    "items": []  # Kezdetben üres kosár
}

add_basket(new_basket)

Új termék hozzáadása egy felhasználó kosarához:

user_id = 2
new_item = {
    "item_id": 205,
    "name": "Szilva",
    "brand": "Stanley",
    "price": 7.99,
    "quantity": 3
}

Termék hozzáadása a kosárhoz:

add_item_to_basket(user_id, new_item)

Hogyan használd a fájlt?

Importáld a függvényeket a filehandler.py modulból:

from filehandler import (
    add_user,
    add_basket,
    add_item_to_basket,
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

def save_json(data: Dict[str, Any]) -> None:
    with open(JSON_FILE_PATH, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def add_user(user: Dict[str, Any]) -> None:
    data = load_json()
    
    if any(existing_user.get("id") == user["id"] for existing_user in data.get("Users", [])):
        raise ValueError("A megadott ID-val már létezik felhasználó.")
    
    if "Users" not in data:
        data["users"] = []
    data["Users"].append(user)
    
    save_json(data)

def add_basket(basket: Dict[str, Any]) -> None:
    data = load_json()
    
    if any(existing_basket.get("id") == basket["id"] for existing_basket in data.get("Baskets", [])):
        raise ValueError("A megadott ID-val már létezik kosár.")
    
    if any(existing_basket.get("user_id") == basket["user_id"] for existing_basket in data.get("Baskets", [])):
        raise ValueError("A megadott felhasználónak már van kosara.")
    
    if "Baskets" not in data:
        data["Baskets"] = []
    data["Baskets"].append(basket)
    
    save_json(data)

def add_item_to_basket(user_id: int, item: Dict[str, Any]) -> None:
    data = load_json()
    
    user_exists = any(user.get("id") == user_id for user in data.get("Users", []))
    if not user_exists:
        raise ValueError("A megadott felhasználó nem létezik.")
    
    basket = next((basket for basket in data.get("Baskets", []) if basket.get("user_id") == user_id), None)
    if not basket:
        raise ValueError("A megadott felhasználónak nincs kosara.")
    
    if any(existing_item.get("item_id") == item["item_id"] for existing_item in basket.get("items", [])):
        raise ValueError("A termék már benne van a kosárban.")
    
    if "items" not in basket:
        basket["items"] = []
    basket["items"].append(item)
    
    save_json(data)
