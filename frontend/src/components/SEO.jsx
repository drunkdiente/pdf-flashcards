import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, url, isDeckPage }) {
  const defaultTitle = "Flashcards AI - Умные шпаргалки из PDF";
  const defaultDesc = "Создавайте учебные карточки из PDF-файлов за считанные секунды с помощью искусственного интеллекта.";
  const currentUrl = url || window.location.href;

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": isDeckPage ? "Course" : "WebSite",
    "name": title || defaultTitle,
    "description": description || defaultDesc,
    "url": currentUrl
  };

  return (
    <Helmet>
      <title>{title ? `${title} | Flashcards AI` : defaultTitle}</title>
      <meta name="description" content={description || defaultDesc} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph (для соцсетей и мессенджеров) */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdData)}
      </script>
    </Helmet>
  );
}