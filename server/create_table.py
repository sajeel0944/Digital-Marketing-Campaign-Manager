import rich
from sqlmodel import SQLModel, create_engine
import os
from dotenv import load_dotenv
from models import User, Company, Notification, Campaign

# --- LOAD ENV VARIABLES ---
load_dotenv()

# --- DATABASE CONNECTION STRING ---
NEON_DB_CONNECTION = os.getenv("NEON_DB_CONNECTION")
engine = create_engine(NEON_DB_CONNECTION)

# --- CREATE DATABASE AND TABLES ---
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    rich.print("Database and tables created.")

if __name__ == "__main__":
    create_db_and_tables()  