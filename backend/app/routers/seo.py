from fastapi import APIRouter, Response

router = APIRouter(tags=["SEO"])

@router.get("/robots.txt", response_class=Response)
async def get_robots_txt():
    """Отдает правила обхода для поисковых роботов"""
    content = """User-agent: *
Disallow: /admin/
Disallow: /my-decks/
Disallow: /deck/
Allow: /
Sitemap: http://localhost:8000/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")

@router.get("/sitemap.xml", response_class=Response)
async def get_sitemap():
    """Отдает карту сайта для индексируемых маршрутов"""
    content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>http://localhost:5173/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
   </url>
   <url>
      <loc>http://localhost:5173/login</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
   </url>
   <url>
      <loc>http://localhost:5173/register</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
   </url>
</urlset>"""
    return Response(content=content, media_type="application/xml")