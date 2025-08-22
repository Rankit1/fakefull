from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel

from services import ocr_service, playwright_service

router = APIRouter()

class ArticleData(BaseModel):
    headline: str
    first_para: str | None = None

@router.post("/text")
def extract_text(article: ArticleData):
    return article.model_dump()

@router.post("/image")
async def extract_image(file: UploadFile = File(...)):
    text = ocr_service.extract_text_from_image(await file.read())
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    headline = lines[0] if lines else ""
    first_para = lines[1] if len(lines) > 1 else None
    return {"headline": headline, "first_para": first_para}

@router.post("/link")
async def extract_link(url: str = Form(...)):
    headline, first_para = playwright_service.extract_from_url(url)
    return {"headline": headline, "first_para": first_para}