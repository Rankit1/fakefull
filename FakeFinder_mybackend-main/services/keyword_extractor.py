from transformers import pipeline
from utils.constants import TOPIC_CANDIDATES

zero_shot = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
ner = pipeline("token-classification", model="dbmdz/bert-large-cased-finetuned-conll03-english", aggregation_strategy="simple")

def extract_keywords_and_topic(headline: str, first_para: str | None = None):
    text = headline + (" " + first_para if first_para else "")
    topic_result = zero_shot(text, candidate_labels=TOPIC_CANDIDATES)
    topic = topic_result['labels'][0]
    entities = ner(text)
    keywords = list(set(entity['word'] for entity in entities if entity['entity_group'] in ['PER', 'ORG', 'LOC', 'MISC']))
    return {"topic": topic, "keywords": keywords}