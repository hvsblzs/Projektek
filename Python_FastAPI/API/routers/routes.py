from schemas.schema import User, Basket, Item
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi import FastAPI, HTTPException, Request, Response, Cookie
from fastapi import APIRouter
from data.filehandler import (
    save_json,
    add_user,
    add_basket,
    add_item_to_basket,
    load_json,
)
from data.filereader import (
    get_user_by_id,
    get_basket_by_user_id,
    get_all_users,
    get_total_price_of_basket
)
import traceback
'''

Útmutató a fájl használatához:

- Minden route esetén adjuk meg a response_modell értékét (típus)
- Ügyeljünk a típusok megadására
- A függvények visszatérési értéke JSONResponse() legyen
- Minden függvény tartalmazzon hibakezelést, hiba esetén dobjon egy HTTPException-t
- Az adatokat a data.json fájlba kell menteni.
- A HTTP válaszok minden esetben tartalmazzák a 
  megfelelő Státus Code-ot, pl 404 - Not found, vagy 200 - OK

'''

routers = APIRouter()

@routers.post('/adduser', response_model=User)
def adduser(user: User) -> JSONResponse:
    try:
        add_user(user.dict())
        return JSONResponse(status_code=200, content={"message": "Felhasználó hozzáadva.", "user": user.dict()})
    except ValueError as e:
        print("ValueError:", str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("HIBA:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal Server Error")


@routers.post('/addshoppingbag', response_model=Basket)
def addshoppingbag(userid: int) -> JSONResponse:
    try:
        add_basket({"id": 100+userid, "user_id": userid, "items": []})
        return JSONResponse(status_code=200, content={"message": "Kosár hozzáadva."})
    except ValueError as e:
        print("ValueError:", str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("HIBA:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal Server Error")

@routers.post('/additem', response_model=Basket)
def additem(userid: int, item: Item) -> JSONResponse:
    try:
        add_item_to_basket(userid, item.dict())
        return JSONResponse(status_code=200, content={"message": "Termék hozzáadva a kosárhoz."})
    except ValueError as e:
        print("ValueError:", str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("HIBA:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal Server Error")

@routers.put('/updateitem', response_model=Basket)
def updateitem(userid: int, itemid: int, updateItem: Item) -> JSONResponse:
    try:
        data = load_json()
        baskets = data.get("Baskets", [])
        foundItem = False
        
        for basket in baskets:
            if basket["user_id"] == userid:
                for item in basket["items"]:
                    if item["item_id"] == itemid:
                        item["name"] = updateItem.name
                        item["brand"] = updateItem.brand
                        item["price"] = updateItem.price
                        item["quantity"] = updateItem.quantity
                        foundItem = True
                        break

        if not foundItem:
            raise HTTPException(status_code=404, detail="Item not found in basket")
        save_json(data)
        return JSONResponse(status_code=200, content={"message": "Termék frissítve a kosárban."})

    except HTTPException as e:
        raise e
    except Exception as e:
        print("HIBA:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal Server Error")

@routers.delete('/deleteitem', response_model=Basket)
def deleteitem(userid: int, itemid: int) -> JSONResponse:
    try:
        data = load_json()
        baskets = data.get("Baskets", [])
        foundItem = False
        
        for basket in baskets:
            if basket["user_id"] == userid:
                lenBeforeDelete = len(basket["items"])
                basket["items"] = [item for item in basket["items"] if item["item_id"] != itemid]
                if len(basket["items"]) < lenBeforeDelete:
                    foundItem = True
                    basketAfterDelete = basket
                    break

        if not foundItem:
            raise HTTPException(status_code=404, detail="Item not found in basket")
        save_json(data)
        return JSONResponse(status_code=200, content={"message": "Termék törölve a kosárból.", "basket": basketAfterDelete})

    except HTTPException as e:
        raise e
    except Exception as e:
        print("HIBA:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal Server Error")

@routers.get('/user', response_model=User)
def user(userid: int) -> JSONResponse:
    try:
        user = get_user_by_id(userid)
        return JSONResponse(status_code=200, content={"user": user})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

@routers.get('/users', response_model=list[User])
def users() -> JSONResponse:
    try:
        users = get_all_users()
        return JSONResponse(status_code=200, content={"users": users})
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

@routers.get('/shoppingbag', response_model=list[Item])
def shoppingbag(userid: int) -> JSONResponse:
    try:
        basket = get_basket_by_user_id(userid)
        if basket is None:
            raise HTTPException(status_code=404, detail="Kosár nem található.")
        return JSONResponse(status_code=200, content={"basket": basket})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

@routers.get('/getusertotal', response_model=float)
def getusertotal(userid: int) -> JSONResponse:
    try:
        total_price = get_total_price_of_basket(userid)
        return JSONResponse(status_code=200, content={"total_price": total_price})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
