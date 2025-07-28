import os
from dotenv import load_dotenv
load_dotenv()  # carga .env en os.environ

print(">>>> DB_HOST en entorno:", os.getenv("DB_HOST"))
class Config:
    SECRET_KEY  = os.getenv("SECRET_KEY",  "devkey")
    DB_HOST     = os.getenv("DB_HOST",     "localhost")
    DB_USER     = os.getenv("DB_USER",     "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
    DB_NAME     = os.getenv("DB_NAME",     "Agrosoft")
    DB_PORT     = os.getenv("DB_PORT",     "3306")