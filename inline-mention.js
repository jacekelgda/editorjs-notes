import mentionsService from "./mention-service.js";

export default class InlineMention {
  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      a: {
        href: true,
        rel: true,
      },
    };
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
  }

  get CSS() {
    return {
      input: "ce-inline-tool-input",
      inputShowed: "ce-inline-tool-input--showed",
      ul: "tiny",
      liActive: "bg-muted",
    };
  }

  constructor({ api }) {
    this.api = api;
    this._state = false;
    this.nodes = {
      input: null,
      userList: null,
      anchor: null,
    };
  }

  render() {
    return document.createElement("span");
  }

  surround(range) {}

  checkState() {
    const a = this.api.selection.findParentTag("A");

    this.state = a?.rel === "tag";

    if (this.state) {
      this.showActions(a);
    } else {
      this.hideActions();
    }
  }

  renderActions() {
    this.wrapper = document.createElement("div");
    this.nodes.input = document.createElement("input");
    this.nodes.input.placeholder = "Search for a user";
    this.nodes.input.classList.add(this.CSS.input);
    this.nodes.input.addEventListener("input", (e) => {
      this.getMentions(e.target.value);
    });
    this.nodes.input.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        this.enterPressed(event);
      }
      if (event.keyCode === 40 || event.keyCode === 38) {
        this.downOrUpPressed(event);
      }
    });
    this.wrapper.appendChild(this.nodes.input);
    return this.wrapper;
  }

  async createNewTag(user) {
    const response = await fetch("http://localhost:3002/note", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    return response.json();
  }

  getMentions(q) {
    mentionsService.getMentions(q).then((users) => {
      this.nodes.userList.innerHTML = "";

      users.forEach((user, i) => {
        const li = document.createElement("li");
        li.innerHTML = mentionsService.outputTemplate(user);
        if (i === 0) {
          li.classList.add(this.CSS.liActive);
        }
        li.addEventListener("click", async (e) => {
          e.preventDefault();
          const a = this.nodes.anchor;
          if (user.id < 1) {
            const data = await this.createNewTag(user);
            a.innerHTML = "@" + user.name;
            a.href = data.entityId;
          } else {
            a.innerHTML = "@" + user.name;
            a.href = user.id;
          }
          a.addEventListener("click", async (e) => {
            e.preventDefault();
            document.getElementById("refs").innerHTML = "";
            const id = e.target.href.replace("http://localhost:3000/", "");

            const response = await fetch(
              `http://localhost:3002/search/blocks/with-tag/${id}`,
              {
                method: "GET",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              }
            );

            const items = await response.json();
            items.forEach((i) => {
              const el = document.createElement("li");
              el.innerHTML = `<a href="#">[note#${i.noteId}]</a> ${i.text}`;
              document.getElementById("refs").appendChild(el);
            });
          });

          a.insertAdjacentHTML("afterend", "&nbsp;");
          this.setCursor(a.nextSibling, 1);
        });
        this.nodes.userList.appendChild(li);
      });
    });
  }

  enterPressed(event) {
    event.preventDefault();
    const firstLi = this.nodes.userList.querySelector(
      `li.${this.CSS.liActive}`
    );
    if (!firstLi) {
      return;
    }

    firstLi.click();
  }

  downOrUpPressed(event) {
    event.preventDefault();
    const currentLi = this.nodes.userList.querySelector(
      `li.${this.CSS.liActive}`
    );
    const nextLi =
      event.keyCode === 40
        ? currentLi?.nextSibling
        : currentLi?.previousSibling;
    if (nextLi) {
      currentLi.classList.remove(this.CSS.liActive);
      nextLi.classList.add(this.CSS.liActive);
    }
  }

  showActions(a) {
    if (this.nodes.userList) {
      return;
    }

    document.querySelector(`.${this.CSS.inputShowed}`).remove();
    if (a.href) {
      return;
    }

    this.nodes.anchor = a;

    this.nodes.input.classList.add(`${this.CSS.inputShowed}`);
    setTimeout(() => {
      this.nodes.input.focus();
    });

    this.nodes.userList = document.createElement("ul");
    this.nodes.userList.classList.add(this.CSS.ul);
    this.wrapper.appendChild(this.nodes.userList);
    this.getMentions();
  }

  hideActions() {
    this.nodes.input.classList.remove(this.CSS.inputShowed);
    this.nodes.input.value = "";
    this.nodes.anchor = null;
    if (this.nodes.userList) {
      this.nodes.userList.remove();
      this.nodes.userList = null;
    }
  }

  clear() {
    this.hideActions();
  }

  setCursor(element, offset) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(element, offset);
    range.setEnd(element, offset);

    selection.removeAllRanges();
    selection.addRange(range);

    return range.getBoundingClientRect();
  }
}
