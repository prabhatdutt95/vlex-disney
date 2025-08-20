export class SEOUtils {
  static setMeta(
    title: string,
    description: string,
    url: string = window.location.href
  ) {
    document.title = title;

    let descTag = document.querySelector<HTMLMetaElement>(
      "meta[name='description']"
    );
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.name = "description";
      document.head.appendChild(descTag);
    }
    descTag.content = description;

    let linkTag = document.querySelector<HTMLLinkElement>(
      "link[rel='canonical']"
    );
    if (!linkTag) {
      linkTag = document.createElement("link");
      linkTag.rel = "canonical";
      document.head.appendChild(linkTag);
    }
    linkTag.href = url;
  }

  static setStructuredData(schema: object) {
    const existing = document.querySelector("script[data-app-structured]");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.appStructured = "true";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }
}
