from sentence_transformers import SentenceTransformer, util
from utils.newsapi_client import get_news_articles
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def check_authenticity(headline: str, keywords: list[str]):
    logger.debug(f"Processing headline: {headline}")
    logger.debug(f"Extracted keywords: {keywords}")

    # Fallback to headline if no keywords
    query = " ".join(keywords) if keywords else headline
    logger.debug(f"NewsAPI query: {query}")

    # Fetch articles
    articles = get_news_articles(query)
    logger.debug(f"Number of articles fetched: {len(articles)}")

    if not articles:
        return {
            "matched_sources": [],
            "authenticity_level": "low"
        }

    original_emb = model.encode(query)
    matched_sources = []

    for article in articles:
        fetched_headline = article.get('title', '')
        if not fetched_headline:
            logger.debug(f"Article with no title: {article}")
            continue

        fetched_emb = model.encode(fetched_headline)
        similarity = util.cos_sim(original_emb, fetched_emb)[0][0].item()
        logger.debug(f"Comparing '{headline}' with '{fetched_headline}': similarity = {similarity}")

        if similarity > 0.75:
            source_url = article.get('url', 'No URL available')
            matched_sources.append(source_url)
            logger.debug(f"Match found: {source_url}, similarity = {similarity}")

    count = len(matched_sources)
    if count >= 5:
        level = "high"
    elif count >= 2:
        level = "moderate"
    else:
        level = "low"

    logger.debug(f"Matched sources: {matched_sources}, Authenticity level: {level}")
    return {
        "matched_sources": matched_sources,
        "authenticity_level": level
    }