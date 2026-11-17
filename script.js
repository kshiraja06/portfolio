const root = document.documentElement;
root.classList.add("js");
const themeToggle = document.querySelector(".theme-toggle");
const nightSky = document.querySelector(".night-sky");
const pageLoader = document.querySelector(".page-loader");
const introGate = document.querySelector(".intro-gate");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const isHomePage =
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/index.html");
const introSeenKey = "kshiraja-space-intro-seen";
if (
  introGate &&
  isHomePage &&
  !prefersReducedMotion &&
  !sessionStorage.getItem(introSeenKey)
) {
  const exploreButtons = [...introGate.querySelectorAll("[data-intro-explore]")];

  if (exploreButtons.length > 0) {
    introGate.showModal();
    introGate.focus();
    document.body.classList.add("has-intro-gate");
    introGate.addEventListener("close", () => {
      document.body.classList.remove("has-intro-gate");
    });

    const finishIntro = () => {
      if (introGate.dataset.action) return;
      introGate.dataset.action = "explore";
      const shipBounds = introGate.querySelector(".space-ship").getBoundingClientRect();
      introGate.style.setProperty(
        "--beam-origin-x",
        `${((shipBounds.left + shipBounds.width / 2) / window.innerWidth) * 100}%`,
      );
      introGate.style.setProperty(
        "--beam-origin-y",
        `${((shipBounds.top + shipBounds.height / 2) / window.innerHeight) * 100}%`,
      );
      sessionStorage.setItem(introSeenKey, "true");
      exploreButtons.forEach((button) => {
        button.disabled = true;
      });
      window.setTimeout(() => {
        introGate.close();
        document.body.classList.remove("has-intro-gate");
      }, 1100);
    };

    exploreButtons.forEach((button) => {
      button.addEventListener("click", finishIntro);
    });
    introGate.addEventListener("cancel", (event) => {
      event.preventDefault();
      sessionStorage.setItem(introSeenKey, "true");
      introGate.close();
      document.body.classList.remove("has-intro-gate");
    });
  } else {
    introGate.remove();
  }
} else {
  if (introGate) introGate.remove();
}
if (pageLoader) pageLoader.remove();

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

const introStarfield = document.querySelector(".space-starfield");
if (introStarfield) {
  for (let index = 0; index < 120; index += 1) {
    const star = document.createElement("span");
    star.className = "space-star";
    star.style.setProperty("--star-left", `${Math.random() * 100}%`);
    star.style.setProperty("--star-top", `${Math.random() * 100}%`);
    star.style.setProperty("--star-size", `${Math.random() < 0.8 ? 1 + Math.random() * 2 : 2 + Math.random() * 2}px`);
    star.style.setProperty("--star-delay", `${-Math.random() * 8}s`);
    star.setAttribute("aria-hidden", "true");
    introStarfield.append(star);
  }
}

const starPositions = Array.from({ length: 52 }, () => [
  3 + Math.random() * 94,
  3 + Math.random() * 94,
]);
const starSizes = starPositions.map((_, index) =>
  index % 4 === 0 ? 6 + Math.random() * 8 : 1 + Math.random() * 3);
const starElements = [];
for (let index = 0; index < starPositions.length; index += 1) {
  const star = document.createElement("span");
  star.className = "night-star";
  if (starSizes[index] < 4) star.classList.add("is-dot");
  star.setAttribute("aria-hidden", "true");
  star.append(document.createElement("span"));
  star.firstElementChild.className = "night-star-core";
  star.style.setProperty("--star-size", `${starSizes[index]}px`);
  star.style.setProperty("--star-delay", `${-Math.random() * 9}s`);
  nightSky.append(star);
  starElements.push(star);
}

const positionStars = () => {
  const pageShell = document.querySelector(".page-shell");
  const walker = document.createTreeWalker(pageShell, NodeFilter.SHOW_TEXT);
  const textRects = [];
  let textNode = walker.nextNode();
  while (textNode) {
    if (textNode.textContent.trim()) {
      const range = document.createRange();
      range.selectNodeContents(textNode);
      for (const rect of range.getClientRects()) {
        if (rect.width && rect.height) {
          textRects.push({
            left: rect.left,
            right: rect.right,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
          });
        }
      }
    }
    textNode = walker.nextNode();
  }

  const width = document.documentElement.clientWidth;
  const height = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  const horizontalPositions = Array.from({ length: 19 }, (_, index) =>
    width * ((index + 1) * 5) / 100);
  const verticalOffsets = [0, -18, 18, -36, 36, -54, 54, -72, 72, -90, 90, -108, 108];
  const placedStars = [];

  starElements.forEach((star, index) => {
    const size = starSizes[index];
    const clearance = size / 2 + 18;
    const preferredX = width * starPositions[index][0] / 100;
    const preferredY = height * starPositions[index][1] / 100;
    const candidates = horizontalPositions.flatMap((x) =>
      verticalOffsets.map((offset) => ({
        x,
        y: preferredY + offset,
        distance: Math.abs(x - preferredX) + Math.abs(offset),
      })),
    ).sort((first, second) => first.distance - second.distance);
    const position = candidates.find(({ x, y }) => {
      if (
        x - clearance < 0 ||
        x + clearance > width ||
        y - clearance < 0 ||
        y + clearance > height
      ) {
        return false;
      }

      const overlapsText = textRects.some((rect) =>
        x + clearance > rect.left &&
        x - clearance < rect.right &&
        y + clearance > rect.top &&
        y - clearance < rect.bottom);
      const overlapsStar = placedStars.some((placed) =>
        Math.hypot(x - placed.x, y - placed.y) < clearance + placed.clearance);
      return !overlapsText && !overlapsStar;
    });

    if (!position) {
      star.style.display = "none";
      return;
    }

    star.style.display = "";
    star.style.setProperty("--star-left", `${position.x - size / 2}px`);
    star.style.setProperty("--star-top", `${position.y - size / 2}px`);
    placedStars.push({ ...position, clearance });
  });
};

let starPlacementFrame = 0;
const scheduleStarPlacement = () => {
  if (starPlacementFrame) window.cancelAnimationFrame(starPlacementFrame);
  starPlacementFrame = window.requestAnimationFrame(() => {
    starPlacementFrame = 0;
    positionStars();
  });
};
positionStars();
window.addEventListener("resize", scheduleStarPlacement, { passive: true });
window.addEventListener("load", scheduleStarPlacement, { once: true });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(scheduleStarPlacement);
}

const starNote = document.createElement("aside");
starNote.className = "star-note-pop";
starNote.textContent =
  "star sailor with an open switch, always open to learn <3";
starNote.setAttribute("role", "status");
starNote.setAttribute("aria-live", "polite");
starNote.setAttribute("aria-hidden", "true");
document.body.append(starNote);

let activeStarNoteButton = null;
const positionStarNote = (x, y) => {
  const bounds = starNote.getBoundingClientRect();
  const gap = 18;
  const left = x + bounds.width + gap > window.innerWidth
    ? x - bounds.width - gap
    : x + gap;
  const top = y + bounds.height + gap > window.innerHeight
    ? y - bounds.height - gap
    : y + gap;
  starNote.style.left = `${Math.max(8, left)}px`;
  starNote.style.top = `${Math.max(8, top)}px`;
};
const closeStarNote = () => {
  if (!activeStarNoteButton) return;
  activeStarNoteButton.setAttribute("aria-expanded", "false");
  activeStarNoteButton = null;
  starNote.classList.remove("is-visible");
  starNote.setAttribute("aria-hidden", "true");
};

document.querySelectorAll(".site-header .wordmark").forEach((wordmark) => {
  const star = wordmark.querySelector(".star-mark");
  const name = wordmark.querySelector("span");
  if (!(star instanceof HTMLImageElement) || !name) return;

  const homeLink = document.createElement("a");
  homeLink.className = "wordmark-name";
  homeLink.href = wordmark.getAttribute("href") || "index.html";
  homeLink.setAttribute("aria-label", "Kshiraja, home");
  homeLink.append(name);

  const starButton = document.createElement("button");
  starButton.className = "wordmark-star";
  starButton.type = "button";
  starButton.setAttribute("aria-label", "Star sailor note");
  starButton.setAttribute("aria-expanded", "false");
  starButton.append(star);

  const wordmarkGroup = document.createElement("div");
  wordmarkGroup.className = "wordmark";
  wordmarkGroup.append(starButton, homeLink);
  wordmark.replaceWith(wordmarkGroup);

  const showStarNote = (x, y) => {
    closeStarNote();
    activeStarNoteButton = starButton;
    starButton.setAttribute("aria-expanded", "true");
    starNote.setAttribute("aria-hidden", "false");
    starNote.classList.add("is-visible");
    positionStarNote(x, y);

  };
  starButton.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    showStarNote(event.clientX, event.clientY);
  });
  starButton.addEventListener("pointermove", (event) => {
    if (activeStarNoteButton === starButton) {
      positionStarNote(event.clientX, event.clientY);
    }
  }, { passive: true });
  starButton.addEventListener("pointerleave", () => {
    if (!starButton.matches(":focus-visible")) closeStarNote();
  });
  starButton.addEventListener("focus", () => {
    if (!starButton.matches(":focus-visible")) return;
    const bounds = starButton.getBoundingClientRect();
    showStarNote(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  });
  starButton.addEventListener("blur", () => {
    if (!starButton.matches(":focus-visible")) closeStarNote();
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeStarNote();
});

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

const aboutTabs = [...document.querySelectorAll("[data-about-tab]")];
const aboutTabPanel = document.querySelector("#about-tab-panel");
if (aboutTabs.length > 0 && aboutTabPanel) {
  const aboutTabTitle = aboutTabPanel.querySelector("h3");
  const aboutTabDescription = aboutTabPanel.querySelector("p");
  const aboutTabArtwork = [...aboutTabPanel.querySelectorAll("[data-tab-art]")];
  const activateAboutTab = (tab) => {
    aboutTabs.forEach((aboutTab) => {
      const selected = aboutTab === tab;
      aboutTab.classList.toggle("is-selected", selected);
      aboutTab.setAttribute("aria-selected", String(selected));
      aboutTab.tabIndex = selected ? 0 : -1;
    });
    aboutTabPanel.setAttribute("aria-labelledby", tab.id);
    if (aboutTabTitle) aboutTabTitle.textContent = tab.dataset.panelTitle || "";
    if (aboutTabDescription) {
      aboutTabDescription.textContent = tab.dataset.panelDescription || "";
    }
    aboutTabArtwork.forEach((art) => {
      art.toggleAttribute("hidden", art.dataset.tabArt !== tab.dataset.panelArt);
    });
  };
  aboutTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateAboutTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % aboutTabs.length;
      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + aboutTabs.length) % aboutTabs.length;
      }
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = aboutTabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      aboutTabs[nextIndex].focus();
      activateAboutTab(aboutTabs[nextIndex]);
    });
  });
}

const tinkerCards = [...document.querySelectorAll(".tinker-card")];
if (tinkerCards.length > 0) {
  const tinkerGallery = document.querySelector(".tinker-gallery");
  const tinkerGalleryTitle = tinkerGallery?.querySelector(".tinker-gallery__title");
  const tinkerGalleryGrid = tinkerGallery?.querySelector(".tinker-gallery__grid");
  const tinkerGalleryClose = tinkerGallery?.querySelector(".tinker-gallery__close");
  const galleryCollections = {
    dibs: {
      title: "dibs!",
      images: [
        { src: "assets/tinker/dibs-1.png", alt: "Dibs marketplace screens and visual identity" },
        {
          src: "assets/tinker/web-media/dibs-block.mp4",
          poster: "assets/tinker/dibs-1.png",
          alt: "Animated Dibs marketplace cover",
          type: "video",
        },
      ],
    },
    "character-design": {
      title: "character design",
      images: [
        ...Array.from({ length: 6 }, (_, index) => ({
          src: `assets/tinker/gallery/characterdesign-${index + 1}.jpg`,
          alt: `Character design study ${index + 1}`,
        })),
        {
          src: "assets/tinker/gallery/characterdesign-block.jpg",
          alt: "Character design project cover",
        },
      ],
    },
    "concept-art": {
      title: "concept art",
      images: [
        { src: "assets/tinker/gallery/concept-art-1.jpg", alt: "Concept art: a speculative island city" },
        { src: "assets/tinker/gallery/concept-art-2.jpg", alt: "Concept art process and development" },
        {
          src: "assets/tinker/gallery/concept-art-block.jpg",
          alt: "Concept art project cover",
        },
      ],
    },
    "science-visualization": {
      title: "science visualization",
      images: [
        { src: "assets/tinker/star-1.webp", alt: "Scientific concept illustration, study 1" },
        { src: "assets/tinker/star-2.webp", alt: "Scientific concept illustration, study 2" },
        { src: "assets/tinker/star-3.webp", alt: "Scientific concept illustration, study 3" },
        { src: "assets/tinker/star-5.webp", alt: "Scientific concept illustration, study 5" },
        { src: "assets/tinker/star-4.webp", alt: "Science visualization project cover" },
      ],
    },
  };
  let galleryOpener = null;
  const openTinkerGallery = (card) => {
    const collection = galleryCollections[card.dataset.gallery];
    if (!tinkerGallery || !tinkerGalleryTitle || !tinkerGalleryGrid || !collection) return;

    galleryOpener = card;
    tinkerGalleryTitle.textContent = collection.title;
    tinkerGalleryGrid.replaceChildren(
      ...collection.images.map((item) => {
        if (item.type === "video") {
          const video = document.createElement("video");
          video.src = item.src;
          video.poster = item.poster;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.setAttribute("aria-label", item.alt);
          return video;
        }

        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.alt;
        image.loading = "eager";
        image.decoding = "async";
        return image;
      }),
    );
    tinkerGallery.showModal();
  };

  const tinkerVideos = tinkerCards
    .map((card) => card.querySelector("video.tinker-media"))
    .filter((video) => video instanceof HTMLVideoElement);
  const playTinkerVideo = (video) => {
    video.play().catch(() => {
      video.controls = true;
    });
  };

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          playTinkerVideo(video);
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "150px" });
    tinkerVideos.forEach((video) => videoObserver.observe(video));
  } else {
    tinkerVideos.forEach(playTinkerVideo);
  }

  tinkerCards.forEach((card) => {
    card.tabIndex = 0;
    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a, button, iframe")) {
        return;
      }
      if (card.dataset.gallery) {
        openTinkerGallery(card);
        return;
      }
      card.classList.toggle("is-expanded");
    });
    card.addEventListener("keydown", (event) => {
      if (!card.dataset.gallery || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      openTinkerGallery(card);
    });
  });

  if (tinkerGallery && tinkerGalleryClose) {
    tinkerGalleryClose.addEventListener("click", () => tinkerGallery.close());
    tinkerGallery.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      tinkerGallery.close();
    });
    tinkerGallery.addEventListener("cancel", (event) => {
      event.preventDefault();
      tinkerGallery.close();
    });
    tinkerGallery.addEventListener("click", (event) => {
      if (event.target === tinkerGallery) tinkerGallery.close();
    });
    tinkerGallery.addEventListener("close", () => {
      tinkerGallery.querySelectorAll("video").forEach((video) => video.pause());
      galleryOpener?.focus();
    });
  }
}

document.querySelectorAll(".playing-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.setAttribute("aria-pressed", String(card.getAttribute("aria-pressed") !== "true"));
  });
});

const cursors = [...document.querySelectorAll(".custom-cursor")];
const tinkerCursorPop = document.querySelector(".tinker-cursor-pop");
if (cursors.length > 0 && window.matchMedia("(pointer: fine)").matches) {
  root.classList.add("has-custom-cursor");
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      cursors.forEach((cursor) => {
        cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
        cursor.style.setProperty("--cursor-y", `${event.clientY}px`);
        cursor.classList.add("is-visible");
      });
      if (tinkerCursorPop) {
        const target = document.elementFromPoint(event.clientX, event.clientY);
        const card = target instanceof Element ? target.closest(".tinker-card") : null;
        cursors.forEach((cursor) => {
          cursor.classList.toggle("is-tinker-gallery", Boolean(card?.dataset.gallery));
        });
        if (card) {
          const title = card.querySelector(".tinker-title")?.textContent.trim();
          const description = card.querySelector(".tinker-description")?.textContent.trim();
          tinkerCursorPop.querySelector(".tinker-cursor-pop__title").textContent = title || "";
          tinkerCursorPop.querySelector(".tinker-cursor-pop__description").textContent =
            description || "";
          tinkerCursorPop.classList.add("is-visible");
          const bounds = tinkerCursorPop.getBoundingClientRect();
          const left = event.clientX + bounds.width + 22 > window.innerWidth
            ? event.clientX - bounds.width - 18
            : event.clientX + 18;
          const top = event.clientY + bounds.height + 18 > window.innerHeight
            ? event.clientY - bounds.height - 18
            : event.clientY + 18;
          tinkerCursorPop.style.left = `${Math.max(8, left)}px`;
          tinkerCursorPop.style.top = `${Math.max(8, top)}px`;
        } else {
          tinkerCursorPop.classList.remove("is-visible");
        }
      }
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    cursors.forEach((cursor) => {
      cursor.classList.toggle("is-hovering", Boolean(target.closest("a, button")));
      cursor.classList.toggle(
        "is-case-study",
        Boolean(target.closest(".project-card__media")),
      );
      cursor.classList.toggle(
        "is-tinker-gallery",
        Boolean(target.closest(".tinker-card[data-gallery]")),
      );
    });
  });
  document.addEventListener("pointerout", (event) => {
    const target = event.relatedTarget;
    cursors.forEach((cursor) => {
      if (!target) cursor.classList.remove("is-visible");
      cursor.classList.toggle(
        "is-hovering",
        target instanceof Element && Boolean(target.closest("a, button")),
      );
      cursor.classList.toggle(
        "is-case-study",
        target instanceof Element && Boolean(target.closest(".project-card__media")),
      );
      cursor.classList.toggle(
        "is-tinker-gallery",
        target instanceof Element && Boolean(target.closest(".tinker-card[data-gallery]")),
      );
    });
    if (
      tinkerCursorPop &&
      (!(target instanceof Element) || !target.closest(".tinker-card"))
    ) {
      tinkerCursorPop.classList.remove("is-visible");
    }
  });
}

document.querySelectorAll(".site-footer").forEach((footer) => {
  const links = document.createElement("nav");
  links.className = "footer-links";
  links.setAttribute("aria-label", "Social and contact links");

  const linkedIn = document.createElement("a");
  linkedIn.href = "https://www.linkedin.com/in/kshiraja-ragothaman/";
  linkedIn.target = "_blank";
  linkedIn.rel = "noopener noreferrer";
  linkedIn.textContent = "linkedin";

  const email = document.createElement("a");
  email.href = "mailto:kshiraja.rag@gmail.com";
  email.textContent = "mail";

  links.append(linkedIn, email);
  const paragraph = footer.querySelector(":scope > p");
  const copyright = paragraph?.querySelector("[data-year]")?.parentElement;
  if (paragraph && copyright) paragraph.replaceChildren(copyright);
  footer.insertBefore(links, paragraph || null);
});

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});
