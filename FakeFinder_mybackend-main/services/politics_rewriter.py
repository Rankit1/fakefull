from openai import OpenAI
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

def analyze_political(headline: str):
    prompt = f"""Classify the political tone of this headline as one of: extreme left, moderate left, center, moderate right, extreme right. Provide an extremity score from 0 to 100 where 0 is neutral and 100 is extreme.
    Then rewrite the headline in left, center, right tones.
    Output in JSON format:
    {{"detected_tone": "tone", "extremity_score": number, "rewritten_headlines": {{"left": "str", "center": "str", "right": "str"}}}}
    Headline: {headline}"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        content = response.choices[0].message.content
        print(f"Raw response: {content}")  # Debug print
        if not content or not content.strip():
            raise ValueError("Empty response from OpenAI API")
        # Remove Markdown code block markers if present
        content = re.sub(r'^```json|```$', '', content.strip(), flags=re.MULTILINE)
        print(f"Cleaned response: {content}")  # Debug print after cleaning
        result = json.loads(content)
        return result
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e} - Raw response: {content}")
        return {"error": "Invalid JSON response from OpenAI API"}
    except ValueError as e:
        print(f"Value Error: {e}")
        return {"error": str(e)}
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return {"error": str(e)}