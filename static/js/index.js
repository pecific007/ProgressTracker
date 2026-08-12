document.addEventListener("DOMContentLoaded", () => {
  /* The element this will generate:
  <div class="entry-wrapper">
      <div class="entry-header">
          <h1 class="entry-title">First</h1>
      </div>
      <div class="entry-info">
          <span class="entry-status" data-status="pending">pending</span>
          <span class="entry-tag">BFS</span>
          <span class="entry-difficulty" data-difficulty="hard">hard</span>
      </div>
      <div class="entry-data">
          <a class="entry-link hyperlink" href="https://pecific007.github.io">https://pecific007.github.io</a>
          <div class="entry-note">
              It's a tough one
          </div>
      </div>
  </div>
  */
  fetch("/api/entries")
    .then(res => res.json())
    .then(entries => {
      const container = document.querySelector(".entries")
      for (let entry of entries) {
        const entryWrapper = document.createElement("div");
        entryWrapper.classList.add("entry-wrapper");

        /*
        <div class="entry-header">
          <h1 class="entry-title">Title</h1>
          <span class="entry-date">2026-08-12 ...</span>
        </div>
        */
        const entryHeader = document.createElement("div");
        entryHeader.classList.add("entry-header")
        const entryTitle = document.createElement("h1");
        entryTitle.classList.add("entry-title");
        entryTitle.textContent = `${entry["title"]}`;
        entryHeader.appendChild(entryTitle);
        if (entry["solved_at"] != "") {
          const entryDate = document.createElement("span");
          const timestamp = entry["solved_at"] ?? "";
          const [date = "", time = ""] = timestamp.split(" ")
          const [hr, min, _] = time.split(":");
          entryDate.textContent = `Solved at: ${date} ${hr}:${min}`;
          entryHeader.appendChild(entryDate);
        }

        /*
        <div class="entry-info">
            <span class="entry-status" data-status="pending">pending</span>
            <span class="entry-tag">BFS</span>
            <span class="entry-difficulty" data-difficulty="hard">hard</span>
        </div>
        */
        const entryInfo = document.createElement("div");
        entryInfo.classList.add("entry-info");
        const entryStatus = document.createElement("span");
        const entryTag = document.createElement("span");
        const entryDifficulty = document.createElement("span");
        entryStatus.classList.add("entry-status");
        entryStatus.textContent = entryStatus.dataset.status = entry["status"];
        entryTag.classList.add("entry-tag");
        entryTag.textContent = entryTag.dataset.tag = entry["tag"];
        entryDifficulty.classList.add("entry-difficulty");
        entryDifficulty.dataset.difficulty = entry["difficulty"];
        entryDifficulty.textContent = entry["difficulty"];
        entryInfo.appendChild(entryStatus);
        entryInfo.appendChild(entryTag);
        entryInfo.appendChild(entryDifficulty);
        if (entry["revisit"] > 0) {
          const entryRevisit = document.createElement("span");
          entryRevisit.classList.add("entry-revisit");
          entryRevisit.textContent = "re-visit";
          entryInfo.appendChild(entryRevisit);
        }

        /*
        <div class="entry-data">
            <a class="entry-link hyperlink" href="https://pecific007.github.io">https://pecific007.github.io</a>
            <div class="entry-note">
                It's a tough one
            </div>
        </div>
        */
        const entryData = document.createElement("div");
        entryData.classList.add("entry-data");
        const entryLink = document.createElement("a");
        const entryNote = document.createElement("div")
        entryLink.classList.add("entry-link");
        entryLink.classList.add("hyperlink");
        entryLink.textContent = entryLink.href = entry["link"];
        entryNote.classList.add("entry-note");
        entryNote.textContent = entry["note"];
        entryData.appendChild(entryLink);
        entryData.appendChild(entryNote);

        entryWrapper.appendChild(entryHeader);
        entryWrapper.appendChild(entryInfo);
        entryWrapper.appendChild(entryData);

        container.appendChild(entryWrapper);
      }
    })
    .catch(err => console.error(err))
})
