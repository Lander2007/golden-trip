"use client"

import { useServerInsertedHTML } from "next/navigation"

export default function PerfBootScript() {
  useServerInsertedHTML(() => (
    <>
      <script
        id="perf-boot"
        dangerouslySetInnerHTML={{
          __html: `(()=>{const q=new URLSearchParams(location.search);const lite=matchMedia("(max-width: 767px), (pointer: coarse)").matches||(navigator.hardwareConcurrency||4)<=4||matchMedia("(prefers-reduced-motion: reduce)").matches||q.has("lite");if(lite)document.documentElement.classList.add("lite");const off=q.get("off");if(off)off.split(",").forEach(f=>{const k=f.trim();if(k)document.documentElement.setAttribute("data-off-"+k,"");});})();`,
        }}
      />
      {process.env.FIGMA && process.env.NODE_ENV === "development" && (
        <script
          id="preview-hydration-cleanup"
          dangerouslySetInnerHTML={{
            __html: `
            (() => {
              const attribute = "data--h-bstatus";
              let isCleaning = false;
              const clean = (node) => {
                if (isCleaning || !(node instanceof Element)) return;
                isCleaning = true;
                try {
                  if (node.hasAttribute(attribute)) node.removeAttribute(attribute);
                  const els = node.querySelectorAll("[" + attribute + "]");
                  for (let i = 0; i < els.length; i++) {
                    els[i].removeAttribute(attribute);
                  }
                } finally {
                  isCleaning = false;
                }
              };
              clean(document.documentElement);
              const observer = new MutationObserver((records) => {
                if (isCleaning) return;
                for (let i = 0; i < records.length; i++) {
                  const record = records[i];
                  if (record.type === "attributes") {
                    if (record.target instanceof Element && record.target.hasAttribute(attribute)) {
                      clean(record.target);
                    }
                  } else if (record.addedNodes) {
                    for (let j = 0; j < record.addedNodes.length; j++) {
                      clean(record.addedNodes[j]);
                    }
                  }
                }
              });
              observer.observe(document.documentElement, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: [attribute]
              });
              window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
            })();
          `,
          }}
        />
      )}
    </>
  ))

  return null
}
