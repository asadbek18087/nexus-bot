# Nexus Media Bot Configuration
# Iltimos, ushbu faylni o'zingizning ma'lumotlaringizga moslab to'ldiring

# Telegram API ma'lumotlari
# https://my.telegram.org dan oling
API_ID = 12345678  # O'zingizning API ID raqamingiz
API_HASH = "your_api_hash_here"  # O'zingizning API hash
PHONE_NUMBER = "+998901234567"  # O'zingizning telefon raqamingiz

# Database ma'lumotlari
DATABASE_URL = "postgresql://username:password@localhost:5432/nexus_media"

# Skanerlanadigan kanallar ro'yxati
# @ belgisiz yoki to'liq link bilan yozing
CHANNELS = [
    "@channel1",
    "@channel2", 
    "@channel3",
    "https://t.me/channel4"
]

# Ruxsat etilgan fayl turlari
ALLOWED_TYPES = [
    "video",      # Videolar
    "photo",      # Rasmlar
    "document",   # Hujjatlar (PDF, DOC, etc.)
    "audio"       # Audio fayllar
]

# Maksimal fayl hajmi (baytlarda)
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# Fayllar saqlanadigan papka
DOWNLOAD_PATH = "media"

# Logging sozlamalari
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
LOG_FILE = "nexus_media_bot.log"

# Skanerlash sozlamalari
SCAN_LIMIT = 1000  # Har bir kanaldan nechta xabar skerneriladi
SCAN_DELAY = 1    # Kanallar orasida kechikuv (sekundlarda)

# Xavfsizlik sozlamalari
ENABLE_DUPLICATE_CHECK = True  # Dublikatlarni tekshirish
ENABLE_METADATA_EXTRACTION = True  # Qo'shimcha ma'lumotlarni yig'ish

# Telegram sozlamalari
SESSION_NAME = "nexus_media_session"  # Session fayli nomi
USE_MEMORY_SESSION = False  # Memory session ishlatish (xavfsizlik uchun)

# Database sozlamalari
POOL_SIZE = 5  # Database pool hajmi
MAX_OVERFLOW = 10  # Maksimal overflow

# Monitoring sozlamalari
ENABLE_WEBHOOK = False  # Webhook ishlatish
WEBHOOK_URL = "https://your-server.com/webhook"  # Webhook URL
WEBHOOK_SECRET = "your-webhook-secret"  # Webhook secret key
