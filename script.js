const root = document.documentElement;
root.classList.add("js");
const themeToggle = document.querySelector(".theme-toggle");
const nightSky = document.querySelector(".night-sky");
const pageLoader = document.querySelector(".page-loader");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const isHomePage =
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/index.html");
if (pageLoader && isHomePage &&
    !sessionStorage.getItem("kshiraja-intro-seen")) {
  sessionStorage.setItem("kshiraja-intro-seen", "true");
  if (prefersReducedMotion) {
    pageLoader.remove();
  } else {
    window.setTimeout(() => {
      pageLoader.classList.add("is-leaving");
      window.setTimeout(() => pageLoader.remove(), 280);
    }, 420);
  }
} else {
  if (pageLoader) pageLoader.remove();
}

themeToggle.setAttribute(
  "aria-pressed",
  String(root.dataset.theme === "dark"),
);
themeToggle.setAttribute(
  "aria-label",
  root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
);

themeToggle.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
  localStorage.setItem("kshiraja-theme", theme);
});

const starSides = [2, 3, 1, 2, 3, 2, 1, 2, 1, 3, 2, 1];
const starTops = [7, 21, 34, 48, 62, 77, 91, 14, 30, 51, 70, 88];
const starSizes = [13, 24, 17, 29, 19, 26, 14, 21, 31, 16, 25, 12];
for (let index = 0; index < starSides.length; index += 1) {
  const star = document.createElement("span");
  star.className = "night-star";
  star.setAttribute("aria-hidden", "true");
  star.append(document.createElement("span"));
  star.firstElementChild.className = "night-star-core";
  const isRight = index % 2 === 1;
  star.style.setProperty(
    "--star-left",
    isRight ? `${100 - starSides[index]}%` : `${starSides[index]}%`,
  );
  star.style.setProperty("--star-top", `${starTops[index]}%`);
  star.style.setProperty("--star-size", `${starSizes[index]}px`);
  star.style.setProperty("--star-delay", `${-((index * 13) % 49) / 10}s`);
  nightSky.append(star);
}

const siteNavigations = [...document.querySelectorAll(".site-nav")];
siteNavigations.forEach((navigation) => {
  const indicator = navigation.querySelector(".nav-indicator");
  const links = [...navigation.querySelectorAll(".nav-link")];
  if (!indicator || links.length === 0) return;

  const moveIndicator = (link) => {
    navigation.style.setProperty("--indicator-x", `${link.offsetLeft}px`);
    navigation.style.setProperty("--indicator-width", `${link.offsetWidth}px`);
    navigation.classList.add("has-indicator");
  };
  const activeLink = navigation.querySelector(".nav-link.is-active");
  if (activeLink) moveIndicator(activeLink);

  navigation.addEventListener("pointerover", (event) => {
    const link = event.target instanceof Element
      ? event.target.closest(".nav-link")
      : null;
    if (link && navigation.contains(link)) moveIndicator(link);
  });
  navigation.addEventListener("pointerleave", () => {
    if (activeLink) moveIndicator(activeLink);
  });
  navigation.addEventListener("focusin", (event) => {
    const link = event.target instanceof Element
      ? event.target.closest(".nav-link")
      : null;
    if (link && navigation.contains(link)) moveIndicator(link);
  });
  navigation.addEventListener("focusout", (event) => {
    if (!navigation.contains(event.relatedTarget) && activeLink) {
      moveIndicator(activeLink);
    }
  });

  window.addEventListener("resize", () => {
    if (activeLink) moveIndicator(activeLink);
  });
});

const progressBar = document.querySelector(".scroll-progress");
const updateScrollProgress = () => {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
};
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const aboutLinks = [...document.querySelectorAll(".about-nav-link")];
if ("IntersectionObserver" in window && aboutLinks.length > 0) {
  const aboutSections = aboutLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        aboutLinks.forEach((link) => {
          const isCurrent = link.hash === `#${entry.target.id}`;
          link.classList.toggle("is-current", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );
  aboutSections.forEach((section) => aboutObserver.observe(section));
}

const shelfTabs = [...document.querySelectorAll(".shelf-tab")];
const shelfPanel = document.querySelector(".shelf-panel");
if (shelfTabs.length > 0 && shelfPanel) {
  const shelfMessages = {
    books: "bookshelf and current favorites go here.",
    music: "songs, albums, and repeat listens go here.",
    movies: "films and stories i keep thinking about go here.",
  };
  const activateShelfTab = (tab) => {
    shelfTabs.forEach((shelfTab) => {
      const selected = shelfTab === tab;
      shelfTab.classList.toggle("is-selected", selected);
      shelfTab.setAttribute("aria-selected", String(selected));
      shelfTab.tabIndex = selected ? 0 : -1;
    });
    shelfPanel.setAttribute("aria-labelledby", tab.id);
    shelfPanel.querySelector(".shelf-empty").textContent =
      shelfMessages[tab.dataset.shelf];
  };
  shelfTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateShelfTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % shelfTabs.length;
      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + shelfTabs.length) % shelfTabs.length;
      }
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = shelfTabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      shelfTabs[nextIndex].focus();
      activateShelfTab(shelfTabs[nextIndex]);
    });
  });
}

const tinkerCards = [...document.querySelectorAll(".tinker-card")];
const mediumFilters = [...document.querySelectorAll("[data-medium-filter]")];
const statusFilters = [...document.querySelectorAll("[data-status-filter]")];

const setFilterState = (buttons, selected) => {
  buttons.forEach((button) => {
    const active = button === selected;
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
};

if (tinkerCards.length > 0) {
  let selectedMedium = "all";
  let selectedStatus = "all";
  const applyTinkerFilters = () => {
    tinkerCards.forEach((card) => {
      const hasMedium =
        selectedMedium === "all" ||
        card.dataset.medium.split(/\s+/).includes(selectedMedium);
      const hasStatus =
        selectedStatus === "all" || card.dataset.status === selectedStatus;
      card.hidden = !hasMedium || !hasStatus;
      if (!card.hidden) card.classList.add("is-visible");
    });
  };

  mediumFilters.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMedium = button.dataset.mediumFilter;
      setFilterState(mediumFilters, button);
      applyTinkerFilters();
    });
  });
  statusFilters.forEach((button) => {
    button.addEventListener("click", () => {
      selectedStatus = button.dataset.statusFilter;
      setFilterState(statusFilters, button);
      applyTinkerFilters();
    });
  });

  tinkerCards.forEach((card) => {
    card.tabIndex = 0;
    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a, button")) {
        return;
      }
      card.classList.toggle("is-expanded");
    });
  });
}

const taskDialog = document.querySelector(".task-dialog");
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#new-task");
const taskList = document.querySelector(".task-list");
if (taskDialog && taskForm && taskInput && taskList) {
  const storageKey = "kshiraja-thought-companion-tasks";
  const readTasks = () => {
    const savedTasks = localStorage.getItem(storageKey);
    if (!savedTasks) return [];
    try {
      const tasks = JSON.parse(savedTasks);
      return Array.isArray(tasks)
        ? tasks.filter((task) => typeof task === "string")
        : [];
    } catch (error) {
      if (error instanceof SyntaxError) {
        localStorage.removeItem(storageKey);
        return [];
      }
      throw error;
    }
  };

  const renderTasks = () => {
    taskList.replaceChildren();
    readTasks().forEach((task) => {
      const item = document.createElement("li");
      item.textContent = task;
      taskList.append(item);
    });
  };

  renderTasks();
  document.querySelector("[data-new-task]").addEventListener("click", () => {
    taskDialog.showModal();
    taskInput.focus();
  });
  taskDialog
    .querySelector(".task-dialog-close")
    .addEventListener("click", () => taskDialog.close());
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const task = taskInput.value.trim();
    if (!task) return;
    const tasks = readTasks();
    tasks.push(task);
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    taskInput.value = "";
    renderTasks();
    taskInput.focus();
  });
}

const cursor = document.querySelector(".custom-cursor");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  root.classList.add("has-custom-cursor");
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursor.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursor.classList.add("is-visible");
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const target = event.target;
    cursor.classList.toggle(
      "is-hovering",
      target instanceof Element && Boolean(target.closest("a, button")),
    );
  });
  document.addEventListener("pointerout", (event) => {
    const target = event.relatedTarget;
    if (!target) cursor.classList.remove("is-visible");
    if (!(target instanceof Element) || !target.closest("a, button")) {
      cursor.classList.remove("is-hovering");
    }
  });
}

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});
