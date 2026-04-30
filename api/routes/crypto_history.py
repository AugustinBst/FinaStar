from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import httpx
from api.database import get_db
from api.models import CryptoHistory

crypto_router = APIRouter(prefix="/crypto", tags=["Crypto"])

class CryptoRequest(BaseModel):
    crypto: str

    @crypto_router.post("/save-rate")
    async def save_crypto_rate(req: CryptoRequest, db: Session = Depends(get_db)):
        # we use httpx to make an async request
        async with httpx.AsyncClient() as client:
            # the coingecko api url with the requested crypto
            url = f"https://api.coingecko.com/api/v3/simple/price?ids={req.crypto}&vs_currencies=usd"
            response = await client.get(url)
            data = response.json()

            # we check if the crypto exists in the response
            if req.crypto not in data:
                raise HTTPException(status_code=404, detail="Cryptocurrency not found")

            # we get the current price in dollars
            current_price = data[req.crypto]["usd"]

            # we create a new record in the database
            new_record = CryptoHistory(
                crypto_name=req.crypto,
                price=current_price
            )

            # we add and save it in the db
            db.add(new_record)
            db.commit()

            return {"message": "Rate saved successfully"}

    @crypto_router.get("/history")
    def get_crypto_history(db: Session = Depends(get_db)):
        # we get all records, sorted from newest to oldest
        records = db.query(CryptoHistory).order_by(CryptoHistory.consulted_at.desc()).all()

        # we transform each record into a dictionary to send it as json
        return [
            {
                "id": record.id,
                "crypto_name": record.crypto_name,
                "price": float(record.price),  # convert to float to be sure
                "consulted_at": record.consulted_at.isoformat()  # iso format for dates
            }
            for record in records
    ]