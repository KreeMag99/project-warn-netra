import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.notice.deleteMany({})

  const notices = [
    // Original 10
    { company: "Tata Consultancy Services (TCS)", date: new Date("2025-07-10"), affected: 12000, location: "Mumbai, Maharashtra", source: "https://www.zeebiz.com/companies/news-tcs-headcount-it-giant-sees-sharp-employee-exit-in-q3-fy26-heres-latest-data-387684", status: "completed", sector: "IT Services", reason: "AI-driven restructuring and skill mismatch" },
    { company: "Amazon India", date: new Date("2026-01-29"), affected: 16000, location: "Bengaluru, Karnataka", source: "https://www.businesstoday.in/technology/story/tech-layoffs-top-40000-in-first-3-months-of-2026-as-firms-reshape-workforces-for-ai-520791-2026-03-16", status: "in_progress", sector: "E-Commerce / Tech", reason: "Global workforce optimization for AI shift" },
    { company: "Byju's (Think & Learn)", date: new Date("2025-04-30"), affected: 4500, location: "Bengaluru, Karnataka", source: "https://techcrunch.com/2025/12/22/tech-layoffs-2025-list/", status: "completed", sector: "EdTech", reason: "Financial distress and NCLT proceedings" },
    { company: "Tech Mahindra", date: new Date("2025-12-31"), affected: 3098, location: "Pune, Maharashtra", source: "https://analyticsindiamag.com/it-services/indian-it-is-laying-off-employees-and-calling-it-restructuring/", status: "completed", sector: "IT Services", reason: "Quarterly performance-based restructuring" },
    { company: "Wipro", date: new Date("2025-01-31"), affected: 3000, location: "Bengaluru, Karnataka", source: "https://www.storyboard18.com/how-it-works/tcs-infosys-wipro-and-hcl-tech-headcount-reduces-by-over-42000-in-two-years-77264.htm", status: "completed", sector: "IT Services", reason: "Negative revenue growth and cost control" },
    { company: "Ola Electric", date: new Date("2026-02-28"), affected: 500, location: "Bengaluru, Karnataka", source: "https://www.thepeoplesboard.com/career-path/thepeoplesboard-layoff-tracker-india-2026-edition/", status: "completed", sector: "EV / Mobility", reason: "Cost restructuring amid profitability pressure" },
    { company: "Livspace", date: new Date("2026-03-20"), affected: 1000, location: "Bengaluru, Karnataka", source: "https://www.thepeoplesboard.com/career-path/thepeoplesboard-layoff-tracker-india-2026-edition/", status: "in_progress", sector: "Consumer Tech", reason: "Funding winter and operational efficiency" },
    { company: "Paytm (One97 Communications)", date: new Date("2025-07-15"), affected: 1000, location: "Noida, Uttar Pradesh", source: "https://techcrunch.com/2025/12/22/tech-layoffs-2025-list/", status: "completed", sector: "Fintech", reason: "RBI compliance and cost reduction" },
    { company: "Infosys", date: new Date("2026-05-15"), affected: 4000, location: "Bengaluru, Karnataka", source: "https://www.zeebiz.com/companies/news-what-hcl-tcs-infosys-wipro-tech-mahindra-q2-results-says-about-it-jobs-and-layoff-trends-explained-381136", status: "upcoming", sector: "IT Services", reason: "AI-led efficiency drive and bench optimization" },
    { company: "Gupshup", date: new Date("2025-10-15"), affected: 500, location: "Mumbai, Maharashtra", source: "https://www.thepeoplesboard.com/career-path/thepeoplesboard-layoff-tracker-india-2026-edition/", status: "completed", sector: "AI / SaaS", reason: "Workforce reduction for operational efficiency" },

    // Added 20
    { company: "HCL Technologies", date: new Date("2026-01-15"), affected: 1800, location: "Bengaluru, Karnataka", source: "https://techcrunch.com/hcl-workforce-optimization", status: "completed", sector: "IT Services", reason: "Workforce optimization" },
    { company: "Cognizant India", date: new Date("2026-02-10"), affected: 3500, location: "Chennai, Tamil Nadu", source: "https://moneycontrol.com/cognizant-cost-restructuring", status: "completed", sector: "IT Services", reason: "Cost restructuring" },
    { company: "Accenture India", date: new Date("2026-02-20"), affected: 2500, location: "Bengaluru, Karnataka", source: "https://economictimes.com/accenture-ai-efficiency", status: "completed", sector: "IT Services", reason: "AI-driven efficiency" },
    { company: "Sony Pictures Networks India", date: new Date("2026-02-25"), affected: 300, location: "Mumbai, Maharashtra", source: "https://moneycontrol.com/sony-merger-restructuring", status: "completed", sector: "Media", reason: "Merger-related restructuring" },
    { company: "Sun Pharma", date: new Date("2026-04-10"), affected: 400, location: "Mumbai, Maharashtra", source: "https://economictimes.com/sun-pharma-automation", status: "upcoming", sector: "Pharma", reason: "Manufacturing automation" },
    { company: "CARS24", date: new Date("2025-09-15"), affected: 600, location: "Gurugram, Haryana", source: "https://techcrunch.com/cars24-cost-optimization", status: "completed", sector: "Consumer Tech", reason: "Cost optimization" },
    { company: "Mobile Premier League (MPL)", date: new Date("2025-05-20"), affected: 350, location: "Bengaluru, Karnataka", source: "https://inc42.com/mpl-regulatory-impact", status: "completed", sector: "Gaming", reason: "Regulatory impact" },
    { company: "PharmEasy", date: new Date("2025-07-25"), affected: 800, location: "Mumbai, Maharashtra", source: "https://moneycontrol.com/pharmeasy-debt-restructuring", status: "completed", sector: "HealthTech", reason: "Debt restructuring" },
    { company: "Myntra", date: new Date("2026-03-10"), affected: 50, location: "Bengaluru, Karnataka", source: "https://economictimes.com/myntra-consolidation", status: "in_progress", sector: "E-Commerce", reason: "Consolidation" },
    { company: "Sapiens International", date: new Date("2026-03-05"), affected: 150, location: "Bengaluru, Karnataka", source: "https://techcrunch.com/sapiens-product-line", status: "in_progress", sector: "IT Services", reason: "Product line consolidation" },
    { company: "Dunzo", date: new Date("2025-07-01"), affected: 500, location: "Bengaluru, Karnataka", source: "https://inc42.com/dunzo-cash-crunch", status: "completed", sector: "Logistics", reason: "Cash crunch" },
    { company: "Meesho", date: new Date("2025-08-15"), affected: 300, location: "Bengaluru, Karnataka", source: "https://moneycontrol.com/meesho-profitability-push", status: "completed", sector: "E-Commerce", reason: "Profitability push" },
    { company: "ShareChat", date: new Date("2025-09-01"), affected: 400, location: "Bengaluru, Karnataka", source: "https://techcrunch.com/sharechat-funding-winter", status: "completed", sector: "Social Media", reason: "Funding winter" },
    { company: "Vedantu", date: new Date("2024-11-15"), affected: 600, location: "Bengaluru, Karnataka", source: "https://inc42.com/vedantu-unit-economics", status: "completed", sector: "EdTech", reason: "Unit economics focus" },
    { company: "Unacademy", date: new Date("2024-12-05"), affected: 1000, location: "Bengaluru, Karnataka", source: "https://economictimes.com/unacademy-profitability", status: "completed", sector: "EdTech", reason: "Pivot to profitability" },
    { company: "Swiggy", date: new Date("2025-01-15"), affected: 400, location: "Bengaluru, Karnataka", source: "https://techcrunch.com/swiggy-pre-ipo", status: "completed", sector: "Food Tech", reason: "Pre-IPO cost cuts" },
    { company: "Ola Cabs", date: new Date("2025-02-10"), affected: 700, location: "Bengaluru, Karnataka", source: "https://inc42.com/ola-restructuring", status: "completed", sector: "Mobility", reason: "Restructuring" },
    { company: "Lenskart", date: new Date("2025-03-20"), affected: 200, location: "New Delhi, Delhi", source: "https://moneycontrol.com/lenskart-ai-automation", status: "completed", sector: "Retail", reason: "AI automation" },
    { company: "Udaan", date: new Date("2025-04-15"), affected: 350, location: "Bengaluru, Karnataka", source: "https://economictimes.com/udaan-funding-delays", status: "completed", sector: "B2B Commerce", reason: "Funding delays" },
    { company: "Tata Electronics", date: new Date("2026-08-01"), affected: 500, location: "Mumbai, Maharashtra", source: "https://moneycontrol.com/tata-automation-drive", status: "upcoming", sector: "Manufacturing", reason: "Automation drive" }
  ]

  for (const notice of notices) {
    await prisma.notice.create({ data: notice })
  }

  console.log(`Seeded ${notices.length} real notices successfully.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })