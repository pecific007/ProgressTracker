from datetime import datetime

from flask import Flask, jsonify, render_template, request, url_for, redirect
from helper import validate_input, Status, Difficulty, Tags
from database import select_entries, add_entry


app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index_view():
    return render_template("index.html")


@app.route("/add", methods=["GET", "POST"])
def add_view():
    if request.method == "POST":
        title = request.form.get("title")
        link = request.form.get("link")
        status = request.form.get("status")
        tag = request.form.get("tag")
        difficulty = request.form.get("difficulty")
        revisit = request.form.get("revisit")
        note = request.form.get("note")
        if (
            not title
            or not link
            or not status
            or not tag
            or not difficulty
        ): return redirect(url_for("add_view", error="Please fill out the form."))
        if not validate_input(status): return redirect(url_for("add_view", error="Invalid status."))
        if not validate_input(tag): return redirect(url_for("add_view", error="Invalid tag."))
        if not validate_input(difficulty): return redirect(url_for("add_view", error="Invalid difficulty."))
        if status == Status.Solved.value:
            solved_time = datetime.now()
        else:
            solved_time = ""
        add_entry(
            title=title,
            link=link,
            solved_at=solved_time,
            status=Status(status),
            tag=Tags(tag),
            difficulty=Difficulty(difficulty),
            revisit=False if not revisit else True,
            note=note,
        )
        return redirect(url_for("index_view"))
    else:
        return render_template(
            "add.html",
            error=request.args.get("error"),
            status=Status,
            tag=Tags,
            difficulty=Difficulty,
        )

@app.route("/delete")
def delete_endpoint():
    if request.method=="POST":
        return redirect(url_for("index_view"))
    return redirect(url_for("index_view"))

@app.get("/api/entries")
def get_entries():
    return jsonify(select_entries())
