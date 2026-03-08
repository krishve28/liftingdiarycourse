---
name: workout-chart
description: Query the database for all workout entries and generate a bar chart showing workouts per month, exported as workout_chart.png. Use this skill whenever the user asks to visualize workout data, chart workouts, see workout frequency, or generate any chart/graph from the database.
---

# Workout Chart Generator

Generate a bar chart of workouts per month from the database and export it as `workout_chart.png`.

## How to run

Execute the bundled Python script:

```bash
python3 /Users/mpkvez/2026code/liftingdiarycourse/.claude/skills/workout-chart/scripts/generate_chart.py
```

The script will:
1. Auto-install missing Python packages (`psycopg2-binary`, `matplotlib`, `python-dotenv`)
2. Find the `.env` file by walking up from the current working directory
3. Read `DATABASE_URL` from it and connect to the PostgreSQL database
4. Query all rows from the `workouts` table
5. Aggregate by month and plot a bar chart
6. Save the result as `workout_chart.png` in the current working directory and print the path

## What to tell the user

After the script runs successfully, tell the user:
- The chart has been saved as `workout_chart.png` in their current directory
- They can open it with any image viewer

If there are no workouts in the database, the script will say so and exit gracefully — inform the user that no data was found.
