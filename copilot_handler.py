import aiohttp
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class CopilotHandler:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.endpoint = "https://api.bing.microsoft.com/v7.0/search"

    async def search(self, query: str) -> Dict[str, Any]:
        """
        Perform a Bing search
        """
        if not self.api_key:
            return {}

        headers = {"Ocp-Apim-Subscription-Key": self.api_key}
        params = {"q": query, "count": 5, "offset": 0, "mkt": "en-US"}

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.endpoint, headers=headers, params=params) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Bing Search Error: {response.status}")
                        return {}
        except Exception as e:
            logger.error(f"Bing Search Exception: {e}")
            return {}
