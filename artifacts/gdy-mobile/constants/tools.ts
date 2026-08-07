/**
 * Tool catalog — kept in sync with artifacts/duck-master/src/data/tools.ts.
 * When the web catalog changes, copy the CATEGORIES array from there into here.
 */

export interface Category {
  id: string;
  label: string;
  links: string[];
}

export interface Tool {
  url: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "01", label: "Screenshot & Original Tools",
    links: ["https://skynetchat.net/","https://getautoseo.com/","https://github.com/p1ngul1n0/cpfFinder","https://github.com/mxrch/GHunt","https://frida.re/","https://github.com/frida/frida","https://github.com/alobbs/macchanger","https://www.gnu.org/software/macchanger/","https://www.kali.org/","https://www.kali.org/tools/"]
  },
  {
    id: "02", label: "Brazil / OSINT / Public Data",
    links: ["https://github.com/bgmello/OSINT-Tools-Brazil","https://github.com/osintbrazuca/osint-brazuca","https://github.com/osintbrazuca/osint-brazuca-regex","https://github.com/p1ngul1n0/cpfFinder","https://github.com/p1ngul1n0/blackbird","https://github.com/JMarchiori13/osint-recon","https://github.com/UnkL4b/OSINT-Brazuca","https://github.com/ellisonleao/OSINT-Brazuca","https://github.com/heltonx/embasint","https://github.com/cristianoaredes/mcp-dadosbr","https://github.com/felseje/cpf-cnpj-utils","https://github.com/wilsonfreitas/numbersBR","https://github.com/edenalencar/identifications","https://brasilapi.com.br/","https://brasilapi.com.br/docs","https://receitaws.com.br/","https://www.cnpj.ws/","https://dados.gov.br/","https://brasil.io/","https://brasil.io/dataset/documentos-brasil/","https://registro.br/","https://registro.br/tecnologia/ferramentas/whois/","https://www.situacao-cadastral.com/","https://www.consultaserialaparelho.com.br/public-web/homeSiga","https://www.jusbrasil.com.br/","https://www.gov.br/receitafederal/","https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/dados-abertos","https://www.gov.br/pt-br/servicos/consultar-cadastro-nacional-de-pessoas-juridicas","https://www.gov.br/pt-br/servicos/consultar-cadastro-de-pessoas-fisicas","https://www.gov.br/conecta/catalogo/apis/consulta-cnpj","https://transparencia.gov.br/","https://www.portaltransparencia.gov.br/","https://portaldatransparencia.gov.br/api-de-dados","https://api.portaldatransparencia.gov.br/","https://www.bcb.gov.br/meubc/registrato","https://www.redesim.gov.br/","https://www.in.gov.br/","https://www.gov.br/anatel/","https://www.gov.br/anatel/pt-br/assuntos/celular-legal","https://divulgacandcontas.tse.jus.br/","https://divulgacandcontas.tse.jus.br/divulga/","https://www.cvm.gov.br/","https://sistemas.cvm.gov.br/","https://sistemas.cvm.gov.br/cias-abertas.asp","https://dados.cvm.gov.br/","https://dados.cvm.gov.br/dataset/","https://www.rad.cvm.gov.br/ENETWeb/frmConsultaExternaCVM.aspx","https://www.gov.br/empresas-e-negocios/pt-br/mapa-de-empresas","https://pncp.gov.br/","https://pncp.gov.br/app/editais","https://pncp.gov.br/app/contratos","https://www.gov.br/compras/pt-br","https://compras.dados.gov.br/docs/home.html","https://serenata.ai/","https://www.lexml.gov.br/","https://pesquisa.apps.tcu.gov.br/","https://dadosabertos.camara.leg.br/","https://www12.senado.leg.br/dados-abertos","https://servicodados.ibge.gov.br/api/docs/","https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos"]
  },
  {
    id: "03", label: "USA / Government / Public Records",
    links: ["https://pacer.uscourts.gov/","https://www.courtlistener.com/","https://www.courtlistener.com/recap/","https://www.sec.gov/search-filings","https://www.sec.gov/edgar/search/","https://www.sec.gov/edgar/browse/","https://www.edgarcompany.sec.gov/","https://adviserinfo.sec.gov/","https://brokercheck.finra.org/","https://www.fec.gov/","https://www.fec.gov/data/","https://www.fec.gov/data/browse-data/","https://www.usaspending.gov/","https://www.usaspending.gov/keyword_search","https://sam.gov/","https://sam.gov/contracting","https://sam.gov/contract-data","https://open.gsa.gov/api/get-opportunities-public-api/","https://data.gov/","https://catalog.data.gov/","https://api.data.gov/","https://www.foia.gov/","https://www.federalregister.gov/","https://www.congress.gov/","https://www.govinfo.gov/","https://opencorporates.com/","https://opencorporates.com/advanced-search/","https://opencorporates.com/registers","https://www.fcc.gov/wireless/universal-licensing-system","https://www.fcc.gov/licensing-databases/search-fcc-databases","https://apps.fcc.gov/cores/simpleSearch.do","https://registry.faa.gov/aircraftinquiry","https://registry.faa.gov/aircraftinquiry/search/nnumberinquiry","https://amsrvs.registry.faa.gov/airmeninquiry/","https://www.uspto.gov/patents/search","https://www.uspto.gov/patents/search/patent-public-search","https://patentcenter.uspto.gov/search","https://www.uspto.gov/trademarks/search","https://tmsearch.uspto.gov/","https://data.uspto.gov/","https://apps.irs.gov/app/eos/","https://www.irs.gov/charities-non-profits/tax-exempt-organization-search","https://projects.propublica.org/nonprofits/","https://www.guidestar.org/","https://nppes.cms.hhs.gov/NPPES/Welcome.do","https://download.cms.gov/nppes/NPI_Files.html","https://sanctionssearch.ofac.treas.gov/","https://ofac.treasury.gov/sanctions-list-search-tool","https://data.census.gov/","https://lda.senate.gov/","https://lda.senate.gov/filings/public/filing/search/","https://www.grants.gov/search-grants","https://banks.data.fdic.gov/bankfind-suite/bankfind","https://www.nmlsconsumeraccess.org/","https://www.opensecrets.org/","https://littlesis.org/","https://www.muckrock.com/","https://publicaccountability.org/datasets/home/"]
  },
  {
    id: "04", label: "China / Public Records / OSINT",
    links: ["https://github.com/paulpogoda/OSINT-Tools-China","https://github.com/wddadk/OSINT-for-countries","https://www.gsxt.gov.cn/","https://www.gsxt.gov.cn/index.html","https://zzapp.gsxt.gov.cn/","https://xwqy.gsxt.gov.cn/","https://www.samr.gov.cn/","https://wenshu.court.gov.cn/","https://zxgk.court.gov.cn/","https://rmfyalk.court.gov.cn/","https://english.court.gov.cn/","https://www.creditchina.gov.cn/","https://www.tianyancha.com/","https://www.tianyancha.com/search","https://www.qcc.com/","https://www.qcckyc.com/","https://aiqicha.baidu.com/","https://www.cninfo.com.cn/","https://www.sse.com.cn/","https://english.sse.com.cn/markets/equities/announcements/","https://www.szse.cn/","https://www.bse.cn/","https://www.csrc.gov.cn/","https://beian.miit.gov.cn/","https://www.cnipa.gov.cn/","https://www.ccgp.gov.cn/","https://data.stats.gov.cn/","https://flk.npc.gov.cn/","https://www.customs.gov.cn/","https://www.beianx.cn/","https://site.ip138.com/","https://x.threatbook.cn/","https://dns.aizhan.com/","https://hunter.qianxin.com/","https://quake.360.net/","https://sou.xiaolanben.com/pc","https://www.qimai.cn/","https://weixin.sogou.com/","https://0.zone/","https://map.baidu.com/","https://www.amap.com/","https://www.registrationchina.com/china-company-search/","https://www.aei.org/china-global-investment-tracker/","https://1792exchange.com/databases/china-risk-database/"]
  },
  {
    id: "05", label: "OSINT / Master Collections / Frameworks",
    links: ["https://github.com/jivoi/awesome-osint","https://github.com/cipher387/osint_stuff_tool_collection","https://github.com/cipher387/osintmap","https://github.com/ubikron/Awesome-OSINT-Lists","https://github.com/Jieyab89/OSINT-Cheat-sheet","https://github.com/Astrosp/Awesome-OSINT-List","https://github.com/awesomelistsio/awesome-osint","https://github.com/rawfilejson/awesome-osint-arsenal","https://github.com/soxoj/osint-namecheckers-list","https://github.com/osintambition/Social-Media-OSINT-Tools-Collection","https://osintframework.com/","https://github.com/lockfale/osint-framework","https://osint.industries/","https://maxintel.org/","https://maxintel.org/osint-tools.html","https://1trace.space/","https://www.osintcombine.com/free-osint-tools","https://infoseclabs.io/osint-tools/","https://theosintvault.io/osint-grid","https://digitaldigging.org/osint/","https://github.com/kpcyrd/sn0int","https://sn0int.com/","https://www.spiderfoot.net/","https://github.com/smicallef/spiderfoot","https://www.maltego.com/","https://lampyre.io/"]
  },
  {
    id: "06", label: "Username / Email / Phone / Identity OSINT",
    links: ["https://github.com/mxrch/GHunt","https://github.com/soxoj/maigret","https://github.com/sherlock-project/sherlock","https://github.com/megadose/holehe","https://github.com/p1ngul1n0/blackbird","https://github.com/sundowndev/phoneinfoga","https://github.com/qeeqbox/social-analyzer","https://github.com/Datalux/Osintgram","https://github.com/alpkeskin/mosint","https://github.com/khast3x/h8mail","https://github.com/kaifcodec/user-scanner","https://github.com/Ekultek/WhatBreach","https://whatsmyname.app/","https://epieos.com/","https://hunter.io/","https://haveibeenpwned.com/","https://dehashed.com/","https://intelx.io/","https://github.com/Alfredredbird/tookie-osint","https://github.com/TermuxHackz/X-osint"]
  },
  {
    id: "07", label: "Web Search / Archives / Historical Research",
    links: ["https://www.google.com/","https://www.bing.com/","https://search.brave.com/","https://duckduckgo.com/","https://www.startpage.com/","https://www.mojeek.com/","https://www.qwant.com/","https://www.baidu.com/","https://www.sogou.com/","https://www.so.com/","https://archive.org/web/","https://web.archive.org/","https://commoncrawl.org/","https://webcheck.xyz/"]
  },
  {
    id: "08", label: "Domain / DNS / IP / Internet-Asset Intelligence",
    links: ["https://www.shodan.io/","https://search.censys.io/","https://www.criminalip.io/","https://www.binaryedge.io/","https://netlas.io/","https://search.onyphe.io/","https://leakix.net/","https://viz.greynoise.io/","https://urlscan.io/","https://www.virustotal.com/","https://www.securitytrails.com/","https://builtwith.com/","https://www.wappalyzer.com/","https://dnsdumpster.com/","https://crt.sh/","https://bgp.tools/","https://bgp.he.net/","https://who.is/","https://viewdns.info/","https://dnschecker.org/","https://centralops.net/","https://mxtoolbox.com/","https://github.com/owasp-amass/amass","https://github.com/projectdiscovery/subfinder","https://github.com/projectdiscovery/httpx","https://github.com/projectdiscovery/nuclei","https://github.com/projectdiscovery/naabu","https://github.com/projectdiscovery/dnsx","https://github.com/projectdiscovery/katana","https://github.com/projectdiscovery/shuffledns","https://github.com/projectdiscovery/chaos-client","https://github.com/projectdiscovery/nuclei-templates","https://github.com/elceef/dnstwist","https://github.com/blechschmidt/massdns","https://github.com/mschwager/fierce","https://github.com/d3mondev/puredns","https://github.com/tomnomnom/assetfinder","https://github.com/tomnomnom/waybackurls","https://github.com/lc/gau","https://github.com/hakluke/hakrawler","https://github.com/jaeles-project/gospider"]
  },
  {
    id: "09", label: "Threat Intelligence / Malware / Phishing / Sandbox",
    links: ["https://otx.alienvault.com/","https://pulsedive.com/","https://www.threatminer.org/","https://www.abuseipdb.com/","https://talosintelligence.com/","https://abuse.ch/","https://threatfox.abuse.ch/","https://urlhaus.abuse.ch/","https://bazaar.abuse.ch/","https://feodotracker.abuse.ch/","https://sslbl.abuse.ch/","https://www.misp-project.org/","https://github.com/MISP/MISP","https://github.com/opencti-platform/opencti","https://github.com/intelowlproject/IntelOwl","https://intelowlproject.github.io/","https://github.com/CybercentreCanada/assemblyline","https://www.virustotal.com/gui/home/search","https://www.virustotal.com/gui/home/upload","https://www.hybrid-analysis.com/","https://tria.ge/","https://www.joesandbox.com/","https://any.run/","https://github.com/kevoreilly/CAPEv2","https://openphish.com/","https://www.phishtank.com/","https://www.urlvoid.com/","https://sitecheck.sucuri.net/","https://github.com/mandiant/capa","https://github.com/mandiant/stringsifter","https://github.com/Yara-Rules/rules","https://virustotal.github.io/yara/","https://github.com/VirusTotal/yara","https://github.com/yeti-platform/yeti","https://yeti-platform.io/","https://thehive-project.org/","https://github.com/TheHive-Project/TheHive","https://github.com/TheHive-Project/Cortex","https://github.com/hslatman/awesome-threat-intelligence"]
  },
  {
    id: "10", label: "GEOINT / Maps / Satellite / Flight / Vessel",
    links: ["https://tineye.com/","https://yandex.com/images/","https://explore.microsoft.com/en-us/bing/visual-search","https://exiftool.org/","https://browser.dataspace.copernicus.eu/","https://dataspace.copernicus.eu/","https://www.sentinel-hub.com/","https://www.sentinel-hub.com/explore/eobrowser/","https://worldview.earthdata.nasa.gov/","https://www.earthdata.nasa.gov/data/tools/worldview","https://earthexplorer.usgs.gov/","https://firms.modaps.eosdis.nasa.gov/","https://firms.modaps.eosdis.nasa.gov/map/","https://zoom.earth/","https://zoom.earth/maps/satellite/","https://earth.google.com/","https://www.google.com/maps","https://openstreetmap.org/","https://overpass-turbo.eu/","https://osm-search.bellingcat.com/","https://openinframap.org/","https://www.mapillary.com/","https://geohints.com/","https://www.suncalc.org/","https://suncalc.net/","https://shademap.app/","https://app.shadowmap.org/","https://github.com/The-Osint-Toolbox/Geolocation-OSINT","https://www.marinetraffic.com/","https://globalfishingwatch.org/map","https://globalfishingwatch.org/map/vessel-search","https://globe.adsbexchange.com/","https://www.adsbexchange.com/","https://opensky-network.org/","https://opensky-network.org/data/api","https://www.flightaware.com/","https://www.flightaware.com/live/","https://www.flightradar24.com/"]
  },
  {
    id: "11", label: "Blockchain / Crypto OSINT",
    links: ["https://osint.intelligenceonchain.com/","https://github.com/aaarghhh/awesome_osint_blockchain_analysis","https://blockchair.com/","https://etherscan.io/","https://bscscan.com/","https://solscan.io/","https://tronscan.org/","https://arbiscan.io/","https://mempool.space/","https://www.blockchain.com/explorer/","https://arkm.com/","https://www.breadcrumbs.app/","https://misttrack.io/","https://chainabuse.com/","https://www.chainalysis.com/","https://www.trmlabs.com/","https://www.elliptic.co/","https://crystalintelligence.com/"]
  },
  {
    id: "12", label: "Reverse Engineering / Binary Analysis",
    links: ["https://ghidra-sre.org/","https://github.com/NationalSecurityAgency/ghidra","https://rada.re/","https://github.com/radareorg/radare2","https://rizin.re/","https://cutter.re/","https://github.com/rizinorg/cutter","https://hex-rays.com/ida-pro/","https://binary.ninja/","https://x64dbg.com/","https://github.com/x64dbg/x64dbg","https://github.com/dnSpyEx/dnSpy","https://imhex.werwolv.net/","https://github.com/WerWolv/ImHex","https://angr.io/","https://github.com/angr/angr","https://www.capstone-engine.org/","https://github.com/capstone-engine/capstone","http://www.keystone-engine.org/","https://github.com/keystone-engine/keystone","https://www.unicorn-engine.org/","https://github.com/unicorn-engine/unicorn"]
  },
  {
    id: "13", label: "Android / iOS / Mobile / Firmware",
    links: ["https://frida.re/","https://github.com/frida/frida","https://github.com/sensepost/objection","https://github.com/skylot/jadx","https://apktool.org/","https://github.com/iBotPeaches/Apktool","https://mobsf.github.io/Mobile-Security-Framework-MobSF/","https://github.com/MobSF/Mobile-Security-Framework-MobSF","https://github.com/rednaga/APKiD","https://github.com/pxb1988/dex2jar","https://github.com/java-decompiler/jd-gui","https://github.com/ReFirmLabs/binwalk","https://github.com/e-m-b-a/emba","https://mas.owasp.org/MASTG/","https://mas.owasp.org/MASTG/tools/","https://owasp.org/www-project-mobile-app-security/","https://github.com/user1342/Awesome-Android-Reverse-Engineering","https://github.com/wtsxdev/reverse-engineering","https://github.com/ReversingID/Awesome-Reversing","https://github.com/alphaSeclab/android-security","https://github.com/wtsxDev/android-security-list","https://github.com/blacktop/ipsw","https://github.com/GhidraEnjoyr/iOS-Reverse-Engineering","https://github.com/geeksniper/reverse-engineering-toolkit","https://github.com/5A59/AndroidReverseEngineering","https://github.com/lasting-yang/frida_hook_libart","https://github.com/lasting-yang/FridaDump","https://github.com/hluwa/FRIDA-DEXDump","https://github.com/hluwa/Wallbreaker","https://github.com/r0ysue/r0capture","https://github.com/r0ysue/AndroidSecurityStudy"]
  },
  {
    id: "14", label: "Network / Web / Wireless Security Testing",
    links: ["https://nmap.org/","https://www.metasploit.com/","https://github.com/rapid7/metasploit-framework","https://portswigger.net/burp","https://www.zaproxy.org/","https://mitmproxy.org/","https://www.bettercap.org/","https://www.aircrack-ng.org/","https://github.com/aircrack-ng/aircrack-ng","https://github.com/alobbs/macchanger","https://www.gnu.org/software/macchanger/","https://github.com/robertdavidgraham/masscan","https://github.com/zmap/zmap","https://github.com/zmap/zgrab2","https://github.com/bee-san/RustScan","https://github.com/ffuf/ffuf","https://github.com/epi052/feroxbuster","https://github.com/OJ/gobuster","https://github.com/maurosoria/dirsearch","https://github.com/sqlmapproject/sqlmap","https://sqlmap.org/","https://github.com/sullo/nikto","https://cirt.net/Nikto2","https://github.com/hahwul/dalfox"]
  },
  {
    id: "15", label: "DFIR / Blue Team / Forensics / Network Monitoring",
    links: ["https://www.sleuthkit.org/","https://github.com/SleuthKitLabs","https://github.com/volatilityfoundation/volatility3","https://github.com/Velocidex/velociraptor","https://docs.velociraptor.app/","https://timesketch.org/","https://github.com/google/timesketch","https://github.com/log2timeline/plaso","https://ericzimmerman.github.io/","https://github.com/EricZimmerman/KapeFiles","https://ericzimmerman.github.io/KapeDocs/","https://www.wireshark.org/","https://www.tcpdump.org/","https://securityonionsolutions.com/","https://github.com/Security-Onion-Solutions/securityonion","https://zeek.org/","https://github.com/zeek/zeek","https://suricata.io/","https://github.com/OISF/suricata","https://arkime.com/","https://wazuh.com/","https://www.snort.org/"]
  },
  {
    id: "16", label: "Security Operating Systems / Lab Environments",
    links: ["https://www.kali.org/","https://www.kali.org/tools/","https://www.parrotsec.org/","https://blackarch.org/","https://tails.net/","https://www.qubes-os.org/","https://securityonionsolutions.com/","https://remnux.org/","https://flare-vm.org/","https://github.com/mandiant/flare-vm"]
  },
  {
    id: "17", label: "AI / Chat / Search / Model Platforms",
    links: ["https://skynetchat.net/","https://www.openai.com/","https://chatgpt.com/","https://claude.ai/","https://www.anthropic.com/","https://gemini.google.com/","https://www.perplexity.ai/","https://x.ai/","https://grok.com/","https://poe.com/","https://www.phind.com/","https://you.com/","https://huggingface.co/","https://openrouter.ai/","https://groq.com/","https://console.groq.com/","https://www.together.ai/","https://fireworks.ai/","https://replicate.com/","https://ai.meta.com/"]
  },
  {
    id: "18", label: "AI / Coding Agents",
    links: ["https://cursor.com/","https://devin.ai/","https://cline.bot/","https://github.com/cline/cline","https://www.anthropic.com/claude-code","https://openai.com/codex/","https://github.com/openai/codex","https://github.com/openai/codex-security","https://antigravity.google/","https://github.com/google-antigravity/antigravity-cli","https://github.com/google-gemini/gemini-cli","https://continue.dev/","https://github.com/continuedev/continue","https://github.com/Aider-AI/aider","https://github.com/All-Hands-AI/OpenHands","https://github.com/SWE-agent/SWE-agent","https://github.com/RooVetGit/Roo-Code","https://github.com/sst/opencode","https://github.com/AntonOsika/gpt-engineer","https://kilo.ai/","https://github.com/kilo-org","https://github.com/aaif-goose/goose","https://goose-docs.ai/","https://ampcode.com/","https://github.com/features/copilot","https://replit.com/ai","https://github.com/bradagi/awesome-cli-coding-agents"]
  },
  {
    id: "19", label: "AI / Local / Self-Hosted / Inference",
    links: ["https://ollama.com/","https://github.com/ollama/ollama","https://lmstudio.ai/","https://github.com/open-webui/open-webui","https://github.com/Mintplex-Labs/anything-llm","https://anythingllm.com/","https://github.com/mudler/LocalAI","https://github.com/vllm-project/vllm","https://github.com/ggml-org/llama.cpp","https://github.com/nomic-ai/gpt4all","https://www.nomic.ai/gpt4all","https://jan.ai/","https://github.com/janhq/jan","https://github.com/oobabooga/textgen","https://github.com/sgl-project/sglang","https://docs.sglang.ai/","https://github.com/NVIDIA/TensorRT-LLM","https://developer.nvidia.com/tensorrt-llm","https://github.com/ml-explore/mlx","https://github.com/ml-explore/mlx-lm"]
  },
  {
    id: "20", label: "AI / Agent Frameworks / Automation",
    links: ["https://github.com/langchain-ai/langchain","https://github.com/langchain-ai/langgraph","https://www.langchain.com/langgraph","https://crewai.com/","https://github.com/crewAIInc/crewAI","https://www.llamaindex.ai/llamaindex","https://github.com/run-llama/llama_index","https://github.com/pydantic/pydantic-ai","https://github.com/mastra-ai/mastra","https://github.com/agno-agi/agno","https://github.com/huggingface/smolagents","https://github.com/deepset-ai/haystack","https://github.com/microsoft/semantic-kernel","https://github.com/microsoft/agent-framework","https://github.com/openai/openai-agents-python","https://github.com/openai/openai-agents-js","https://github.com/google/adk-python","https://github.com/google/adk-web","https://adk.dev/","https://github.com/microsoft/autogen","https://github.com/browser-use/browser-use","https://github.com/Skyvern-AI/skyvern","https://github.com/browserbase/stagehand","https://github.com/microsoft/playwright-mcp","https://github.com/steel-dev/steel-browser","https://github.com/steel-dev/awesome-web-agents","https://github.com/mendableai/firecrawl","https://github.com/unclecode/crawl4ai","https://github.com/VinciGit00/Scrapegraph-ai","https://github.com/mem0ai/mem0","https://github.com/letta-ai/letta","https://github.com/n8n-io/n8n","https://n8n.io/","https://zapier.com/","https://www.make.com/","https://pipedream.com/","https://www.gumloop.com/","https://www.lindy.ai/","https://github.com/FlowiseAI/Flowise","https://github.com/langflow-ai/langflow","https://github.com/activepieces/activepieces","https://github.com/OpenInterpreter/open-interpreter","https://github.com/microsoft/OmniParser","https://github.com/simular-ai/Agent-S","https://github.com/bytedance/UI-TARS"]
  },
  {
    id: "21", label: "China / China-Origin AI Ecosystem",
    links: ["https://www.deepseek.com/","https://chat.deepseek.com/","https://github.com/deepseek-ai","https://github.com/deepseek-ai/DeepSeek-V3","https://github.com/deepseek-ai/DeepSeek-R1","https://github.com/deepseek-ai/DeepSeek-Coder","https://github.com/deepseek-ai/DeepSeek-VL2","https://github.com/deepseek-ai/Janus","https://qwen.ai/","https://github.com/QwenLM","https://github.com/QwenLM/Qwen","https://github.com/QwenLM/Qwen-Agent","https://github.com/QwenLM/Qwen3-VL","https://github.com/QwenLM/Qwen2.5-VL","https://github.com/QwenLM/Qwen2-Audio","https://github.com/QwenLM/Qwen2-VL","https://github.com/QwenLM/Qwen2.5-Coder","https://www.kimi.com/","https://platform.moonshot.cn/","https://www.doubao.com/","https://yuanbao.tencent.com/","https://hunyuan.tencent.com/","https://yiyan.baidu.com/","https://chatglm.cn/","https://github.com/THUDM","https://github.com/THUDM/ChatGLM3","https://github.com/THUDM/GLM-4","https://github.com/THUDM/CogVLM","https://github.com/THUDM/CogVideo","https://www.bigmodel.cn/","https://www.minimaxi.com/","https://www.baichuan-ai.com/","https://github.com/baichuan-inc/Baichuan2","https://www.01.ai/","https://github.com/01-ai/Yi","https://xinghuo.xfyun.cn/","https://tongyi.aliyun.com/","https://modelscope.cn/","https://github.com/modelscope","https://github.com/PaddlePaddle","https://github.com/PaddlePaddle/PaddleNLP","https://github.com/InternLM","https://github.com/InternLM/InternLM","https://github.com/InternLM/InternLM-XComposer","https://github.com/FlagOpen","https://github.com/OpenBMB","https://github.com/OpenBMB/ChatDev","https://github.com/OpenBMB/MiniCPM","https://github.com/OpenBMB/XAgent","https://github.com/OpenMOSS/MOSS","https://github.com/OpenGVLab/InternVL","https://github.com/QwenAudio/Fun-ASR","https://github.com/labring/FastGPT","https://fastgpt.io/","https://github.com/CherryHQ/cherry-studio","https://github.com/netease-youdao/QAnything","https://github.com/infiniflow/ragflow","https://github.com/langgenius/dify","https://github.com/coze-dev/coze-studio","https://github.com/coze-dev/coze-loop","https://www.coze.com/","https://github.com/1Panel-dev/MaxKB","https://manus.im/"]
  },
  {
    id: "22", label: "AI Security / Agent Security / LLM Testing",
    links: ["https://github.com/scadastrangelove/awesome-ai-security-tools","https://github.com/ottosulin/awesome-ai-security","https://github.com/NVIDIA/garak","https://github.com/microsoft/PyRIT","https://github.com/promptfoo/promptfoo","https://www.promptfoo.dev/","https://github.com/Giskard-AI/giskard-oss","https://github.com/snyk/agent-scan","https://github.com/NVIDIA/NeMo-Guardrails","https://github.com/protectai/llm-guard","https://github.com/UKGovernmentBEIS/inspect_ai","https://github.com/UKGovernmentBEIS/inspect_evals","https://github.com/UKGovernmentBEIS/control-arena","https://github.com/0din-ai/ai-scanner","https://github.com/greydgl/pentestgpt","https://github.com/usestrix/strix","https://www.strix.ai/","https://github.com/KeygraphHQ/shannon","https://keygraph.io/open-source","https://github.com/aliasrobotics/CAI","https://github.com/Tencent/AI-Infra-Guard","https://github.com/0x4m4/hexstrike-ai","https://github.com/vxcontrol/pentagi","https://pentagi.com/","https://github.com/BugTraceAI/BugTraceAI-CLI","https://bugtraceai.com/","https://github.com/luckyPipewrench/pipelock","https://pipelab.org/","https://github.com/luckyPipewrench/agent-egress-bench","https://github.com/Armur-Ai/Pentest-Swarm-AI","https://github.com/0xsteph/pentest-ai","https://github.com/nearai/ironclaw","https://github.com/always-further/nono"]
  },
  {
    id: "23", label: "China / Cybersecurity / Internet-Asset Tools",
    links: ["https://www.zoomeye.ai/","https://github.com/knownsec/zoomeye-python","https://en.fofa.info/","https://fofa.info/","https://hunter.how/","https://hunter.qianxin.com/","https://quake.360.net/","https://x.threatbook.com/","https://x.threatbook.cn/","https://github.com/knownsec/Kunyu","https://github.com/knownsec/pocsuite3","https://github.com/knownsec/404StarLink","https://github.com/chaitin","https://github.com/chaitin/xray","https://github.com/chaitin/SafeLine","https://github.com/chaitin/chaitin-cli","https://github.com/chaitin/veinmind-tools","https://github.com/yaklang/yaklang","https://yaklang.com/","https://github.com/shadow1ng/fscan","https://github.com/EdgeSecurityTeam/EHole","https://github.com/Aabyss-Team/ARL","https://github.com/TophantTechnology/ARL","https://github.com/veo/vscan","https://github.com/chainreactors/spray","https://github.com/chainreactors/gogo","https://github.com/Tencent/HaboMalHunter","https://github.com/tencent/AI-Infra-Guard","https://github.com/Tencent/matrix","https://github.com/alibaba/arthas","https://arthas.aliyun.com/","https://github.com/bytedance/Elkeid","https://github.com/knownsec/openclaw-security","https://github.com/chaitin/PandaWiki","https://github.com/chaitin/MonkeyCode"]
  },
  {
    id: "24", label: "Classic SEO / Content / Search Intelligence",
    links: ["https://getautoseo.com/","https://www.semrush.com/","https://ahrefs.com/","https://moz.com/","https://www.screamingfrog.co.uk/seo-spider/","https://surferseo.com/","https://www.marketmuse.com/","https://www.clearscope.io/","https://www.frase.io/","https://writesonic.com/","https://www.jasper.ai/","https://www.scalenut.com/","https://seranking.com/","https://mangools.com/","https://neilpatel.com/ubersuggest/","https://search.google.com/search-console/","https://trends.google.com/","https://pagespeed.web.dev/","https://developers.google.com/search","https://www.brightedge.com/","https://www.botify.com/","https://www.seoclarity.net/","https://www.conductor.com/","https://www.spyfu.com/","https://www.similarweb.com/","https://www.sistrix.com/","https://searchatlas.com/","https://sitechecker.pro/","https://seomonitor.com/"]
  },
  {
    id: "25", label: "GEO / AEO / LLMO / AI-Search Visibility",
    links: ["https://www.tryprofound.com/","https://peec.ai/","https://otterly.ai/","https://athenahq.ai/","https://scrunch.com/","https://www.bluefishai.com/","https://www.evertune.ai/","https://higoodie.com/","https://promptwatch.com/","https://rankscale.ai/","https://www.brandlight.ai/","https://www.azoma.ai/","https://relixir.ai/","https://gumshoe.ai/","https://usehall.com/","https://www.nimt.ai/","https://www.withgauge.com/","https://www.geostar.ai/","https://vaylis.ai/","https://www.quattr.com/","https://www.getpassionfruit.ai/","https://rankprompt.ai/","https://productrank.ai/","https://ziptie.dev/","https://www.amionai.com/","https://www.usebear.ai/","https://getcito.com/","https://llmrefs.com/","https://authoritas.com/","https://azoma.ai/","https://usebear.ai/","https://bluefishai.com/","https://botify.com/","https://conductor.com/","https://askdoppler.com/","https://elelem.ai/","https://emberos.ai/","https://engenius.one/","https://erlin.ai/","https://essio.ai/","https://evertune.ai/","https://finseo.ai/","https://firstanswer.ai/","https://fiveblocks.com/","https://tryflint.com/","https://highlighted.ai/","https://jarts.io/","https://justblank.io/","https://kaifootprint.com/","https://keytomic.com/","https://keyword.com/","https://kime.ai/","https://knwn.app/","https://lagrank.com/","https://llmeo.app/","https://llmpulse.ai/","https://llmseomonitor.com/","https://llmtel.com/","https://llmwatcher.com/","https://localfalcon.com/","https://localglyph.com/","https://looptic.ai/","https://marketingminer.com/","https://maxeo.ai/","https://minddex.ai/","https://modelmonitor.ai/","https://getstat.com/","https://nightwatch.io/","https://nimt.ai/","https://obsero.ai/","https://omniseo.com/","https://opttab.com/","https://orchly.ai/","https://rankspro.io/","https://rankshift.ai/","https://revere-ai.com/","https://riffanalytics.ai/","https://rivalsee.com/","https://screpy.com/","https://scriptbee.ai/","https://searchparty.com/","https://searchable.com/","https://seen-by.ai/","https://sellm.io/","https://serprecon.com/","https://shareofmodel.ai/","https://trysight.ai/","https://sitesignal.app/","https://govisible.ai/","https://get-spotlight.com/","https://superlines.io/","https://traqer.ai/","https://waikay.io/"]
  }
];

export function getToolName(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'github.com') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        const repo = parts[1];
        return repo.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }
    let host = parsed.hostname.replace(/^www\./, '');
    const segments = host.split('.');
    let name = segments.length > 1 ? segments[segments.length - 2] : segments[0];
    if (['co', 'com', 'gov', 'org', 'ac', 'net', 'edu'].includes(name) && segments.length > 2) {
      name = segments[segments.length - 3];
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return url;
  }
}

/** Flat list of every tool across all categories */
export function getAllTools(): Tool[] {
  return CATEGORIES.flatMap((cat) =>
    cat.links.map((url) => ({
      url,
      name: getToolName(url),
      categoryId: cat.id,
      categoryLabel: cat.label,
    }))
  );
}

/** Filter tools by keyword (case-insensitive) */
export function filterTools(query: string, tools: Tool[]): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.url.toLowerCase().includes(q) ||
      t.categoryLabel.toLowerCase().includes(q)
  );
}
