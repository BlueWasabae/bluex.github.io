const https = require('https');
const fs = require('fs');
const path = require('path');

const CHANNEL_ID = 'UCxFno7M7BjWlh-L5HNi4WAA';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function fetchHttps(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHttps(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', reject);
  });
}

async function sync() {
  console.log(`[YouTube Sync] Fetching RSS feed for channel ${CHANNEL_ID}...`);
  const { status, data: xml } = await fetchHttps(RSS_URL);
  if (status !== 200 || !xml) {
    console.error(`[YouTube Sync] Failed to fetch RSS feed. Status: ${status}`);
    return;
  }

  // Parse entries from XML
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  const videos = [];

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryBlock = match[1];
    const vidMatch = entryBlock.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entryBlock.match(/<title>([^<]+)<\/title>/);
    const publishedMatch = entryBlock.match(/<published>([^<]+)<\/published>/);
    const descMatch = entryBlock.match(/<media:description>([\s\S]*?)<\/media:description>/);

    if (vidMatch && titleMatch) {
      videos.push({
        id: vidMatch[1].trim(),
        title: titleMatch[1].trim(),
        published: publishedMatch ? publishedMatch[1].trim() : '',
        desc: descMatch ? descMatch[1].trim().replace(/[\r\n]+/g, ' ').slice(0, 180) : ''
      });
    }
  }

  console.log(`[YouTube Sync] Parsed ${videos.length} videos from RSS feed.`);
  if (videos.length === 0) return;

  const latest = videos[0];
  console.log(`[YouTube Sync] Latest video: [${latest.id}] ${latest.title}`);

  // Read index.html
  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // Build the 4 switcher buttons from top 4 videos
  const top4 = videos.slice(0, 4);
  let buttonsHtml = '            <!-- Real YouTube Video Switcher Buttons (Verified from @bluextrader Channel) -->\n            <div class="yt-video-switcher">\n';

  top4.forEach((v, index) => {
    const active = index === 0 ? ' active' : '';
    let shortLabel = v.title;
    if (shortLabel.length > 28) {
      shortLabel = shortLabel.slice(0, 26) + '…';
    }
    const safeTitle = v.title.replace(/"/g, '&quot;');
    const safeDesc = (v.desc || v.title).replace(/"/g, '&quot;');

    buttonsHtml += `              <button type="button" class="yt-switch-btn${active}" data-vid="${v.id}" data-title="${safeTitle}" data-desc="${safeDesc}">
                <span class="yt-dot"></span>
                <span>${shortLabel}</span>
              </button>\n`;
  });
  buttonsHtml += '            </div>';

  // Replace switcher in index.html
  const switcherRegex = /<!-- Real YouTube Video Switcher Buttons[\s\S]*?<\/div>/;
  if (switcherRegex.test(html)) {
    html = html.replace(switcherRegex, buttonsHtml);
  }

  // Update iframe src
  html = html.replace(
    /id="mainYouTubeIframe"\s+src="https:\/\/www\.youtube-nocookie\.com\/embed\/[a-zA-Z0-9_-]+\?rel=0&amp;enablejsapi=1"/,
    `id="mainYouTubeIframe"\n                src="https://www.youtube-nocookie.com/embed/${latest.id}?rel=0&amp;enablejsapi=1"`
  );

  // Update direct watch button
  html = html.replace(
    /id="ytDirectWatchBtn"\s+href="https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+"/,
    `id="ytDirectWatchBtn" href="https://www.youtube.com/watch?v=${latest.id}"`
  );

  // Update title & desc
  const safeTitle = latest.title;
  const safeDesc = latest.desc || latest.title;
  html = html.replace(
    /<h3 id="ytPlayerTitle"[^>]*>[\s\S]*?<\/h3>/,
    `<h3 id="ytPlayerTitle" style="font-size:1.2rem; font-weight:800; color:#fff; line-height:1.35; margin-bottom:8px;">\n              ${safeTitle}\n            </h3>`
  );
  html = html.replace(
    /<p id="ytPlayerDesc"[^>]*>[\s\S]*?<\/p>/,
    `<p id="ytPlayerDesc" style="font-size:0.9rem; color:var(--text-secondary); line-height:1.55; margin-bottom:16px;">\n              ${safeDesc}\n            </p>`
  );

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('[YouTube Sync] index.html successfully updated with latest video feed.');

  // Download latest thumbnail for yt-vid-1.jpg
  const thumbPath = path.join(__dirname, '..', 'assets', 'images', 'socials', 'yt-vid-1.jpg');
  const thumbUrl = `https://i.ytimg.com/vi/${latest.id}/hqdefault.jpg`;
  const downloaded = await downloadImage(thumbUrl, thumbPath);
  console.log(`[YouTube Sync] Downloaded thumbnail for ${latest.id}: ${downloaded ? 'SUCCESS' : 'FAILED'}`);
}

sync().catch(console.error);
