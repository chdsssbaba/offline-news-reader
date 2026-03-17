const API_KEY = import.meta.env.VITE_GNEWS_API_KEY || '';
const BASE_URL = 'https://gnews.io/api/v4';

const CATEGORIES = [
  { id: 'general', label: 'General', icon: '📰' },
  { id: 'world', label: 'World', icon: '🌍' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'health', label: 'Health', icon: '🏥' }
];

// Fallback demo articles when API key is missing or API fails
function getDemoArticles(category = 'general') {
  const demoData = {
    general: [
      {
        title: 'AI Revolution Transforms Healthcare: New Machine Learning Models Detect Diseases Earlier',
        description: 'Groundbreaking artificial intelligence systems are now capable of detecting diseases at earlier stages than ever before, potentially saving millions of lives worldwide through early intervention.',
        content: 'Researchers at leading medical institutions have developed new AI models that can analyze medical imaging with unprecedented accuracy. These systems use deep learning algorithms trained on millions of medical images to identify subtle patterns that human doctors might miss. The technology is being trialed in hospitals across 15 countries, with early results showing a 40% improvement in early detection rates for cancers and other critical conditions.',
        url: 'https://example.com/ai-healthcare-revolution',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: 'Tech Health Journal', url: 'https://example.com' }
      },
      {
        title: 'Global Climate Summit Reaches Historic Agreement on Carbon Emissions',
        description: 'World leaders have agreed to ambitious new targets for reducing carbon emissions, marking a turning point in international climate policy and environmental protection efforts.',
        content: 'In a landmark decision, 195 nations have committed to reducing carbon emissions by 60% by 2035, with a complete transition to renewable energy by 2050. The agreement includes a $200 billion fund to help developing nations transition away from fossil fuels. Environmental organizations have called it the most significant climate agreement in history.',
        url: 'https://example.com/climate-summit-agreement',
        image: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e5ca?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: 'Global News Network', url: 'https://example.com' }
      },
      {
        title: 'Space Tourism Takes Off: First Commercial Lunar Flyby Mission Announced',
        description: 'A private space company has unveiled plans for the first commercial lunar flyby mission, offering civilians the chance to orbit the Moon in a cutting-edge spacecraft.',
        content: 'The mission, scheduled for late next year, will carry six civilian passengers on a week-long journey around the Moon and back. Tickets are priced at $35 million each, with the company already reporting strong demand. The spacecraft features panoramic windows, zero-gravity recreation areas, and advanced life support systems.',
        url: 'https://example.com/space-tourism-lunar',
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: { name: 'Space Frontier Daily', url: 'https://example.com' }
      },
      {
        title: 'Breakthrough in Quantum Computing: New Chip Achieves 1000-Qubit Milestone',
        description: 'Scientists have developed a quantum processor with over 1000 stable qubits, marking a significant leap forward in the quest for practical quantum computing applications.',
        content: 'The new quantum chip maintains coherence for record-breaking durations, enabling complex calculations that were previously impossible. This breakthrough could accelerate drug discovery, optimize supply chains, and crack complex mathematical problems. Major tech companies and research institutions are already lining up to access the technology.',
        url: 'https://example.com/quantum-computing-milestone',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: { name: 'Quantum Tech Review', url: 'https://example.com' }
      },
      {
        title: 'Electric Vehicle Sales Surge 300% as Battery Costs Plummet',
        description: 'Global electric vehicle sales have tripled year-over-year as new battery technology drives prices below traditional combustion engine vehicles for the first time.',
        content: 'Solid-state battery breakthroughs have reduced manufacturing costs by 70%, making EVs more affordable than their gas-powered counterparts. The shift has prompted several major automakers to accelerate their transition timelines, with some announcing plans to go all-electric by 2028. Charging infrastructure is expanding rapidly to keep pace with demand.',
        url: 'https://example.com/ev-sales-surge',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        source: { name: 'Auto Innovation Weekly', url: 'https://example.com' }
      },
      {
        title: 'Scientists Discover New Deep-Sea Ecosystem Thriving in Complete Darkness',
        description: 'Marine biologists have documented an entirely new ecosystem deep beneath the Pacific Ocean floor, home to previously unknown species that survive without sunlight.',
        content: 'The ecosystem, found at a depth of 4,500 meters, relies on chemosynthesis rather than photosynthesis for energy. Researchers have already identified over 30 new species, including bioluminescent organisms and extremophile bacteria. The discovery challenges our understanding of where and how life can exist on Earth and potentially other planets.',
        url: 'https://example.com/deep-sea-ecosystem',
        image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 21600000).toISOString(),
        source: { name: 'Marine Science Today', url: 'https://example.com' }
      }
    ],
    technology: [
      {
        title: 'Meta Unveils Next-Gen AR Glasses with Holographic Display Technology',
        description: 'Meta has announced its latest augmented reality glasses featuring true holographic displays, promising to revolutionize how we interact with digital content.',
        content: 'The glasses weigh just 45 grams and offer a 120-degree field of view with 4K resolution per eye. They feature gesture recognition, eye tracking, and spatial audio. The device is expected to launch later this year at a price point of $799.',
        url: 'https://example.com/meta-ar-glasses',
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 5400000).toISOString(),
        source: { name: 'Digital Trends', url: 'https://example.com' }
      },
      {
        title: 'Linux 7.0 Released with Revolutionary New Kernel Architecture',
        description: 'The Linux Foundation has released version 7.0 of the Linux kernel, featuring a completely redesigned architecture that promises 50% better performance.',
        content: 'The new kernel introduces a modular microkernel approach while maintaining backward compatibility. Key improvements include native container support, improved memory management, and enhanced security features. Major cloud providers have already begun adopting the new version.',
        url: 'https://example.com/linux-7-release',
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 9000000).toISOString(),
        source: { name: 'Open Source World', url: 'https://example.com' }
      },
      {
        title: 'Rust Programming Language Surpasses Java in Enterprise Adoption',
        description: 'Rust has overtaken Java as the most adopted language for new enterprise projects, according to the latest industry survey.',
        content: 'The survey of 10,000 enterprises found that 67% are now using Rust for new projects, citing memory safety, performance, and developer productivity as key factors. The shift represents a seismic change in enterprise development practices.',
        url: 'https://example.com/rust-enterprise-adoption',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 12600000).toISOString(),
        source: { name: 'Dev Weekly', url: 'https://example.com' }
      },
      {
        title: '5G Networks Achieve 10Gbps Speeds in Urban Areas Worldwide',
        description: 'Major telecom operators report that 5G networks are now consistently delivering 10Gbps download speeds in metropolitan areas across 50 countries.',
        content: 'The achievement marks a tenfold improvement over initial 5G deployments. New antenna technology and frequency allocation have enabled the speed boost. The faster speeds are enabling new applications in healthcare, manufacturing, and entertainment.',
        url: 'https://example.com/5g-speed-milestone',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 16200000).toISOString(),
        source: { name: 'Telecom Insider', url: 'https://example.com' }
      },
      {
        title: 'GitHub Copilot X Now Writes Entire Applications from Natural Language Prompts',
        description: 'GitHub has launched Copilot X, an AI coding assistant that can generate full-stack applications from simple natural language descriptions.',
        content: 'The tool can create complete applications including frontend, backend, database schemas, and deployment configurations. Early testers report a 5x increase in development speed. The service supports 40 programming languages and integrates with all major IDEs.',
        url: 'https://example.com/copilot-x-launch',
        image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 19800000).toISOString(),
        source: { name: 'Code Arsenal', url: 'https://example.com' }
      },
      {
        title: 'Cybersecurity Alert: New Zero-Day Vulnerability Found in Major Cloud Platforms',
        description: 'Security researchers have discovered a critical zero-day vulnerability affecting multiple major cloud service providers, prompting urgent patches.',
        content: 'The vulnerability could allow attackers to escalate privileges and access sensitive data across cloud tenants. All major providers have released emergency patches, and organizations are urged to update immediately. The flaw was responsibly disclosed and no exploitation in the wild has been confirmed.',
        url: 'https://example.com/cloud-zero-day',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 23400000).toISOString(),
        source: { name: 'Security Weekly', url: 'https://example.com' }
      }
    ],
    business: [
      {
        title: 'Global Markets Rally as Central Banks Signal End of Rate Hike Cycle',
        description: 'Stock markets around the world surged to record highs after major central banks indicated that interest rate increases have peaked.',
        content: 'The Federal Reserve, European Central Bank, and Bank of England all signaled a shift toward maintaining or potentially lowering rates. Markets responded with broad-based gains, with technology and real estate sectors leading the rally.',
        url: 'https://example.com/markets-rally',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 4800000).toISOString(),
        source: { name: 'Financial Times', url: 'https://example.com' }
      },
      {
        title: 'Startup Funding Reaches All-Time High as AI Companies Attract Record Investment',
        description: 'Venture capital funding has hit a new record, with AI-focused startups capturing over 40% of total investment in the latest quarter.',
        content: 'Global VC funding reached $180 billion in Q1, surpassing the previous record set during the dot-com era. AI companies alone attracted $75 billion, reflecting the enormous commercial potential of artificial intelligence.',
        url: 'https://example.com/startup-funding-record',
        image: 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 8400000).toISOString(),
        source: { name: 'Venture Beat', url: 'https://example.com' }
      },
      {
        title: 'Remote Work Revolution: 60% of Fortune 500 Companies Go Fully Remote',
        description: 'A majority of Fortune 500 companies have now adopted permanent fully remote or hybrid work policies, fundamentally reshaping corporate culture.',
        content: 'Companies report higher productivity, lower overhead costs, and improved employee satisfaction. The shift has also had significant impacts on commercial real estate, urban planning, and the coworking industry.',
        url: 'https://example.com/remote-work-revolution',
        image: 'https://images.unsplash.com/photo-1521898284481-a5ec348cb555?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 12000000).toISOString(),
        source: { name: 'Business Insider', url: 'https://example.com' }
      },
      {
        title: 'Apple Becomes First Company to Reach $5 Trillion Market Valuation',
        description: 'Apple has achieved a historic milestone, becoming the first publicly traded company to reach a $5 trillion market capitalization.',
        content: 'The milestone was driven by strong iPhone sales, growth in services revenue, and excitement around the company AI initiatives. Apple shares rose 3% on the day of the achievement.',
        url: 'https://example.com/apple-5-trillion',
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 15600000).toISOString(),
        source: { name: 'CNBC', url: 'https://example.com' }
      },
      {
        title: 'Cryptocurrency Regulation Framework Finalized by G20 Nations',
        description: 'G20 nations have agreed on a unified regulatory framework for cryptocurrencies, bringing much-needed clarity to the digital asset market.',
        content: 'The framework establishes standards for crypto exchanges, stablecoins, and DeFi platforms. Industry leaders have broadly welcomed the regulations, noting they provide the certainty needed for institutional adoption.',
        url: 'https://example.com/crypto-regulation',
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 19200000).toISOString(),
        source: { name: 'Crypto Daily', url: 'https://example.com' }
      },
      {
        title: 'Green Bond Market Surges Past $2 Trillion as ESG Investing Goes Mainstream',
        description: 'The global green bond market has exceeded $2 trillion in outstanding issuance, reflecting growing investor appetite for sustainable investments.',
        content: 'Governments and corporations are increasingly turning to green bonds to fund renewable energy, sustainable infrastructure, and climate adaptation projects. The market is expected to double again within three years.',
        url: 'https://example.com/green-bonds-surge',
        image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&h=450&fit=crop',
        publishedAt: new Date(Date.now() - 22800000).toISOString(),
        source: { name: 'Green Finance Review', url: 'https://example.com' }
      }
    ]
  };

  // For categories without specific demo data, use general
  return demoData[category] || demoData.general;
}

async function fetchFromAPI(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('NO_API_KEY');
  }

  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('apikey', API_KEY);
  url.searchParams.append('lang', 'en');

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTopHeadlines(category = 'general', max = 10) {
  try {
    const data = await fetchFromAPI('top-headlines', {
      category,
      max: max.toString()
    });
    return data.articles || [];
  } catch (err) {
    // Fallback to demo articles when API is unavailable
    console.warn('[API] Using demo articles:', err.message);
    return getDemoArticles(category);
  }
}

export async function searchNews(query, max = 10) {
  try {
    const data = await fetchFromAPI('search', {
      q: query,
      max: max.toString()
    });
    return data.articles || [];
  } catch (err) {
    console.warn('[API] Search fallback to demo data:', err.message);
    const allDemo = getDemoArticles('general');
    return allDemo.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

export { CATEGORIES };
