# Connexion MongoDB
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "kidora")

# Connexion MongoDB (singleton)
client = None
db = None

def get_database():
    """Retourne l'instance de la base de données MongoDB"""
    global client, db
    
    if db is None:
        client = MongoClient(MONGO_URL)
        db = client[DATABASE_NAME]
        print(f"✔ Connected to MongoDB - Database: {DATABASE_NAME}")
    
    return db

def close_connection():
    """Ferme la connexion MongoDB"""
    global client
    if client:
        client.close()
        print("✔ MongoDB connection closed")