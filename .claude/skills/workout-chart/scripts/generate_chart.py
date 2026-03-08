#!/usr/bin/env python3
"""Query workout entries from DB and generate a bar chart of workouts per month."""

import os
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# Install dependencies if missing
def ensure_deps():
    import subprocess
    packages = ["psycopg2-binary", "matplotlib", "python-dotenv"]
    for pkg in packages:
        try:
            __import__(pkg.replace("-", "_").split("-")[0])
        except ImportError:
            print(f"Installing {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

ensure_deps()

import psycopg2
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
from dotenv import load_dotenv

# Load .env from the project root (walk up from cwd to find it)
def find_env_file():
    cwd = Path.cwd()
    for parent in [cwd] + list(cwd.parents):
        candidate = parent / ".env"
        if candidate.exists():
            return candidate
    return None

env_path = find_env_file()
if env_path:
    load_dotenv(env_path)
else:
    load_dotenv()  # fallback: default search

database_url = os.getenv("DATABASE_URL")
if not database_url:
    print("Error: DATABASE_URL not found in environment or .env file.")
    sys.exit(1)

# Query workouts
print("Connecting to database...")
conn = psycopg2.connect(database_url)
cursor = conn.cursor()
cursor.execute("SELECT created_at FROM workouts ORDER BY created_at;")
rows = cursor.fetchall()
cursor.close()
conn.close()

if not rows:
    print("No workout entries found in the database. Nothing to chart.")
    sys.exit(0)

# Aggregate by month
monthly_counts = defaultdict(int)
for (created_at,) in rows:
    key = created_at.strftime("%Y-%m")  # sortable
    monthly_counts[key] += 1

# Sort chronologically
sorted_months = sorted(monthly_counts.keys())
labels = [datetime.strptime(m, "%Y-%m").strftime("%b %Y") for m in sorted_months]
counts = [monthly_counts[m] for m in sorted_months]

# Plot
fig, ax = plt.subplots(figsize=(max(8, len(labels) * 1.2), 5))
bars = ax.bar(labels, counts, color="#4F81BD", edgecolor="white", linewidth=0.8)

ax.set_title("Workouts Per Month", fontsize=16, fontweight="bold", pad=14)
ax.set_xlabel("Month", fontsize=12)
ax.set_ylabel("Number of Workouts", fontsize=12)
ax.yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
ax.set_ylim(0, max(counts) + 1)
plt.xticks(rotation=30, ha="right")

# Label bars
for bar, count in zip(bars, counts):
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 0.05,
        str(count),
        ha="center",
        va="bottom",
        fontsize=10,
    )

plt.tight_layout()
output_path = Path.cwd() / "workout_chart.png"
plt.savefig(output_path, dpi=150)
plt.close()

print(f"Chart saved to: {output_path}")
