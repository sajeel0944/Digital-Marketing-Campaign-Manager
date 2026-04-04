import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import rich
from Agent.tool.analyze_website_full import analyze_website_full
from Agent.tool.web_search import web_search_tool
from Agent.guardrails import check_social_media_topic_guardrail
import os
from agents import AgentOutputSchema, InputGuardrailTripwireTriggered, Runner, Agent, OpenAIChatCompletionsModel, AsyncOpenAI, set_tracing_disabled, trace
from dotenv import load_dotenv
from Typeschema.AiBrief import AiBriefSchema, BriefSchema

# ------ Load Environment Variables ------

load_dotenv()
set_tracing_disabled(disabled=True)

# ------ Model Configuration ------

OPENAI_API_KEY : str = os.getenv("GROQ_API_KEY")
MODEL : str = "moonshotai/kimi-k2-instruct-0905"

# ------ External Client Setup ------

external_client = AsyncOpenAI(
    api_key = OPENAI_API_KEY,
    base_url =  "https://api.groq.com/openai/v1"
)

model = OpenAIChatCompletionsModel(
    model = MODEL,
    openai_client = external_client 
)

# ------ Agent Definition------
social_media_creator = Agent(
    name = "social media content creator",
    instructions = """
    ### **Role:**
    You are an **AI Creative Strategist**. Your goal is to take a Campaign Brief (Client details, Objectives, Creative preferences) and transform it into a structured **Creative Direction Document**.

    ### **Operational Workflow:**
    1. **Analyze Input:** Receive client name, industry, website, and competitors. 
    2. **Strategy Generation:** - Suggest a **Campaign Title**.
    - Create **3 Headline Options** (Catchy, Value-driven, Action-oriented).
    - Define a **Tone of Voice Guide** based on user preferences.
    3. **Media Planning:** - Recommend channels (e.g., Meta, LinkedIn, Google).
    - Provide **Budget Allocation Percentages** (e.g., 40% Instagram, 60% Search).
    4. **Visual Direction:** - Describe a **Hero Image Concept** (Composition, lighting, and mood).
    - Use color preferences from the brief to suggest a palette.

    ### **Guidelines for Content:**
    * **Tone:** Match the user's selected tone (Professional, Luxury, etc.).
    * **Format:** Ensure the output is structured for a print-ready PDF layout.
    * **CTA:** Every headline or ad copy must lead to the campaign objective (Awareness/Conversion).

    ### **Output Schema Requirements:**
    You MUST output structured data following this exact schema:
    - **campaign_title** (str): The main campaign title
    - **headline** (list[str]): List of 3 headline options
    - **budget** (float): Total campaign budget in USD
    - **tone_guide** (str): Detailed tone of voice guidelines
    - **channel_allocation** (list[dict[str, float]]): Budget allocation across channels (e.g., [{"Instagram": 40.0, "LinkedIn": 60.0}])
    - **visual_direction** (str): Hero image concept and visual guidance
    - **tag** (list[str]): Relevant tags for the campaign
    - **description_about_brirf** (str): Brief description summarizing the entire campaign brief

    ### **Strict Rules:**
    - Output must strictly follow the schema: Title, Headlines, Tone, Channels, Visual Direction.
    - Do not hallucinate industry facts; use `web_search_tool` if competitor data is missing.
    - Ensure channel_allocation contains percentages that total 100%.
    - Always provide exactly 3 headlines with different styles (Catchy, Value-driven, Action-oriented).

    ### **Tools at Your Disposal:**
    - **analyze_website_full(url)**: Use this to extract insights from the client's website or competitors for better strategy formulation.
    - **web_search_tool(query)**: Use this to find real-time information about competitors, industry trends, or any data not present in the training set.
    """,
    model = model,
    tools=[analyze_website_full, web_search_tool],
    input_guardrails=[check_social_media_topic_guardrail],
)

# ------ Structure Output Agent ------

StructureOutputAgent = Agent(
    name="Structure Output Agent",
    instructions="""
    ### **STRICT ROLE:**
    You are a Passive Content Structuring Agent. Your ONLY job is to map incoming raw data into the 'BriefSchema' format.

    ### **CRITICAL RULES (DO NOT DEVIATE):**
    1. **NO ALTERATIONS:** You must NOT change, edit, improve, or rephrase any word, sentence, or value received from the 'Social Media Content Creator Agent'.
    2. **NO ADDITIONS:** Do not add your own opinions, suggestions, or extra information. Even if you see a typo or a grammatical error, you must leave it EXACTLY as it is.
    3. **ZERO TEXT OUTPUT:** Do not provide any conversational text, introductions, or conclusions. Your output must be ONLY the structured data as per the 'BriefSchema'.
    4. **MAPPING ONLY:** Take the 'Campaign Title', 'Headlines', 'Tone', 'Channels', and 'Visual Direction' provided to you and place them into their respective fields in the schema.

    ### **EXECUTION:**
    - Input: Raw text/details from the previous agent.
    - Action: Identify fields -> Insert data -> Output JSON.
    - Goal: 100% data integrity. If a word was 'Vibrant' in the input, it must be 'Vibrant' in the output.
    """,
    model=model,
    output_type=AgentOutputSchema(BriefSchema, strict_json_schema=False),
)

# ------ Runner Setup ------

def run_agent(input_data: AiBriefSchema) -> BriefSchema:
    try:
        runner = Runner.run_sync(social_media_creator, f"{input_data.model_dump_json()}")
        if runner.final_output:
            runner2 = Runner.run_sync(StructureOutputAgent, f"{runner.final_output}")
            final_data = runner2.final_output
            
            return final_data.model_dump()
        else:
            raise Exception("No output from the social media creator agent.")
    except InputGuardrailTripwireTriggered as e:
        rich.print(f"Guardrail triggered: {e}")
        raise 
    except Exception as e:
        rich.print(f"Error running agent: {e}")
        raise
