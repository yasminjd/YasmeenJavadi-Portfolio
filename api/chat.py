"""
Vercel serverless function for Yasmeen's portfolio chatbot
"""
import os
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler

import anthropic
from bs4 import BeautifulSoup

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Portfolio content loading functions
def extract_text_from_html(file_path: Path) -> str:
    """Strip tags/scripts/styles from an HTML file and return clean text."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")

        for tag in soup(["script", "style", "nav", "noscript"]):
            tag.decompose()

        text = soup.get_text(separator="\n", strip=True)
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return "\n".join(lines)
    except:
        return ""

def build_portfolio_context() -> str:
    """Read all portfolio HTML pages and bundle them into context."""
    # In Vercel, we're in the api/ directory, so go up one level
    project_root = Path(__file__).parent.parent
    html_pages = [
        "index.html",
        "about.html", 
        "projects.html",
        "skills.html",
        "experience.html",
        "certificates.html",
    ]
    
    sections = []
    for page in html_pages:
        path = project_root / page
        if path.exists():
            page_name = page.replace(".html", "").upper()
            content = extract_text_from_html(path)
            if content:
                sections.append(f"=== {page_name} PAGE ===\n{content}")
    
    return "\n\n".join(sections)

# Load portfolio content once (cached by Vercel)
PORTFOLIO_CONTEXT = build_portfolio_context()

SYSTEM_PROMPT = f"""You are a friendly AI assistant on Yasmeen Javadi's portfolio website.
Your job is to answer questions from visitors about Yasmeen's background, projects, skills, education, and experience.

Use ONLY the information provided below (extracted from her portfolio pages) to answer questions.
If a visitor asks about something not covered in the content, politely say you don't have that information
and suggest they reach out to Yasmeen directly via LinkedIn or GitHub (links available on the home page).

Keep responses concise, warm, and professional. Speak about Yasmeen in third person.

==================== PORTFOLIO CONTENT ====================
{PORTFOLIO_CONTEXT}
==================== END PORTFOLIO CONTENT ===================="""

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Handle CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        try:
            # Parse request
            content_length = int(self.headers['Content-Length'])
            request_data = self.rfile.read(content_length)
            data = json.loads(request_data.decode('utf-8'))
            
            message = data.get('message', '')
            if not message:
                raise ValueError("No message provided")
            
            # Call Anthropic API
            response = client.messages.create(
                model="claude-haiku-4-5",
                max_tokens=512,
                system=[
                    {
                        "type": "text",
                        "text": SYSTEM_PROMPT,
                        "cache_control": {"type": "ephemeral"},
                    }
                ],
                messages=[
                    {"role": "user", "content": message}
                ],
            )
            
            # Return response
            reply = {
                "reply": response.content[0].text,
                "usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens,
                }
            }
            
            self.wfile.write(json.dumps(reply).encode())
            
        except Exception as e:
            # Error response
            error_response = {
                "reply": "Sorry, I'm having trouble right now. Please try again.",
                "error": str(e)
            }
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()