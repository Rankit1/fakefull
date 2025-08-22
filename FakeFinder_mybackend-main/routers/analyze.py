from fastapi import APIRouter
from pydantic import BaseModel

from services import keyword_extractor, emotion_analyzer, similarity_checker, politics_rewriter

router = APIRouter()

class ArticleData(BaseModel):
    headline: str
    first_para: str | None = None

@router.post("/emotion")
def analyze_emotion(article: ArticleData):
    return emotion_analyzer.analyze_emotion(article.headline)

@router.post("/authenticity")
def analyze_authenticity(article: ArticleData):
    kw = keyword_extractor.extract_keywords_and_topic(article.headline, article.first_para)
    return similarity_checker.check_authenticity(article.headline, kw["keywords"])

@router.post("/political")
def analyze_political(article: ArticleData):
    return politics_rewriter.analyze_political(article.headline)

@router.post("/full")
def full_analyze(article: ArticleData):
    kw = keyword_extractor.extract_keywords_and_topic(article.headline, article.first_para)
    auth = similarity_checker.check_authenticity(article.headline, kw["keywords"])
    emo = emotion_analyzer.analyze_emotion(article.headline)
    pol = politics_rewriter.analyze_political(article.headline)
    return {
        "keywords_topic": kw,
        "authenticity": auth,
        "emotion": emo,
        "political": pol
    }