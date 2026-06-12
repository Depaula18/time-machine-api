from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from bs4 import BeautifulSoup
import google.generativeai as genai
import requests
import os
from dotenv import load_dotenv
from database import get_db, LinkResgatado, engine, Base


load_dotenv()
app = FastAPI(title="404 Time Machine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CHAVE_API = os.getenv("GEMINI_API_KEY")

if not CHAVE_API:
    raise ValueError("🚨 Chave da API não encontrada! Verifique o arquivo .env")

genai.configure(api_key=CHAVE_API)
model = genai.GenerativeModel('gemini-2.5-flash')

@app.get("/api/search")
def search_archive(url: str, db: Session = Depends(get_db)):
    try:
        # 1. O nosso "disfarce" de navegador
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        archive_url = f"https://archive.org/wayback/available?url={url}"
        
        # 2. Passamos o disfarce na requisição e pegamos a resposta sem forçar o .json() direto
        api_response = requests.get(archive_url, headers=headers)
        
        # 3. Verificamos se fomos bloqueados (código diferente de 200 OK)
        if api_response.status_code != 200:
            return {"error": f"Archive.org bloqueou a requisição (Erro {api_response.status_code}). Tente novamente daqui a pouco."}
            
        # Se passou, tentamos ler o JSON
        response = api_response.json()
        print("🕵️ RESPOSTA DO ARCHIVE:", response)
        
        if not response.get("archived_snapshots") or not response["archived_snapshots"].get("closest"):
            return {"found": False}
            
        snapshot_url = response["archived_snapshots"]["closest"]["url"]
        
        # 4. Usamos o mesmo disfarce para fazer o scraping da página
        page_html = requests.get(snapshot_url, headers=headers).text
        soup = BeautifulSoup(page_html, "html.parser")
        
        for script in soup(["script", "style"]):
            script.extract()
            
        texto_limpo = soup.get_text(separator=" ", strip=True)[:3000]
        prompt = f"Você é um assistente de arquivologia. Baseado no texto abaixo, raspado de um site antigo, resuma em uma única frase curta (máximo de 15 palavras) sobre o que era este site: {texto_limpo}"
        
        ai_response = model.generate_content(prompt)
        resumo = ai_response.text.strip()
        
        novo_resgate = LinkResgatado(
            url_quebrada=url,
            url_arquivo=snapshot_url,
            resumo_ia=resumo
        )
        db.add(novo_resgate)
        db.commit()
        
        return {
            "found": True,
            "url": snapshot_url,
            "summary": resumo
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    historico = db.query(LinkResgatado).order_by(LinkResgatado.id.desc()).limit(10).all()
    return historico