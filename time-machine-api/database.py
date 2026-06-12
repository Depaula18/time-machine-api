from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./historico.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class LinkResgatado(Base):
    __tablename__ = "links_resgatados"
    
    id = Column(Integer, primary_key=True, index=True)
    url_quebrada = Column(String, index=True)
    url_arquivo = Column(String)
    resumo_ia = Column(String)
    data_resgate = Column(DateTime, default=datetime.now)
    
    Base.metadata.create_all(bind=engine)
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()