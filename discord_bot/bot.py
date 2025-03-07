import discord
from discord.ext import commands

# Create a bot instance
bot = commands.Bot(command_prefix='!', intents=discord.Intents.default())

# Event: on_ready
@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')

# Slash command: ping
@bot.slash_command(name="ping", description="Responds with Pong!")
async def ping(ctx):
    await ctx.respond('Pong!')

# Slash command: navigation
@bot.slash_command(name="navigation", description="Provides navigation assistance")
async def navigation(ctx, location: str):
    # Placeholder for navigation assistance logic
    await ctx.respond(f'Navigation assistance for {location} is not yet implemented.')

# Run the bot
bot.run('YOUR_DISCORD_BOT_TOKEN')
