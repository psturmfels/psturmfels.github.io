const INSTAGRAM_FEED_URL = "https://feeds.behold.so/lzQkx2FSUCQ3uk9pQNj0";

const POST_COUNT = 6;

function createGalleryLink(post) {
  const link = document.createElement("a");
  link.href = post.permalink;
  link.target = "_blank";
  link.rel = "noopener";

  const image = document.createElement("img");
  image.src =
    post.sizes?.medium?.mediaUrl ||
    post.sizes?.small?.mediaUrl ||
    post.mediaUrl ||
    post.thumbnailUrl;
  image.alt =
    post.altText ||
    post.prunedCaption ||
    post.caption ||
    "Instagram post";
  image.loading = "lazy";
  image.decoding = "async";

  const dominant = post.colorPalette?.dominant;
  if (dominant) {
    image.style.backgroundColor = `rgb(${dominant})`;
  }

  link.append(image);
  return link;
}

async function loadInstagramFeed() {
  if (INSTAGRAM_FEED_URL.includes("REPLACE_WITH_YOUR_FEED_ID")) {
    return;
  }

  const gallery = document.getElementById("instagram-gallery");
  if (!gallery) {
    return;
  }

  try {
    const response = await fetch(INSTAGRAM_FEED_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Feed request failed: ${response.status}`);
    }

    const data = await response.json();
    const posts = (data.posts || []).slice(0, POST_COUNT);
    if (posts.length === 0) {
      return;
    }

    gallery.replaceChildren(...posts.map(createGalleryLink));
  } catch (error) {
    console.warn(
      "Could not load the Instagram feed; keeping the fallback images.",
      error
    );
  }
}

loadInstagramFeed();
