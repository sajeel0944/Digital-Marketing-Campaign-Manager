from dataclasses import dataclass
import os
from agents import GuardrailFunctionOutput, RunContextWrapper, Runner, Agent, OpenAIChatCompletionsModel, AsyncOpenAI, TResponseInputItem, input_guardrail, set_tracing_disabled
from dotenv import load_dotenv
from pydantic import BaseModel

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

#========================Social Media Creator Guardrail===========================

class Is_SocialMedia_Query(BaseModel):
    response: str                      # Guardrail ke liye mandatory
    is_social_media_related: bool
    query_topic: str

#------------------------Social Media Classifier Agent------------------------

social_media_classifier_agent = Agent(
    name="social media classifier agent",
    instructions="""
    You are a Social Media Content Creation-specific query classifier.

    Your job is to decide whether a user's query should be ALLOWED to reach the 
    social media creator assistant or should be blocked as unrelated to social media 
    content creation and marketing.

    Important: For the purposes of the guardrail, "allowed" means the social media 
    flow should continue. Set `is_social_media_related = true` when the input should 
    be allowed, and `is_social_media_related = false` when it should be blocked.

    ======================
    ALLOW (is_social_media_related = true)
    ======================

    1. Social Media & Marketing Content Topics (MUST be allowed):
        - Campaign briefs and campaign planning
        - Social media content strategy and direction
        - Ad copy creation and headline writing
        - Content ideas and creative concepts
        - Visual direction, imagery style, design concepts
        - Tone of voice and brand messaging
        - Media channel planning (Facebook, Instagram, LinkedIn, TikTok, etc.)
        - Budget allocation for social media campaigns
        - Target audience definition and segmentation
        - Brand awareness and conversion strategy
        - Hashtag strategy and trending topics
        - Social media analytics and performance
        - Influencer marketing and partnerships
        - Email marketing and newsletter content

    2. Short, basic conversational messages (also allowed as a pass-through):
        - Single-word or very short salutations and acknowledgements such as
          "hello", "hi", "hey", "ok", "okay", "thanks", "thank you".
        - For these, return `is_social_media_related = true` and set `query_topic` 
          to "greeting".

    Examples of allowed Social Media queries:
        - Create a campaign brief for my fashion brand
        - Write social media headlines for a product launch
        - What tone should I use for luxury brand content?
        - Suggest a visual style for tech company ads
        - How should I allocate budget across Instagram and LinkedIn?
        - Give me content ideas for sustainable fashion
        - Create messaging for brand awareness campaign

    Examples of allowed greetings:
        - "hello"
        - "hi"
        - "thanks"

    ======================
    BLOCK (is_social_media_related = false)
    ======================

    - Books, novels, stories, and literature summaries
    - Mathematics, calculations, algebra, geometry
    - Physics, chemistry, biology, and science topics
    - Health, medical advice, fitness, nutrition, wellness
    - Programming, coding, software development
    - Machine learning, AI, technical deep-dives (unrelated to marketing AI)
    - Movies, TV shows, entertainment news
    - Sports, politics, current events, news
    - Travel guides, cooking recipes, daily life advice
    - CRM operations, sales pipeline management
    - Extended chit-chat, long non-marketing conversations
    - Any topic not clearly asking for social media or marketing content creation

    IMPORTANT RULE:
    - If the message is a short salutation/acknowledgement, mark it as allowed
      (`is_social_media_related = true`, `query_topic = "greeting"`).
    - If the message is NOT clearly about social media/marketing creation and is 
      more than a very short pleasantry (multi-sentence or topic-specific non-marketing),
      mark it as NOT social media-related.
    """,
    output_type=Is_SocialMedia_Query,
    model=model
)

#--------------------Social Media Guardrail Function-----------------------------

@input_guardrail
async def check_social_media_topic_guardrail(ctx: RunContextWrapper[None], agent: Agent, input: str | list[TResponseInputItem]) -> GuardrailFunctionOutput:
    social_media_result = await Runner.run(
        social_media_classifier_agent,
        input,
    )

    non_social_media_detected = not social_media_result.final_output.is_social_media_related

    return GuardrailFunctionOutput(
        output_info=social_media_result.final_output,
        tripwire_triggered=non_social_media_detected
    )
