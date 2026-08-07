import { CATEGORIES } from './tools';

export interface ModuleContent {
  id: string;
  label: string;
  slug: string;
  description: string;
  longDescription: string;
  keyTools: string[];
  useCases: string[];
  relatedModules: string[];
}

export const MODULE_SLUGS: Record<string, string> = {
  '01': 'screenshot-original-tools',
  '02': 'brazil-osint-public-data',
  '03': 'usa-government-public-records',
  '04': 'china-public-records-osint',
  '05': 'osint-master-collections',
  '06': 'username-email-phone-identity-osint',
  '07': 'web-search-archives-historical',
  '08': 'domain-dns-ip-internet-asset',
  '09': 'threat-intelligence-malware-phishing',
  '10': 'geoint-maps-satellite-flight-vessel',
  '11': 'blockchain-crypto-osint',
  '12': 'reverse-engineering-binary-analysis',
  '13': 'android-ios-mobile-firmware',
  '14': 'network-web-wireless-security-testing',
  '15': 'dfir-blue-team-forensics',
  '16': 'security-operating-systems-lab',
  '17': 'ai-chat-search-model-platforms',
  '18': 'ai-coding-agents',
  '19': 'ai-local-self-hosted-inference',
  '20': 'ai-agent-frameworks-automation',
  '21': 'china-ai-ecosystem',
  '22': 'ai-security-agent-security-llm-testing',
  '23': 'china-cybersecurity-internet-asset-tools',
  '24': 'classic-seo-content-search-intelligence',
  '25': 'geo-aeo-llmo-ai-search-visibility',
};

// Reverse map: slug -> id
export const SLUG_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(MODULE_SLUGS).map(([id, slug]) => [slug, id])
);

export const MODULE_DESCRIPTIONS: Record<string, { description: string; longDescription: string; useCases: string[]; relatedModules: string[] }> = {
  '01': {
    description: 'Original tools, screen-capture utilities, and foundational hacking resources including Kali Linux, Frida, and MAC address manipulation.',
    longDescription: 'Module 01 contains the original and foundational tools that form the backbone of hands-on security research. It includes penetration testing essentials like Frida dynamic instrumentation, MAC address changing utilities, and Kali Linux — the industry standard security operating system. These tools serve as the entry point for security professionals building their initial toolkit.',
    useCases: ['Network anonymisation via MAC address spoofing', 'Dynamic instrumentation for app analysis', 'Setting up a security research environment'],
    relatedModules: ['14', '16'],
  },
  '02': {
    description: 'Comprehensive OSINT tools and public data sources specifically for Brazil: CNPJ lookups, government transparency portals, electoral data, and court record systems.',
    longDescription: 'Module 02 provides the most comprehensive collection of Brazil-specific OSINT resources available. It covers federal and state government databases, company registration lookups via CNPJ, electoral donation data from TSE, financial market filings from CVM, Brazilian court records, and public procurement databases. Essential for journalists, investigators, and compliance professionals working with Brazilian entities.',
    useCases: ['Brazilian company due diligence', 'Electoral campaign finance research', 'Government spending transparency investigation', 'Court record lookup'],
    relatedModules: ['03', '04', '05'],
  },
  '03': {
    description: 'US government open data: PACER court records, SEC EDGAR filings, FEC campaign finance, federal spending databases, and regulatory enforcement records.',
    longDescription: 'Module 03 aggregates the most important US government open data sources for OSINT investigation. It covers the full suite of federal transparency portals including PACER for court records, SEC EDGAR for securities filings, FEC for campaign finance, USASpending for federal contracts and grants, and SAM.gov for contractor vetting. Also includes nonprofit transparency databases, NPI provider lookups, and lobbying disclosure systems.',
    useCases: ['Federal court case research', 'Corporate securities filing analysis', 'Campaign finance investigation', 'Federal contractor vetting', 'Nonprofit financial analysis'],
    relatedModules: ['02', '04', '05'],
  },
  '04': {
    description: 'China-focused OSINT resources: company registration systems (GSXT), court records, financial market data, and Chinese internet intelligence tools.',
    longDescription: 'Module 04 provides curated access to Chinese government open data and Chinese-language OSINT resources. It includes the National Enterprise Credit Information Publicity System (GSXT) for company lookups, Chinese court record systems (Wenshu Court), securities market filings from SSE and SZSE, IP registration via CNIPA, and government procurement databases. Also includes Chinese internet intelligence platforms for domain, IP, and threat research.',
    useCases: ['Chinese company due diligence and KYC', 'China-focused threat intelligence', 'Supply chain investigation', 'Chinese court record research'],
    relatedModules: ['02', '03', '23'],
  },
  '05': {
    description: 'The most comprehensive OSINT framework collections, master tool lists, and integrated platforms including OSINT Framework, SpiderFoot, and Maltego.',
    longDescription: 'Module 05 is the meta-module — collections of OSINT collections. It includes the canonical OSINT Framework (osintframework.com), curated GitHub repositories listing hundreds of OSINT tools by category, integrated investigation platforms like SpiderFoot and Maltego that automate multi-source intelligence gathering, and community-maintained tool directories. This module is the recommended starting point for discovering new OSINT tools beyond what Duck Master explicitly covers.',
    useCases: ['Discovering new OSINT tools by category', 'Automated multi-source intelligence gathering', 'Building investigation workflows', 'Teaching OSINT methodology'],
    relatedModules: ['06', '07', '08'],
  },
  '06': {
    description: 'Username, email, phone, and identity OSINT tools: Sherlock, Maigret, GHunt, Holehe, PhoneInfoga, and breach databases for identity investigation.',
    longDescription: 'Module 06 covers the tools used for identity resolution — finding and linking digital identities across platforms. Username checking tools like Sherlock and Maigret search hundreds of platforms simultaneously. Email investigation tools like GHunt and Holehe reveal associated accounts and breach exposure. PhoneInfoga enables phone number intelligence. Breach databases help understand which services a target has registered with. Together, these tools enable comprehensive digital identity mapping from minimal starting information.',
    useCases: ['Social media username correlation', 'Email account investigation', 'Phone number OSINT', 'Breach exposure assessment', 'Identity verification'],
    relatedModules: ['05', '07', '08'],
  },
  '07': {
    description: 'Web search engines, internet archives, and historical research tools including the Wayback Machine, Common Crawl, and alternative search engines.',
    longDescription: 'Module 07 covers the tools for finding and accessing web content — both current and historical. It includes major search engines (Google, Bing, Brave, DuckDuckGo, Baidu) for different geographic and privacy profiles, the Internet Archive\'s Wayback Machine for historical page retrieval, Common Crawl for large-scale web data research, and privacy-focused alternatives. Web archives are particularly valuable for OSINT: deleted pages, changed content, and historical context are often recoverable through archived snapshots.',
    useCases: ['Historical web page retrieval', 'Deleted content recovery', 'Multi-engine cross-reference research', 'Privacy-conscious searching'],
    relatedModules: ['05', '06', '08'],
  },
  '08': {
    description: 'Domain, DNS, IP, and internet asset intelligence: Shodan, Censys, SecurityTrails, Subfinder, Amass, and the full ProjectDiscovery suite.',
    longDescription: 'Module 08 is the core module for internet infrastructure intelligence. It covers passive internet intelligence platforms (Shodan, Censys, CriminalIP, Netlas) that have indexed the public internet; DNS intelligence tools (SecurityTrails, DNSDumpster, DNSChecker); certificate transparency lookup (crt.sh); BGP and ASN intelligence (BGP.tools, HE.net); WHOIS and domain intelligence (ViewDNS, Who.is); and the complete ProjectDiscovery active reconnaissance suite (Subfinder, Httpx, Nuclei, Naabu, DNSx, Katana). Essential for security researchers, threat intelligence analysts, and red teams.',
    useCases: ['Subdomain enumeration', 'Internet asset discovery', 'Infrastructure attribution', 'Threat actor infrastructure mapping', 'Attack surface monitoring'],
    relatedModules: ['09', '14', '05'],
  },
  '09': {
    description: 'Threat intelligence platforms, malware sandboxes, phishing detection, and MISP-based sharing: OTX, Pulsedive, Hybrid Analysis, Any.run, and TheHive.',
    longDescription: 'Module 09 is the comprehensive threat intelligence module. It includes community threat intelligence platforms (OTX AlienVault, Pulsedive, ThreatMiner), abuse tracking services (AbuseIPDB, Abuse.ch with URLHaus, ThreatFox, Bazaar, FeodoTracker), commercial malware sandboxes (Hybrid Analysis, Any.run, Joe Sandbox, Tria.ge), and professional open-source threat intelligence platforms (MISP, OpenCTI, IntelOwl). Also includes malware hunting tools (YARA, CAPA) and SOC workflow platforms (TheHive, Cortex).',
    useCases: ['IOC investigation and enrichment', 'Malware sample analysis', 'Phishing detection and takedown', 'Threat actor tracking', 'SOC alert triage'],
    relatedModules: ['08', '15', '05'],
  },
  '10': {
    description: 'Geospatial intelligence tools: satellite imagery (Sentinel, Copernicus), flight tracking (ADSB Exchange), vessel tracking (MarineTraffic), and geolocation tools.',
    longDescription: 'Module 10 covers the full stack of geospatial and location intelligence tools. It includes reverse image search (TinEye, Yandex Images), EXIF metadata extraction (ExifTool), satellite imagery (Copernicus Browser, Sentinel Hub, NASA Worldview, USGS EarthExplorer, NASA FIRMS for fire detection), mapping platforms (Google Maps, OpenStreetMap, Overpass Turbo), sun and shadow analysis (SunCalc, ShadowMap), maritime intelligence (MarineTraffic, Global Fishing Watch), and aviation intelligence (ADSB Exchange, OpenSky Network, FlightAware, FlightRadar24).',
    useCases: ['Image geolocation and verification', 'Satellite change detection', 'Conflict zone monitoring', 'Vessel sanctions monitoring', 'Aircraft tracking and attribution'],
    relatedModules: ['05', '07'],
  },
  '11': {
    description: 'Blockchain and cryptocurrency OSINT: Blockchair, Etherscan, Breadcrumbs, Arkham, MistTrack, and professional blockchain intelligence platforms.',
    longDescription: 'Module 11 provides a curated collection of blockchain intelligence and cryptocurrency OSINT tools. It covers multi-chain block explorers (Blockchair, Etherscan, BscScan, SolScan, TronScan, Arbiscan, mempool.space), visual investigation platforms (Breadcrumbs.app, Arkham Intelligence), AML and compliance tools (MistTrack, ChainAbuse), and professional blockchain analytics services (Chainalysis, TRM Labs, Elliptic, Crystal Intelligence). This module supports ransomware payment tracing, fraud investigation, sanctions compliance, and DeFi security research.',
    useCases: ['Ransomware payment tracing', 'Wallet clustering and attribution', 'Crypto fraud investigation', 'Exchange deposit identification', 'Sanctions compliance screening'],
    relatedModules: ['09', '05'],
  },
  '12': {
    description: 'Reverse engineering and binary analysis: Ghidra, IDA Pro, Radare2, Binary Ninja, x64dbg, angr, and the Capstone/Unicorn/Keystone frameworks.',
    longDescription: 'Module 12 provides the tools for binary analysis and software reverse engineering. It includes the major disassembly and decompilation platforms (Ghidra, IDA Pro, Binary Ninja, Radare2/Rizin, Cutter), dynamic analysis and debugging tools (x64dbg, dnSpy for .NET), hex editors (ImHex), binary analysis frameworks (angr for symbolic execution), and the CSK foundational libraries (Capstone disassembly, Keystone assembly, Unicorn CPU emulation). Essential for malware analysts, vulnerability researchers, and CTF competitors.',
    useCases: ['Malware reverse engineering', 'Vulnerability research', 'CTF competition', 'Software auditing', 'Firmware analysis'],
    relatedModules: ['13', '15', '12'],
  },
  '13': {
    description: 'Android and iOS mobile security tools: Frida, Objection, JADX, APKTool, MobSF, and the complete mobile reverse engineering toolkit.',
    longDescription: 'Module 13 covers mobile application security research from static analysis through dynamic instrumentation. Tools include: Frida dynamic instrumentation framework; Objection mobile security testing framework; JADX Java decompiler for Android; APKTool for APK decoding and repackaging; MobSF for automated static and dynamic analysis; APKiD for malware detection in APKs; dex2jar and JD-GUI for .dex analysis; Binwalk for firmware extraction; EMBA for embedded firmware analysis; and OWASP MASTG for testing methodology. Also includes comprehensive community lists of Android and iOS reverse engineering resources.',
    useCases: ['Mobile app security assessment', 'SSL pinning bypass', 'Android malware analysis', 'iOS app reverse engineering', 'Firmware security audit'],
    relatedModules: ['12', '14'],
  },
  '14': {
    description: 'Network, web, and wireless security testing tools: Nmap, Metasploit, Burp Suite, Aircrack-ng, SQLMap, Nikto, and web fuzzing tools.',
    longDescription: 'Module 14 is the penetration testing and security assessment module. It covers network scanning (Nmap, Masscan, ZMap, RustScan), exploitation frameworks (Metasploit), web application testing (Burp Suite, OWASP ZAP, mitmproxy, Bettercap), wireless security (Aircrack-ng), directory fuzzing (ffuf, Feroxbuster, Gobuster, Dirsearch), SQL injection (SQLMap), web vulnerability scanning (Nikto, Dalfox for XSS), and network traffic manipulation. All tools in this module require written authorisation for use against any system.',
    useCases: ['Penetration testing', 'Web application security assessment', 'Wireless network audit', 'Vulnerability identification', 'Security posture evaluation'],
    relatedModules: ['08', '09', '15'],
  },
  '15': {
    description: 'Digital forensics and blue team tools: Sleuth Kit, Volatility, Velociraptor, Wireshark, Zeek, Suricata, Security Onion, and Wazuh.',
    longDescription: 'Module 15 provides the complete DFIR (Digital Forensics and Incident Response) and blue team toolkit. It covers disk forensics (Sleuth Kit/Autopsy), memory forensics (Volatility 3), endpoint investigation at scale (Velociraptor), timeline analysis (Timesketch, Plaso/log2timeline), file system artefact parsing (Eric Zimmerman\'s tools), network traffic analysis (Wireshark, tcpdump), network security monitoring (Security Onion, Zeek, Suricata, Arkime), and open-source SIEM/EDR platforms (Wazuh, Snort). This module supports incident response, threat hunting, and evidence collection.',
    useCases: ['Incident response', 'Memory forensics and malware hunting', 'Network traffic analysis', 'Threat hunting', 'Evidence preservation for legal proceedings'],
    relatedModules: ['09', '12', '14'],
  },
  '16': {
    description: 'Security-focused Linux distributions and lab environments: Kali Linux, Parrot OS, BlackArch, Tails, Qubes OS, Security Onion, REMnux, and FLARE-VM.',
    longDescription: 'Module 16 covers the security-focused operating systems used for penetration testing, OSINT research, privacy, and malware analysis. It includes Kali Linux (the standard penetration testing distribution), Parrot OS (privacy and security combined), BlackArch (the most comprehensive tool repository), Tails (amnesic privacy OS), Qubes OS (security by compartmentalisation), Security Onion (network security monitoring platform), REMnux (malware analysis for Linux), and FLARE-VM (Windows malware analysis environment from Mandiant).',
    useCases: ['Setting up a security research lab', 'Anonymous investigation operations', 'Malware analysis environment setup', 'Penetration testing platform selection', 'Privacy-focused computing'],
    relatedModules: ['12', '15', '14'],
  },
  '17': {
    description: 'AI chat platforms, search engines, and model providers: ChatGPT, Claude, Gemini, Perplexity, Grok, HuggingFace, NVIDIA NIM, and inference APIs.',
    longDescription: 'Module 17 covers the landscape of AI chat and model platforms available to practitioners. It includes major frontier model interfaces (ChatGPT, Claude, Gemini, Grok), AI search engines (Perplexity, Phind, You.com), aggregator and routing platforms (Poe, OpenRouter), open-source model hubs (HuggingFace), inference APIs (Groq, Together.ai, Fireworks.ai, Replicate), and self-service platforms (NVIDIA NIM, Meta AI). This module is the starting point for AI-assisted OSINT, research acceleration, and understanding the current AI capability landscape.',
    useCases: ['AI-assisted research and investigation', 'Natural language analysis of collected data', 'Cross-language translation for multilingual OSINT', 'Model evaluation and comparison'],
    relatedModules: ['18', '19', '20'],
  },
  '18': {
    description: 'AI coding agents and development tools: Cursor, Devin, Claude Code, Cline, GitHub Copilot, Aider, OpenHands, and CLI coding agents.',
    longDescription: 'Module 18 covers AI-powered software development tools and autonomous coding agents. It includes major IDE-integrated assistants (Cursor, GitHub Copilot, Continue), standalone AI coding agents (Devin, Cline, Claude Code, OpenAI Codex, Google Jules), open-source autonomous coding systems (OpenHands/SWE-agent, Aider, Goose), and emerging CLI coding agents. This module is valuable for security researchers building automation tools, developers auditing AI coding agent security, and practitioners evaluating the current AI coding landscape.',
    useCases: ['OSINT tool development', 'Security automation scripting', 'AI agent security assessment', 'Development productivity', 'Understanding AI coding capabilities'],
    relatedModules: ['17', '19', '20'],
  },
  '19': {
    description: 'Local and self-hosted AI inference: Ollama, LM Studio, Open WebUI, LocalAI, vLLM, llama.cpp, GPT4All, and NVIDIA TensorRT-LLM.',
    longDescription: 'Module 19 covers tools for running AI language models locally and self-hosted — providing privacy, cost control, and offline capability. It includes user-friendly local model runners (Ollama, LM Studio, Jan.ai), open-source chat interfaces (Open WebUI, AnythingLLM, text-generation-webui), production-grade inference servers (vLLM, SGLang, NVIDIA TensorRT-LLM), and foundational model runtimes (llama.cpp for CPU inference, GPT4All for consumer hardware, Apple MLX for Apple Silicon). Essential for security teams processing sensitive investigation data who cannot use cloud AI services.',
    useCases: ['Privacy-preserving AI analysis of sensitive data', 'Air-gapped environment AI deployment', 'Cost-effective large-scale inference', 'AI model security research', 'Fine-tuning and custom model deployment'],
    relatedModules: ['17', '18', '20'],
  },
  '20': {
    description: 'AI agent frameworks and automation platforms: LangChain, LangGraph, CrewAI, LlamaIndex, AutoGen, browser-use, n8n, Zapier, and workflow automation.',
    longDescription: 'Module 20 is the most comprehensive AI agent and automation module. It covers major LLM application frameworks (LangChain, LangGraph, LlamaIndex, PydanticAI, Mastra, Agno, HuggingFace SmolAgents, Haystack, Microsoft Semantic Kernel), multi-agent systems (CrewAI, AutoGen, OpenAI Agents SDK, Google ADK), browser automation agents (browser-use, Skyvern, Stagehand, Playwright-MCP, Steel Browser), web scraping tools (Firecrawl, Crawl4AI, ScrapeGraph-AI), memory systems (Mem0, Letta), no-code automation platforms (n8n, Zapier, Make, Pipedream, Gumloop, Lindy), and visual flow builders (Flowise, Langflow, Activepieces, OpenInterpreter).',
    useCases: ['Automated OSINT collection pipelines', 'Multi-step investigation automation', 'Web scraping and data extraction', 'Workflow automation', 'Agentic security research tools'],
    relatedModules: ['17', '18', '19', '22'],
  },
  '21': {
    description: 'China-origin AI platforms and tools: DeepSeek, Qwen, Kimi, Doubao, Baidu ERNIE, and the Chinese AI developer ecosystem.',
    longDescription: 'Module 21 covers the rapidly expanding Chinese AI ecosystem. It includes frontier model platforms and products from major Chinese AI companies, including DeepSeek (notable for its open-weight models), Alibaba Qwen series, Moonshot Kimi, ByteDance Doubao, Baidu ERNIE, and platforms aggregating access to Chinese AI models. Understanding the Chinese AI landscape is increasingly important for competitive intelligence, geopolitical research, and AI safety analysis. This module provides direct access to the key Chinese AI platforms and associated open-source repositories.',
    useCases: ['Chinese AI capability assessment', 'Competitive AI landscape research', 'China-origin model evaluation', 'Geopolitical AI research'],
    relatedModules: ['17', '04', '23'],
  },
  '22': {
    description: 'AI security, LLM red teaming, and agent security: PyRIT, Garak, LLM Guard, MITRE ATLAS, OWASP LLM Top 10, and adversarial ML tools.',
    longDescription: 'Module 22 covers the emerging field of AI security — attacking, evaluating, and defending AI systems against adversarial threats. It includes LLM red teaming frameworks (PyRIT by Microsoft, Garak), LLM security guardrails (LLM Guard), adversarial robustness tools (Adversarial Robustness Toolbox), prompt injection research, jailbreak databases, and foundational AI security frameworks (MITRE ATLAS for AI threat modelling, OWASP LLM Top 10). This module is essential for AI safety researchers, security engineers integrating LLMs, and red teams assessing AI-powered products.',
    useCases: ['LLM red teaming and jailbreak research', 'AI agent security assessment', 'Prompt injection testing', 'AI safety evaluation', 'RAG system security testing'],
    relatedModules: ['17', '20', '09'],
  },
  '23': {
    description: 'Chinese cybersecurity and internet asset intelligence tools: Quake 360, FOFA, Hunter, ThreatBook, and Chinese internet mapping platforms.',
    longDescription: 'Module 23 provides access to Chinese-developed cybersecurity and internet intelligence platforms. These include 0.zone, Quake 360 (from Qianxin), Hunter (from Qianxin), ThreatBook (x.threatbook.cn), and various Chinese IP intelligence and DNS analysis tools. These platforms often index Chinese-hosted infrastructure and Chinese-language threat intelligence that Western platforms miss. This module is particularly valuable for investigating Chinese-hosted infrastructure, conducting China-focused threat intelligence, and understanding the Chinese internet landscape from an OSINT perspective.',
    useCases: ['Chinese internet asset discovery', 'China-focused threat intelligence', 'Chinese IP and domain investigation', 'Chinese internet infrastructure mapping'],
    relatedModules: ['04', '08', '21'],
  },
  '24': {
    description: 'Classic SEO, content optimisation, and search intelligence tools for website visibility, keyword research, and competitive analysis.',
    longDescription: 'Module 24 covers traditional search engine optimisation tools and content intelligence platforms. These include keyword research and rank tracking tools, backlink analysis platforms, technical SEO auditing software, content optimisation tools, and competitive research platforms. Understanding traditional SEO is foundational for both website operators optimising their own properties and OSINT practitioners analysing competitor digital strategies, estimating traffic, and understanding how organisations position themselves online.',
    useCases: ['Website SEO audit', 'Keyword research and content strategy', 'Competitor digital strategy analysis', 'Backlink investigation', 'Search ranking monitoring'],
    relatedModules: ['25', '07'],
  },
  '25': {
    description: 'GEO, AEO, and LLMO: tools for AI search visibility, Generative Engine Optimisation, Answer Engine Optimisation, and LLM content discoverability.',
    longDescription: 'Module 25 covers the emerging field of optimising for AI-powered search and generative engines — a discipline variously called Generative Engine Optimisation (GEO), Answer Engine Optimisation (AEO), and LLM Optimisation (LLMO). As search increasingly involves AI-generated answers from Perplexity, ChatGPT Search, Google AI Overviews, and Bing Copilot, traditional SEO tactics are being supplemented by new approaches focused on being cited as a source in AI-generated answers. This module covers tools, frameworks, and resources for this emerging field.',
    useCases: ['AI search visibility optimisation', 'Getting cited by ChatGPT and Perplexity', 'Structured data for AI discoverability', 'llms.txt implementation', 'Measuring AI search performance'],
    relatedModules: ['24', '17'],
  },
};

export function getModuleContent(id: string) {
  const cat = CATEGORIES.find(c => c.id === id);
  if (!cat) return null;
  const content = MODULE_DESCRIPTIONS[id];
  const slug = MODULE_SLUGS[id];
  return {
    id: cat.id,
    label: cat.label,
    slug,
    toolCount: cat.links.length,
    tools: cat.links,
    ...(content || {
      description: `A curated collection of ${cat.links.length} tools for ${cat.label}.`,
      longDescription: `Module ${id} provides ${cat.links.length} carefully curated tools and resources for ${cat.label}. Browse the full collection below or use Duck Master\'s AI-powered search to find the right tool for your specific need.`,
      useCases: [],
      relatedModules: [],
    }),
  };
}

export function getModuleBySlug(slug: string) {
  const id = SLUG_TO_ID[slug];
  if (!id) return null;
  return getModuleContent(id);
}
