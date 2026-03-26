import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.notice.deleteMany({})

  const notices = [
    { company: "Tata Consultancy Services (TCS)", date: new Date("2025-07-10"), affected: 12000, location: "Mumbai, Maharashtra", source: "https://www.zeebiz.com/companies/news-tcs-headcount-it-giant-sees-sharp-employee-exit-in-q3-fy26-heres-latest-data-387684", status: "completed" },
    { company: "Amazon India", date: new Date("2026-01-29"), affected: 16000, location: "Bengaluru, Karnataka", source: "https://www.businesstoday.in/technology/story/tech-layoffs-top-40000-in-first-3-months-of-2026-as-firms-reshape-workforces-for-ai-520791-2026-03-16", status: "in_progress" },
    { company: "Byju's (Think & Learn)", date: new Date("2025-04-30"), affected: 4500, location: "Bengaluru, Karnataka", source: "https://techcrunch.com/2025/12/22/tech-layoffs-2025-list/", status: "completed" },
    { company: "Tech Mahindra", date: new Date("2025-12-31"), affected: 3098, location: "Pune, Maharashtra", source: "https://analyticsindiamag.com/it-services/indian-it-is-laying-off-employees-and-calling-it-restructuring/", status: "completed" },
    { company: "Wipro", date: new Date("2025-01-31"), affected: 3000, location: "Bengaluru, Karnataka", source: "https://www.storyboard18.com/how-it-works/tcs-infosys-wipro-and-hcl-tech-headcount-reduces-by-over-42000-in-two-years-77264.htm", status: "completed" },
    { company: "Ola Electric", date: new Date("2026-02-28"), affected: 500, location: "Bengaluru, Karnataka", source: "https://www.thepeoplesboard.com/career-path/thepeoplesboard-layoff-tracker-india-2026-edition/", status: "completed" },
    { company: "Livspace", date: new Date("2026-03-20"), affected: 1000, location: "Bengaluru, Karnataka", source: "https://www.thepeoplesboard.com/career-path/thepeoplesboard-layoff-tracker-india-2026-edition/", status: "in_progress" },
    { company: "Paytm (One97 Communications)", date: new Date("2025-07-15"), affected: 1000, location: "Noida, Uttar Pradesh", source: "https://techcrunch.com/2025/12/22/tech-layoffs-2025-list/", status: "completed" },
    { company: "Infosys", date: new Date("2026-05-15"), affected: 4000, location: "Bengaluru, Karnataka", source: "https://www.zeebiz.com/companies/news-what-hcl-tcs-infosys-wipro-tech-mahindra-q2-results-says-about-it-jobs-and-layoff-trends-explained-381136", status: "upcoming" },
    { company: "Gupshup", date: new Date("2025-10-15"), affected: 500, location: "Mumbai, Maharashtra", source: "https://www.thepeoplesboard.com/career-path/thepeoplesboard-layoff-tracker-india-2026-edition/", status: "completed" },
  ]

  for (const notice of notices) {
    await prisma.notice.create({ data: notice })
  }

  console.log(`Seeded ${notices.length} real notices successfully.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })