from pydantic import BaseModel, EmailStr, validator
from fastapi import HTTPException

'''

Útmutató a fájl használatához:

Az osztályokat a schema alapján ki kell dolgozni.

A schema.py az adatok küldésére és fogadására készített osztályokat tartalmazza.
Az osztályokban az adatok legyenek validálva.
 - az int adatok nem lehetnek negatívak.
 - az email mező csak e-mail formátumot fogadhat el.
 - Hiba esetén ValuErrort kell dobni, lehetőség szerint ezt a 
   kliens oldalon is jelezni kell.

'''

ShopName='Bolt'

def no_negative(value: int) -> int:
    try:
        if value < 0:
            raise ValueError("Value cannot be negative")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    return value

class User(BaseModel):
    id: int
    name: str
    email: EmailStr 

    @validator('id')
    def no_negative_int(value):
        return no_negative(value)

class Item(BaseModel):
    item_id: int
    name: str
    brand: str
    price: float
    quantity: int

    @validator('item_id', 'quantity')
    def no_negative_int(value):
        return no_negative(value)

    @validator('price')
    def no_negative_float(value):
        try:
            if value < 0:
                raise ValueError("Price cannot be negative")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal Server Error")
        return value

class Basket(BaseModel):
    id: int
    user_id: int
    items: list[Item]

    @validator('id', 'user_id')
    def no_negative_int(value):
        return no_negative(value)