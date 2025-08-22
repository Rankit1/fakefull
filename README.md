# API Endpoint Documentation for Frontend Integration

## Table of API Endpoints

| **Endpoint**          | **Method** | **URL**                                | **Request Format**                                              | **Request Type**       | **Response Format**                                                                                                            | **Response Type**     | **Status** | **Notes**                                                                 |
|------------------------|------------|----------------------------------------|-----------------------------------------------------------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------|------------|---------------------------------------------------------------------------|
| `/extract/text`        | POST       | `http://127.0.0.1:8000/extract/text`    | `{ "headline": "string", "first_para": "string or null" }`      | `application/json`     | `{ "headline": "string", "first_para": "string or null" }`                                                                    | `application/json`    | 200 OK     | Returns the input data as-is.                                             |
| `/extract/image`       | POST       | `http://127.0.0.1:8000/extract/image`   | `form-data` with key `file` (image file)                        | `multipart/form-data`  | `{ "headline": "string", "first_para": "string or null" }`                                                                    | `application/json`    | 200 OK     | Extracts text via OCR; `first_para` may be null.                          |
| `/analyze/emotion`     | POST       | `http://127.0.0.1:8000/analyze/emotion` | `{ "headline": "string", "first_para": "string or null" }`      | `application/json`     | `{ "emotion": "string", "score": "float", "clickbait": "boolean", "clickbait_type": "string or null" }`                       | `application/json`    | 200 OK     | `clickbait_type` is null if not ragebait/clickbait.                       |
| `/analyze/authenticity`| POST       | `http://127.0.0.1:8000/analyze/authenticity` | `{ "headline": "string", "first_para": "string or null" }` | `application/json`     | `{ "matched_sources": "array", "authenticity_level": "low/moderate/high" }`                                                   | `application/json`    | 200 OK     | `matched_sources` may be empty.                                           |
| `/analyze/political`   | POST       | `http://127.0.0.1:8000/analyze/political` | `{ "headline": "string", "first_para": "string or null" }`    | `application/json`     | `{ "detected_tone": "string", "extremity_score": "integer", "rewritten_headlines": {"left":"string","center":"string","right":"string"}}` | `application/json`    | 200 OK     | Rewritten headlines vary by political tone.                              |
| `/analyze/full`        | POST       | `http://127.0.0.1:8000/analyze/full`    | `{ "headline": "string", "first_para": "string or null" }`      | `application/json`     | Combines all analyses: `{ "keywords_topic": {...}, "authenticity": {...}, "emotion": {...}, "political": {...} }`              | `application/json`    | 200 OK     | Full analysis with all modules.                                           |

---

## Frontend Implementation Tips

### API Calls
Use `fetch` or `axios` to send requests.

**Example (`/extract/text`):**
```javascript
fetch('http://127.0.0.1:8000/extract/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ headline: "Breaking News", first_para: "Details here" })
})
.then(response => response.json())
.then(data => console.log(data));
```

### File Upload
For `/extract/image`, use a `FormData` object:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://127.0.0.1:8000/extract/image', { 
  method: 'POST', 
  body: formData 
})
.then(response => response.json())
.then(data => console.log(data));
```

### State Management
- Use **Redux** or **Context API** for nested data like `rewritten_headlines`.

### Error Handling
- Use `try-catch` or `.catch()` to handle server errors (400, 500).

---

## Additional Notes
- **Dynamic Fields**: Values like `emotion`, `score`, `detected_tone`, and `rewritten_headlines` change based on model outputs.  
- **Empty Results**: If `matched_sources` is empty, show **“No matching sources found”** in the UI.  
- **Generated**: 04:37 PM IST, Friday, August 22, 2025.  
