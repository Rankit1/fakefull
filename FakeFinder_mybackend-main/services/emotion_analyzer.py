from transformers import pipeline
from utils.constants import CLICKBAIT_PHRASES

classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

def analyze_emotion(headline: str):
    result = classifier(headline)[0]
    emotion = result['label']
    score = result['score']
    is_clickbait = any(phrase.lower() in headline.lower() for phrase in CLICKBAIT_PHRASES)
    clickbait_type = None
    if is_clickbait and score > 0.8:
        if emotion == 'anger':
            clickbait_type = "ragebait"
        else:
            clickbait_type = "clickbait"
    return {
        "emotion": emotion,
        "score": score,
        "clickbait": is_clickbait,
        "clickbait_type": clickbait_type
    }