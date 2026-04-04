import os
from agents import function_tool
from dotenv import load_dotenv
import requests

load_dotenv()

@function_tool
def web_search_tool(query: str) -> str:
    """
    Search the web using Google to find real-time information, news, or specific facts.
    
    This tool is essential for answering questions about current events, technical 
    documentation, or any data that was not part of the model's initial training.
    
    ### Args:
    - **query (str)**: The search string or question to be looked up on the internet.
    
    ### Returns:
    - **str**: A summary (snippet) of the top search result along with a source link. 
      Returns "No results found" if the search fails.
    
    ### Example:
    - Input: ""
    - Output: "Bitcoin price today is $... More info: https://..."
    """
    api_key = os.getenv("STREAM_API_KEY")  # Make sure to set this in your environment
    url = "https://serpapi.com/search"
    params = {
        "q": query,
        "api_key": api_key,
        "engine": "google",
    }

    response = requests.get(url, params=params)
    data = response.json()

    # Simplified result: show top snippet
    try:
        snippet = data['organic_results'][0]['snippet']
        link = data['organic_results'][0]['link']
        return f"{snippet}\nMore info: {link}"
    except (KeyError, IndexError):
        return "No results found."
    
