import axios from 'axios';
import { storage } from './storage';

const IPTV_URL = "http://otv4k.art:80/get.php?username=9287247531&password=6043452652&type=m3u_plus&output=ts";

export async function syncIptvData() {
  console.log("Starting IPTV data sync from:", IPTV_URL);
  try {
    const response = await axios.get(IPTV_URL, {
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const content = response.data;
    const lines = content.split('\n');

    let currentItem: any = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        // Parse metadata
        const nameMatch = line.match(/,(.*)$/);
        const logoMatch = line.match(/tvg-logo="(.*?)"/);
        const groupMatch = line.match(/group-title="(.*?)"/);
        
        currentItem = {
          name: nameMatch ? nameMatch[1].trim() : "Unknown",
          logo: logoMatch ? logoMatch[1] : null,
          category: groupMatch ? groupMatch[1] : "General",
        };
      } else if (line.startsWith('http')) {
        if (currentItem) {
          currentItem.url = line;
          
          // Basic heuristic to categorize
          const lowerName = currentItem.name.toLowerCase();
          const category = currentItem.category.toLowerCase();
          
          if (category.includes('movie') || category.includes('cinema')) {
             // Avoid duplicates by name for now, or use better unique ID if available
             await storage.createMovie({
               title: currentItem.name,
               videoUrl: currentItem.url,
               posterUrl: currentItem.logo,
               description: `Category: ${currentItem.category}`,
               year: 2024,
               category: currentItem.category
             });
          } else if (category.includes('series') || category.includes('episode')) {
            // This is a simplified series import; ideally we'd group them
            await storage.createSeries({
              title: currentItem.name,
              posterUrl: currentItem.logo,
              description: `Category: ${currentItem.category}`,
              year: 2024,
              category: currentItem.category
            });
          } else {
            await storage.createChannel({
              name: currentItem.name,
              url: currentItem.url,
              logo: currentItem.logo,
              category: currentItem.category,
              country: "Global"
            });
          }
          currentItem = null;
        }
      }
    }
    console.log("IPTV data sync completed.");
  } catch (error) {
    console.error("Error syncing IPTV data:", error);
  }
}
