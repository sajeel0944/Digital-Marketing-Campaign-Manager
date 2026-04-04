from agents import function_tool
from playwright.async_api import async_playwright

@function_tool
async def analyze_website_full(url: str) -> dict:
    """
    A powerful web scraping tool that performs a deep scan of any website. 
    It uses a headless browser to render JavaScript, making it ideal for 
    modern SPAs (React, Next.js) and portfolios.
    
    ### Capabilities:
    - **Full Content**: Extracts every visible text from the website.
    - **SEO & Structure**: Retrieves page title and all headings (H1-H6).
    - **Visual Identity**: Analyzes the top 5 dominant CSS colors (OKLCH/RGB).
    - **Assets**: Lists all images (with alt text) and all clickable links.
    
    ### Use Cases:
    - When you need to understand the 'About', 'Skills', or 'Experience' sections of a portfolio.
    - When you need to analyze the design (colors) or structure of a web page.
    - When a simple search snippet is not enough and you need the full page data.

    ### Args:
    - **url (str)**: The complete URL of the website to analyze.

    ### Returns:
    - **dict**: A structured report containing Title, Full_Content, Headings, Links, Images, and Colors.
    """
    async with async_playwright() as p:
        # Browser launch
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0")
        page = await context.new_page()
        
        try:
            # Website load karein aur thora wait karein animation ke liye
            await page.goto(url, wait_until="networkidle", timeout=60000)
            await page.wait_for_timeout(2000) 

            # 1. Full Page Content
            full_text = await page.evaluate("() => document.body.innerText")

            # 2. Extracting Specific Data (Links)
            all_links = await page.evaluate("""() => {
                return Array.from(document.querySelectorAll('a')).map(a => ({
                    text: a.innerText.trim(),
                    href: a.href
                })).filter(l => l.text !== "");
            }""")

            # 3. Extracting All Headings
            headings = await page.evaluate("""() => {
                return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
                            .map(h => h.innerText.trim());
            }""")

            # 5. Color Analysis
            colors = await page.evaluate("""() => {
                const elements = document.querySelectorAll('*');
                const bgs = [];
                for (let i = 0; i < Math.min(elements.length, 1000); i++) {
                    const style = window.getComputedStyle(elements[i]);
                    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs.push(style.backgroundColor);
                }
                return bgs;
            }""")
            
            from collections import Counter
            top_colors = [c[0] for c in Counter(colors).most_common(5)]

            results = {
                "Title": await page.title(),
                "Full_Content": full_text,
                "Headings": list(set(headings)),
                "Links": all_links,
                "Colors": top_colors,
            }

            await browser.close()
            return f"{results}"

        except Exception as e:
            await browser.close()
            return f"Error analyzing website: {e}"
