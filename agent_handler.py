"""
Custom AI Agent Handler for Nexus
Integrates OpenAI with Bing Search (Copilot) for advanced reasoning
"""
import logging
import json
from typing import Dict, List, Optional, Any
import openai
from copilot_handler import CopilotHandler

logger = logging.getLogger(__name__)

class NexusAgent:
    def __init__(self, openai_api_key: str, bing_api_key: str = None, model: str = "gpt-4-turbo-preview"):
        self.client = openai.AsyncOpenAI(api_key=openai_api_key) if openai_api_key else None
        self.copilot = CopilotHandler(bing_api_key) if bing_api_key else None
        self.model = model
        self.system_prompt = """
You are Nexus AI, an advanced intelligent assistant for the Nexus Media platform.
Your goal is to provide accurate, helpful, and comprehensive answers.
When available, use the provided search results to inform your answer.
Always cite your sources if search results are used.
Be concise but thorough. Use formatting (bold, lists) to make text readable.
"""

    async def process_message(self, user_id: int, message: str, context: List[Dict] = None) -> str:
        """
        Process a user message using the AI agent
        """
        if not self.client:
            return "⚠️ AI tizimi sozlanmagan (API Key yetishmayapti)."

        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add conversation history/context if provided
        if context:
            messages.extend(context)
            
        # Check if we need to search (simple heuristic: question asking for facts/current events)
        needs_search = await self._check_search_necessity(message)
        
        search_context = ""
        if needs_search and self.copilot:
            search_data = await self.copilot.search(message)
            if "web_pages" in search_data:
                search_context = "\n\nSearch Results:\n"
                for i, page in enumerate(search_data["web_pages"][:3]):
                    search_context += f"[{i+1}] {page['name']}: {page['snippet']}\nSource: {page['url']}\n"
        
        # Add user message with search context
        final_user_message = message
        if search_context:
            final_user_message += search_context
            
        messages.append({"role": "user", "content": final_user_message})

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Agent processing error: {e}")
            return "⚠️ Kechirasiz, xatolik yuz berdi. Keyinroq urinib ko'ring."

    async def _check_search_necessity(self, message: str) -> bool:
        """
        Determine if the query needs real-time info
        """
        # Simple keywords for now, could be an LLM call
        triggers = ["kim", "nima", "qachon", "qayerda", "narxi", "ob-havo", "yangiliklar", "who", "what", "when", "where", "price", "weather", "news"]
        return any(keyword in message.lower() for keyword in triggers)
