#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NEXUS UNIVERSAL BOT - ULTIMATE EDITION
Features:
- Supabase Integration (Single Source of Truth)
- Admin Payment Approval System
- No Trial, No Language Selection
- Bing Copilot Integration
- Azure AI (Voice/Text)
- WebApp Sync
"""

import os
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict
from io import BytesIO

# Third-party imports
from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import CommandStart
from aiogram.types import (
    Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton,
    FSInputFile, WebAppInfo, InputFile
)
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.utils.keyboard import InlineKeyboardBuilder

from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# =============================================================================
# CONFIGURATION & CONSTANTS
# =============================================================================

class Config:
    # Bot Settings
    BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
    ADMIN_IDS = [5895125141] # Asosiy admin ID
    SUPPORT_USERNAME = "@iultimatium"
    WEBAPP_URL = "https://nexuswebapp-zeta.vercel.app"
    BING_URL = "https://www.bing.com/copilotsearch?form=MA13XW"
    
    # Supabase Settings
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    
    # Azure Settings
    AZURE_KEY = os.getenv("AZURE_KEY")
    AZURE_REGION = os.getenv("AZURE_REGION")
    
    # OpenAI Settings
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Pricing
    PRICES = {
        "daily": {"amount": 7990, "name": "1 Kunlik", "duration": 1},
        "monthly": {"amount": 69990, "name": "1 Oylik", "duration": 30}
    }
    
    PAYMENT_CARD = "8600 0000 0000 0000 (Asadbek O.)"

# Check required env vars
if not Config.BOT_TOKEN:
    # Pass for now to allow file creation without env vars present
    pass

# =============================================================================
# STATES
# =============================================================================

class PaymentState(StatesGroup):
    waiting_for_receipt = State()

# =============================================================================
# DATABASE MANAGER (SUPABASE)
# =============================================================================

class Database:
    def __init__(self):
        # Fallback if keys are missing (for safe initialization)
        url = Config.SUPABASE_URL or "https://placeholder.supabase.co"
        key = Config.SUPABASE_KEY or "placeholder"
        self.client: Client = create_client(url, key)
        
    async def get_or_create_user(self, user_id: int, full_name: str, username: str):
        """Userni olish yoki yangisini yaratish"""
        try:
            # Check if user exists
            res = self.client.table("User").select("*").eq("telegramId", user_id).execute()
            if res.data:
                return res.data[0]
            
            # Create new user
            new_user = {
                "telegramId": user_id,
                "fullName": full_name,
                "username": username,
                "coins": 0,
                "isPremium": False,
                "language": "uz" # Default language
            }
            res = self.client.table("User").insert(new_user).execute()
            return res.data[0]
        except Exception as e:
            logging.error(f"DB Error: {e}")
            return None

    async def add_premium(self, user_id: int, days: int):
        """Premium qo'shish"""
        try:
            # Get current subscription end
            user = self.client.table("User").select("subscriptionEnd").eq("telegramId", user_id).execute()
            current_end = datetime.now()
            
            if user.data and user.data[0]['subscriptionEnd']:
                # Handle ISO format
                try:
                    sub_end = datetime.fromisoformat(user.data[0]['subscriptionEnd'].replace('Z', ''))
                    if sub_end > current_end:
                        current_end = sub_end
                except ValueError:
                    pass
            
            new_end = current_end + timedelta(days=days)
            
            self.client.table("User").update({
                "isPremium": True,
                "subscriptionEnd": new_end.isoformat(),
                "subscriptionType": 4 if days > 1 else 1
            }).eq("telegramId", user_id).execute()
            return True
        except Exception as e:
            logging.error(f"Premium Add Error: {e}")
            return False

# =============================================================================
# EXTERNAL SERVICES (AZURE & OPENAI)
# =============================================================================

class AIHelper:
    @staticmethod
    async def speech_to_text(audio_data: bytes) -> str:
        # Placeholder for actual Azure implementation
        # Real implementation would use azure.cognitiveservices.speech
        return "Ovozli xabar qabul qilindi (Tizim hozirda test rejimida)"

    @staticmethod
    async def ask_gpt(text: str) -> str:
        try:
            from openai import AsyncOpenAI
            if not Config.OPENAI_API_KEY:
                return "AI kaliti sozlanmagan."
                
            client = AsyncOpenAI(api_key=Config.OPENAI_API_KEY)
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": text}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"AI Xatolik: {e}"

# =============================================================================
# BOT LOGIC
# =============================================================================

router = Router()
db = Database()

def get_main_keyboard(is_premium: bool):
    kb = InlineKeyboardBuilder()
    
    # 1. WebApp va Copilot (Eng muhim)
    kb.button(text="🌐 Nexus WebApp", web_app=WebAppInfo(url=Config.WEBAPP_URL))
    kb.button(text="🧠 Bing Copilot", url=Config.BING_URL)
    
    # 2. Premium (Agar yo'q bo'lsa)
    if not is_premium:
        kb.button(text="💎 Premium Olish", callback_data="buy_premium")
    
    # 3. Yordam
    kb.button(text="🆘 Yordam", url=f"https://t.me/{Config.SUPPORT_USERNAME.replace('@', '')}")
    
    kb.adjust(1)
    return kb.as_markup()

@router.message(CommandStart())
async def cmd_start(message: Message):
    user = await db.get_or_create_user(
        message.from_user.id,
        message.from_user.full_name,
        message.from_user.username
    )
    
    is_premium = user.get('isPremium') if user else False
    status = "💎 PREMIUM" if is_premium else "👤 Oddiy Foydalanuvchi"
    
    txt = (
        f"👋 <b>Assalomu alaykum, {message.from_user.full_name}!</b>\n\n"
        f"🤖 <b>Nexus AI</b> tizimiga xush kelibsiz.\n"
        f"📊 Sizning status: <b>{status}</b>\n\n"
        "👇 Quyidagi menyudan foydalaning:"
    )
    
    await message.answer(txt, reply_markup=get_main_keyboard(is_premium))

# --- PAYMENT FLOW ---

@router.callback_query(F.data == "buy_premium")
async def show_pricing(callback: CallbackQuery):
    kb = InlineKeyboardBuilder()
    kb.button(text=f"📅 1 Kun - {Config.PRICES['daily']['amount']:,} so'm", callback_data="pay_daily")
    kb.button(text=f"🗓 1 Oy - {Config.PRICES['monthly']['amount']:,} so'm", callback_data="pay_monthly")
    kb.button(text="⬅️ Orqaga", callback_data="main_menu")
    kb.adjust(1)
    
    await callback.message.edit_text(
        "<b>💎 Premium Tarifni Tanlang:</b>\n\n"
        "✨ Cheksiz AI so'rovlar\n"
        "✨ Barcha media kontentlar\n"
        "✨ Reklamasiz rejim",
        reply_markup=kb.as_markup()
    )

@router.callback_query(F.data.in_({"pay_daily", "pay_monthly"}))
async def initiate_payment(callback: CallbackQuery, state: FSMContext):
    plan_type = callback.data.split("_")[1]
    plan = Config.PRICES[plan_type]
    
    await state.update_data(plan_type=plan_type, amount=plan['amount'], name=plan['name'])
    await state.set_state(PaymentState.waiting_for_receipt)
    
    txt = (
        f"💳 <b>To'lov Ma'lumotlari:</b>\n\n"
        f"💰 Summa: <b>{plan['amount']:,} so'm</b>\n"
        f"📦 Tarif: <b>{plan['name']}</b>\n\n"
        f"💳 Karta: <code>{Config.PAYMENT_CARD}</code>\n"
        f"👤 Qabul qiluvchi: <b>Asadbek O.</b>\n\n"
        "❗️ Iltimos, to'lovni amalga oshirib, chek (skrinshot)ni shu yerga yuboring."
    )
    
    kb = InlineKeyboardBuilder()
    kb.button(text="bekor qilish", callback_data="cancel_payment")
    
    await callback.message.edit_text(txt, reply_markup=kb.as_markup())

@router.message(PaymentState.waiting_for_receipt, F.photo)
async def process_receipt(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()
    user = message.from_user
    
    # Adminlarga yuborish
    for admin_id in Config.ADMIN_IDS:
        try:
            kb = InlineKeyboardBuilder()
            kb.button(text="✅ Tasdiqlash", callback_data=f"approve_{user.id}_{data['plan_type']}")
            kb.button(text="❌ Rad etish", callback_data=f"reject_{user.id}")
            
            await bot.send_photo(
                chat_id=admin_id,
                photo=message.photo[-1].file_id,
                caption=(
                    f"💰 <b>Yangi To'lov!</b>\n\n"
                    f"👤 User: {user.full_name} (@{user.username})\n"
                    f"🆔 ID: <code>{user.id}</code>\n"
                    f"📦 Tarif: {data['name']}\n"
                    f"💵 Summa: {data['amount']:,} so'm"
                ),
                reply_markup=kb.as_markup()
            )
        except Exception as e:
            logging.error(f"Admin send error: {e}")
            
    await message.answer("✅ <b>Chek qabul qilindi!</b>\nAdminlar tasdiqlagach, Premium avtomatik faollashadi.")
    await state.clear()

# --- ADMIN ACTIONS ---

@router.callback_query(F.data.startswith("approve_"))
async def admin_approve(callback: CallbackQuery, bot: Bot):
    try:
        _, user_id, plan_type = callback.data.split("_")
        user_id = int(user_id)
        days = Config.PRICES[plan_type]['duration']
        
        # DB Update
        if await db.add_premium(user_id, days):
            await bot.send_message(
                user_id,
                "🎉 <b>Tabriklaymiz!</b>\nSizning to'lovingiz tasdiqlandi va Premium faollashtirildi! ✅"
            )
            await callback.message.edit_caption(caption=f"{callback.message.caption}\n\n✅ <b>TASDIQLANDI (Admin: {callback.from_user.first_name})</b>")
        else:
            await callback.answer("Xatolik bo'ldi", show_alert=True)
    except Exception as e:
        logging.error(f"Approval error: {e}")
        await callback.answer("Tizim xatoligi", show_alert=True)

@router.callback_query(F.data.startswith("reject_"))
async def admin_reject(callback: CallbackQuery, bot: Bot):
    try:
        user_id = int(callback.data.split("_")[1])
        
        await bot.send_message(
            user_id,
            "❌ <b>To'lov rad etildi.</b>\nIltimos, qayta tekshirib ko'ring yoki admin bilan bog'laning."
        )
        await callback.message.edit_caption(caption=f"{callback.message.caption}\n\n❌ <b>RAD ETILDI (Admin: {callback.from_user.first_name})</b>")
    except Exception as e:
        logging.error(f"Reject error: {e}")

@router.callback_query(F.data == "main_menu")
async def back_to_main(callback: CallbackQuery):
    await cmd_start(callback.message)

@router.callback_query(F.data == "cancel_payment")
async def cancel_pay(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.delete()
    await callback.message.answer("To'lov bekor qilindi.")

# =============================================================================
# MAIN EXECUTION
# =============================================================================

async def main():
    # Logging configuration
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    if not Config.BOT_TOKEN:
        logging.error("BOT_TOKEN is missing!")
        return

    # Initialize Bot and Dispatcher
    bot = Bot(token=Config.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()
    
    # Register routers
    dp.include_router(router)
    
    logging.info("🚀 Nexus Media Bot Started...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Bot stopped")
