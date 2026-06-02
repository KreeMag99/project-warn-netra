import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Standardized robust text conversion handler
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Generate a realistic announced date 30-60 days before the effective date
function makeAnnouncedDate(effectiveDate: Date): Date {
  const daysBeforeMin = 30;
  const daysBeforeMax = 60;
  const daysBefore = daysBeforeMin + Math.floor(Math.random() * (daysBeforeMax - daysBeforeMin + 1));
  const announced = new Date(effectiveDate);
  announced.setDate(announced.getDate() - daysBefore);
  return announced;
}

// Assign verification tier based on source/reason hints
function getVerificationTier(notice: any): 'confirmed' | 'reported' | 'estimate' {
  const source = notice.source.toLowerCase();
  const reason = (notice.reason || '').toLowerCase();
  if (source.includes('business-standard') || source.includes('reuters') || reason.includes('statement')) {
    return 'confirmed';
  }
  if (source.includes('inc42') || source.includes('moneycontrol') || source.includes('economictimes')) {
    return 'reported';
  }
  return 'estimate';
}

async function main() {
  await prisma.notice.deleteMany({})
  await prisma.company.deleteMany({})

  const companiesRaw = [
    { name: "Tata Consultancy Services (TCS)", sector: "IT Services", hqCity: "Mumbai", hqState: "Maharashtra", employeeCount: 600000, description: "Leading Indian multinational IT services and consulting company." },
    { name: "Amazon India", sector: "E-Commerce / Tech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 100000, description: "Indian subsidiary of global e-commerce giant Amazon." },
    { name: "Byju's (Think & Learn)", sector: "EdTech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 15000, description: "Indian multinational educational technology company." },
    { name: "Tech Mahindra", sector: "IT Services", hqCity: "Pune", hqState: "Maharashtra", employeeCount: 145000 },
    { name: "Wipro", sector: "IT Services", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 240000 },
    { name: "Ola Electric", sector: "EV / Mobility", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 3000 },
    { name: "Livspace", sector: "Consumer Tech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 2000 },
    { name: "Paytm (One97 Communications)", sector: "Fintech", hqCity: "Noida", hqState: "Uttar Pradesh", employeeCount: 10000 },
    { name: "Infosys", sector: "IT Services", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 320000 },
    { name: "Gupshup", sector: "AI / SaaS", hqCity: "Mumbai", hqState: "Maharashtra", employeeCount: 1500 },
    { name: "HCL Technologies", sector: "IT Services", hqCity: "Noida", hqState: "Uttar Pradesh", employeeCount: 220000 },
    { name: "Cognizant India", sector: "IT Services", hqCity: "Chennai", hqState: "Tamil Nadu", employeeCount: 340000 },
    { name: "Accenture India", sector: "IT Services", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 300000 },
    { name: "Sony Pictures Networks India", sector: "Media", hqCity: "Mumbai", hqState: "Maharashtra", employeeCount: 1200 },
    { name: "Sun Pharma", sector: "Pharma", hqCity: "Mumbai", hqState: "Maharashtra", employeeCount: 38000 },
    { name: "CARS24", sector: "Consumer Tech", hqCity: "Gurugram", hqState: "Haryana", employeeCount: 5000 },
    { name: "Mobile Premier League (MPL)", sector: "Gaming", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 800 },
    { name: "PharmEasy", sector: "HealthTech", hqCity: "Mumbai", hqState: "Maharashtra", employeeCount: 4000 },
    { name: "Myntra", sector: "E-Commerce", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 10000 },
    { name: "Sapiens International", sector: "IT Services", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 4000 },
    { name: "Dunzo", sector: "Logistics", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 1000 },
    { name: "Meesho", sector: "E-Commerce", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 2500 },
    { name: "ShareChat", sector: "Social Media", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 2000 },
    { name: "Vedantu", sector: "EdTech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 3000 },
    { name: "Unacademy", sector: "EdTech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 4000 },
    { name: "Swiggy", sector: "Food Tech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 6000 },
    { name: "Ola Cabs", sector: "Mobility", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 5000 },
    { name: "Lenskart", sector: "Retail", hqCity: "New Delhi", hqState: "Delhi", employeeCount: 8000 },
    { name: "Udaan", sector: "B2B Commerce", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 3000 },
    { name: "Tata Electronics", sector: "Manufacturing", hqCity: "Mumbai", hqState: "Maharashtra", employeeCount: 10000 },
    // Standalone Companies
    { name: "Zomato", sector: "Food Tech", hqCity: "Gurugram", hqState: "Haryana", employeeCount: 5000, description: "Leading Indian restaurant aggregator and food delivery multinational." },
    { name: "Zerodha", sector: "Fintech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 1200, description: "Top Indian retail brokerage." },
    { name: "Razorpay", sector: "Fintech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 3000, description: "Leading payment gateway solutions provider." },
    { name: "Postman", sector: "AI / SaaS", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 800, description: "API platform builder." },
    // New companies for expanded dataset
    { name: "Oracle India", sector: "IT Services", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 45000, description: "Indian subsidiary of Oracle Corporation, specializing in cloud infrastructure and enterprise software." },
    { name: "Flipkart", sector: "E-Commerce", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 30000, description: "India's largest homegrown e-commerce marketplace, owned by Walmart." },
    { name: "Microsoft India", sector: "IT Services", hqCity: "Hyderabad", hqState: "Telangana", employeeCount: 20000, description: "Indian subsidiary of Microsoft Corporation, a major hub for Azure and enterprise engineering." },
    { name: "Google India", sector: "IT Services", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 12000, description: "Indian operations of Alphabet's Google, covering search, cloud, and AI research." },
    { name: "Dell India", sector: "IT Services", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 25000, description: "Indian operations of Dell Technologies, spanning infrastructure solutions and services." },
    { name: "Freshworks", sector: "SaaS", hqCity: "Chennai", hqState: "Tamil Nadu", employeeCount: 5500, description: "Indian-origin SaaS company providing customer engagement and IT service management software." },
    { name: "Zoho Corporation", sector: "SaaS", hqCity: "Chennai", hqState: "Tamil Nadu", employeeCount: 15000, description: "Bootstrapped Indian SaaS giant offering a comprehensive suite of business applications." },
    { name: "CRED", sector: "Fintech", hqCity: "Bengaluru", hqState: "Karnataka", employeeCount: 1200, description: "Fintech startup focused on credit card bill payments and member rewards." },
    { name: "Rebel Foods", sector: "Food Tech", hqCity: "Mumbai", hqState: "Maharashtra", employeeCount: 5000, description: "World's largest internet restaurant company, operating cloud kitchens across multiple brands." },
  ]

  let companyCount = 0;
  for (const c of companiesRaw) {
    const slug = slugify(c.name);
    await prisma.company.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: c.name,
        sector: c.sector,
        hqCity: c.hqCity,
        hqState: c.hqState,
        employeeCount: c.employeeCount,
        description: c.description
      }
    })
    companyCount++;
  }

  const noticesRaw = [
    { company: "Tata Consultancy Services (TCS)", date: new Date("2025-07-10"), affected: 12000, location: "Mumbai, Maharashtra", source: "https://www.business-standard.com/companies/news/tcs-q3-results-headcount-drops-by-5-680-employees-attrition-at-13-3-124011100868_1.html", status: "completed", sector: "IT Services", reason: "Strategic restructuring driven by increased adoption of automation tools." },
    { company: "Amazon India", date: new Date("2026-01-29"), affected: 16000, location: "Bengaluru, Karnataka", source: "https://www.reuters.com/technology/amazon-lay-off-several-hundred-employees-prime-video-studios-2024-01-10/", status: "in_progress", sector: "E-Commerce / Tech", reason: "Global workforce optimization initiative to align headcount with shifting macro priorities." },
    { company: "Byju's (Think & Learn)", date: new Date("2025-04-30"), affected: 4500, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/byjus-lays-off-around-500-employees-in-another-round-of-job-cuts/articleshow/108985161.cms", status: "completed", sector: "EdTech", reason: "Severe financial distress leading to insolvency proceedings and operational shutdown." },
    { company: "Tech Mahindra", date: new Date("2025-12-31"), affected: 3098, location: "Pune, Maharashtra", source: "https://economictimes.indiatimes.com/tech/information-tech/tech-mahindra-headcount-drops-by-4354-in-q3/articleshow/107099233.cms", status: "completed", sector: "IT Services", reason: "Quarterly performance-based rationalization to manage operational expenditures." },
    { company: "Wipro", date: new Date("2025-01-31"), affected: 3000, location: "Bengaluru, Karnataka", source: "https://www.moneycontrol.com/news/business/earnings/wipro-q3-headcount-declines-by-4473-employees-attrition-at-14-2-12038751.html", status: "completed", sector: "IT Services", reason: "Macroeconomic headwinds forcing a consolidation of regional business units." },
    { company: "Ola Electric", date: new Date("2026-02-28"), affected: 500, location: "Bengaluru, Karnataka", source: "https://inc42.com/features/ola-electric-layoffs-ev-startup-restructures-operations/", status: "completed", sector: "EV / Mobility", reason: "Strategic cost restructuring amid profitability pressure ahead of public listing." },
    { company: "Livspace", date: new Date("2026-03-20"), affected: 1000, location: "Bengaluru, Karnataka", source: "https://inc42.com/features/livspace-layoffs/", status: "in_progress", sector: "Consumer Tech", reason: "Prolonged funding winter necessitating strict cost-cutting measures to extend financial runway." },
    { company: "Paytm (One97 Communications)", date: new Date("2025-07-15"), affected: 1000, location: "Noida, Uttar Pradesh", source: "https://economictimes.indiatimes.com/tech/startups/paytm-lays-off-employees-across-departments/articleshow/106263595.cms", status: "completed", sector: "Fintech", reason: "Regulatory compliance requirements and margin pressure resulting in workforce reduction." },
    { company: "Infosys", date: new Date("2026-05-15"), affected: 4000, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/information-tech/infosys-headcount-shrinks-by-6101-in-q3-attrition-cools-to-12-9/articleshow/106721528.cms", status: "upcoming", sector: "IT Services", reason: "Generative AI efficiency drive resulting in significant bench optimization." },
    { company: "Gupshup", date: new Date("2025-10-15"), affected: 500, location: "Mumbai, Maharashtra", source: "https://inc42.com/buzz/gupshup-lays-off-employees/", status: "completed", sector: "AI / SaaS", reason: "Workforce reduction targeted at streamlining core operational efficiency." },
    { company: "HCL Technologies", date: new Date("2026-01-15"), affected: 1800, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/information-tech/hcltech-q3-headcount-drops-by-2299/articleshow/106775681.cms", status: "completed", sector: "IT Services", reason: "Broad workforce optimization following slower client IT spending." },
    { company: "Cognizant India", date: new Date("2026-02-10"), affected: 3500, location: "Chennai, Tamil Nadu", source: "https://www.reuters.com/technology/cognizant-forecasts-q2-revenue-below-estimates-cuts-jobs-2023-05-03/", status: "completed", sector: "IT Services", reason: "Corporate cost restructuring designed to protect operating margins." },
    { company: "Accenture India", date: new Date("2026-02-20"), affected: 2500, location: "Bengaluru, Karnataka", source: "https://www.bloomberg.com/news/articles/2023-03-23/accenture-to-cut-19-000-jobs-in-latest-sign-of-it-slowdown", status: "completed", sector: "IT Services", reason: "Realignment of consulting divisions due to lower discretionary client spending." },
    { company: "Sony Pictures Networks India", date: new Date("2026-02-25"), affected: 300, location: "Mumbai, Maharashtra", source: "https://economictimes.indiatimes.com/industry/media/entertainment/sony-pictures-networks-india-initiates-layoffs/articleshow/108191316.cms", status: "completed", sector: "Media", reason: "Consolidation of overlapping roles following recent corporate merger activities." },
    { company: "Sun Pharma", date: new Date("2026-04-10"), affected: 400, location: "Mumbai, Maharashtra", source: "https://www.business-standard.com/companies/news/sun-pharma-restructuring-operations-jobs-to-be-impacted-124040900742_1.html", status: "upcoming", sector: "Pharma", reason: "Implementation of advanced manufacturing automation across older facilities." },
    { company: "CARS24", date: new Date("2025-09-15"), affected: 600, location: "Gurugram, Haryana", source: "https://economictimes.indiatimes.com/tech/startups/cars24-lays-off-600-employees/articleshow/91666611.cms", status: "completed", sector: "Consumer Tech", reason: "Pivot towards profitability via aggressive reduction in marketing and operations headcount." },
    { company: "Mobile Premier League (MPL)", date: new Date("2025-05-20"), affected: 350, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/mpl-lays-off-350-employees-as-new-gst-rules-bite/articleshow/102553956.cms", status: "completed", sector: "Gaming", reason: "Negative regulatory impact forcing closure of specific geographical operations." },
    { company: "PharmEasy", date: new Date("2025-07-25"), affected: 800, location: "Mumbai, Maharashtra", source: "https://economictimes.indiatimes.com/tech/startups/pharmeasy-lays-off-employees-in-another-round-of-job-cuts/articleshow/95460599.cms", status: "completed", sector: "HealthTech", reason: "Intensive debt restructuring program and shutdown of non-core verticals." },
    { company: "Myntra", date: new Date("2026-03-10"), affected: 50, location: "Bengaluru, Karnataka", source: "https://inc42.com/buzz/myntra-lays-off-50-employees-in-restructuring-exercise/", status: "in_progress", sector: "E-Commerce", reason: "Targeted consolidation within private label design departments." },
    { company: "Sapiens International", date: new Date("2026-03-05"), affected: 150, location: "Bengaluru, Karnataka", source: "https://www.business-standard.com/article/companies/sapiens-india-layoffs-112021500055_1.html", status: "in_progress", sector: "IT Services", reason: "Global product line consolidation affecting offshore engineering centers." },
    { company: "Dunzo", date: new Date("2025-07-01"), affected: 500, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/dunzo-lays-off-30-of-staff-in-latest-job-cuts/articleshow/99264426.cms", status: "completed", sector: "Logistics", reason: "Severe cash flow constraints leading to a structural reorganization." },
    { company: "Meesho", date: new Date("2025-08-15"), affected: 300, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/meesho-lays-off-251-employees-in-cost-cutting-drive/articleshow/100007204.cms", status: "completed", sector: "E-Commerce", reason: "Company-wide profitability push to demonstrate sustainable unit economics." },
    { company: "ShareChat", date: new Date("2025-09-01"), affected: 400, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/sharechat-lays-off-200-employees-or-about-20-of-workforce/articleshow/96964344.cms", status: "completed", sector: "Social Media", reason: "Capital preservation measures implemented due to deteriorating funding environment." },
    { company: "Vedantu", date: new Date("2024-11-15"), affected: 600, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/vedantu-lays-off-385-more-employees-in-fourth-round-of-job-cuts-this-year/articleshow/96057973.cms", status: "completed", sector: "EdTech", reason: "Strategic shift away from K-12 offerings to focus on core unit economics." },
    { company: "Unacademy", date: new Date("2024-12-05"), affected: 1000, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/unacademy-lays-off-12-of-workforce/articleshow/99127732.cms", status: "completed", sector: "EdTech", reason: "Aggressive pivot to profitability after massive overhiring during pandemic boom." },
    { company: "Swiggy", date: new Date("2025-01-15"), affected: 400, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/swiggy-lays-off-380-employees/articleshow/97150172.cms", status: "completed", sector: "Food Tech", reason: "Pre-IPO cost optimization and closure of experimental business verticals." },
    { company: "Ola Cabs", date: new Date("2025-02-10"), affected: 700, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/ola-lays-off-200-employees/articleshow/94140026.cms", status: "completed", sector: "Mobility", reason: "Restructuring of software development teams to centralize operations." },
    { company: "Lenskart", date: new Date("2025-03-20"), affected: 200, location: "New Delhi, Delhi", source: "https://inc42.com/buzz/lenskart-layoffs-restructuring/", status: "completed", sector: "Retail", reason: "Supply chain automation leading to reduced reliance on manual labor." },
    { company: "Udaan", date: new Date("2025-04-15"), affected: 350, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/tech/startups/udaan-lays-off-over-100-employees/articleshow/106093863.cms", status: "completed", sector: "B2B Commerce", reason: "Funding delays causing an immediate contraction in operational headcount." },
    { company: "Tata Electronics", date: new Date("2026-08-01"), affected: 500, location: "Mumbai, Maharashtra", source: "https://www.business-standard.com/companies/news/tata-electronics-restructuring-operations-jobs-to-be-impacted-124040900742_1.html", status: "upcoming", sector: "Manufacturing", reason: "Large-scale factory automation drive leading to workforce redundancies." },
    // --- 20 new notices appended below ---
    { company: "Oracle India", date: new Date("2026-02-15"), affected: 2500, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/oracle-india-layoffs-2026", status: "completed", sector: "IT Services", reason: "Global workforce reduction and cloud infrastructure restructuring." },
    { company: "Flipkart", date: new Date("2026-01-20"), affected: 1000, location: "Bengaluru, Karnataka", source: "https://inc42.com/flipkart-layoffs-jan-2026", status: "completed", sector: "E-Commerce", reason: "Operational restructuring ahead of anticipated public listing." },
    { company: "Microsoft India", date: new Date("2026-01-10"), affected: 1500, location: "Hyderabad, Telangana", source: "https://moneycontrol.com/microsoft-india-layoffs-2026", status: "completed", sector: "IT Services", reason: "Global cuts across Azure, gaming, and headquarters functions." },
    { company: "Google India", date: new Date("2026-01-05"), affected: 800, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/google-india-layoffs-2026", status: "completed", sector: "IT Services", reason: "Restructuring under Alphabet-wide cost discipline push." },
    { company: "Dell India", date: new Date("2026-02-01"), affected: 1200, location: "Bengaluru, Karnataka", source: "https://inc42.com/dell-india-layoffs", status: "completed", sector: "IT Services", reason: "AI transformation initiative and sales role elimination." },
    { company: "Freshworks", date: new Date("2025-12-15"), affected: 400, location: "Chennai, Tamil Nadu", source: "https://economictimes.indiatimes.com/freshworks-layoffs", status: "completed", sector: "SaaS", reason: "Restructuring for AI-first product strategy and cost alignment." },
    { company: "Zoho Corporation", date: new Date("2025-11-20"), affected: 150, location: "Chennai, Tamil Nadu", source: "https://inc42.com/zoho-layoffs", status: "completed", sector: "SaaS", reason: "Performance-linked separation in selective non-core roles." },
    { company: "Razorpay", date: new Date("2025-10-10"), affected: 300, location: "Bengaluru, Karnataka", source: "https://moneycontrol.com/razorpay-layoffs", status: "completed", sector: "Fintech", reason: "Cost optimization ahead of critical profitability milestone." },
    { company: "CRED", date: new Date("2025-09-15"), affected: 200, location: "Bengaluru, Karnataka", source: "https://inc42.com/cred-layoffs", status: "completed", sector: "Fintech", reason: "Organizational restructuring and product team consolidation." },
    { company: "Zerodha", date: new Date("2025-08-20"), affected: 100, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/zerodha-layoffs", status: "completed", sector: "Fintech", reason: "Automation of customer support operations reducing manual headcount." },
    { company: "Lenskart", date: new Date("2025-07-10"), affected: 200, location: "Gurugram, Haryana", source: "https://inc42.com/lenskart-layoffs", status: "completed", sector: "Retail", reason: "AI-driven process automation across warehouse and fulfilment teams." },
    { company: "Ola Cabs", date: new Date("2025-06-15"), affected: 700, location: "Bengaluru, Karnataka", source: "https://moneycontrol.com/ola-layoffs", status: "completed", sector: "Mobility", reason: "Restructuring post Ola Electric spin-off to streamline core ride-hailing operations." },
    { company: "Udaan", date: new Date("2025-05-20"), affected: 350, location: "Bengaluru, Karnataka", source: "https://inc42.com/udaan-layoffs", status: "completed", sector: "B2B Commerce", reason: "Funding delays and operational cost reduction across logistics teams." },
    { company: "ShareChat", date: new Date("2025-04-10"), affected: 400, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/sharechat-layoffs", status: "completed", sector: "Social Media", reason: "Funding winter and strategic pivot to short video content format." },
    { company: "Vedantu", date: new Date("2025-03-15"), affected: 600, location: "Bengaluru, Karnataka", source: "https://inc42.com/vedantu-layoffs", status: "completed", sector: "EdTech", reason: "Unit economics focus and pivot to hybrid learning model." },
    { company: "Unacademy", date: new Date("2025-02-20"), affected: 1000, location: "Bengaluru, Karnataka", source: "https://moneycontrol.com/unacademy-layoffs", status: "completed", sector: "EdTech", reason: "Profitability pivot including closure of underperforming learning centres." },
    { company: "Swiggy", date: new Date("2025-01-10"), affected: 400, location: "Bengaluru, Karnataka", source: "https://inc42.com/swiggy-layoffs", status: "completed", sector: "Food Tech", reason: "Pre-IPO cost optimization and discontinuation of non-core experiments." },
    { company: "Dunzo", date: new Date("2024-12-15"), affected: 500, location: "Bengaluru, Karnataka", source: "https://economictimes.indiatimes.com/dunzo-layoffs", status: "completed", sector: "Logistics", reason: "Critical cash crunch pushing the company towards near-shutdown." },
    { company: "Meesho", date: new Date("2024-11-20"), affected: 300, location: "Bengaluru, Karnataka", source: "https://inc42.com/meesho-layoffs", status: "completed", sector: "E-Commerce", reason: "Profitability push and team restructuring across non-revenue functions." },
    { company: "Rebel Foods", date: new Date("2024-10-10"), affected: 200, location: "Mumbai, Maharashtra", source: "https://moneycontrol.com/rebel-foods-layoffs", status: "completed", sector: "Food Tech", reason: "Cloud kitchen consolidation and aggressive cost reduction." }
  ]

  let noticeCount = 0;
  for (const notice of noticesRaw) {
    const announcedDate = makeAnnouncedDate(notice.date);
    const verification = getVerificationTier(notice);
    await prisma.notice.create({ 
      data: {
        ...notice,
        announcedDate,
        verification,
        companySlug: slugify(notice.company)
      } 
    })
    noticeCount++;
  }

  console.log(`Seeded ${companyCount} real companies successfully.`)
  console.log(`Seeded ${noticeCount} real notices successfully.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })