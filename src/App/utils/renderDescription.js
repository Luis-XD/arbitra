import { createElement, Fragment } from "react";

export function renderDescription(rawText = "") {
  const lines = String(rawText ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const introLines = [];
  const bulletItems = [];
  let inList = false;

  for (const line of lines) {
    const startsWithBullet = /^[-•*]\s+/.test(line);
    const cleanLine = line.replace(/^[-•*]\s+/, "");

    if (startsWithBullet || inList) {
      bulletItems.push(cleanLine);
    } else {
      introLines.push(cleanLine);
      if (cleanLine.endsWith(":")) {
        inList = true;
      }
    }
  }

  const children = [];

  if (introLines.length > 0) {
    children.push(
      createElement("h2", { key: "intro" }, introLines.join(" "))
    );
  }

  if (bulletItems.length > 0) {
    const listItems = bulletItems.map((item, idx) => {
      const colonIndex = item.indexOf(":");
      if (colonIndex > 0) {
        const heading = item.slice(0, colonIndex + 1);
        const rest = item.slice(colonIndex + 1);
        return createElement(
          "li",
          { key: idx },
          createElement("strong", null, heading),
          rest
        );
      }
      return createElement("li", { key: idx }, item);
    });

    children.push(createElement("ul", { key: "bullets" }, listItems));
  }

  return createElement(Fragment, null, ...children);
}