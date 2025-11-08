import "server-only"

import { Geo } from "@vercel/edge"
import { Question } from "./types"

export async function getQuestions(location: Geo): Promise<Question[]> {
  "use server"

  const contents: Question[] = [
    // USA
    { content: "Have you considered the H1B visa process?", locations: [{ country: "US" }] },
    { content: "What appeals to you about working in the US?", locations: [{ country: "US" }] },
    { content: "Would you consider working in Silicon Valley?", locations: [{ city: "San%20Francisco" }] },
    { content: "What attracts you to the San Francisco tech scene?", locations: [{ city: "San%20Francisco" }] },
    { content: "Do you need a VISA to work in the US?", locations: [{ country: "US" }] },
    { content: "Would you work in the US?", locations: [{ country: "US" }] },
    { content: "Would you work in San Francisco?", locations: [{ city: "San%20Francisco" }] },
    { content: "Would you trade Norway for Silicon Valley?", locations: [{ city: "San%20Francisco" }] },
    { content: "Are you interested in Bay Area startups?", locations: [{ city: "San%20Francisco" }] },
    { content: "Would you work in Los Angeles?", locations: [{ city: "Los%20Angeles" }] },

    // Norway
    { content: "How do you handle the Norwegian winters?", locations: [{ country: "NO" }] },
    { content: "What makes Norway your chosen country to settle in?", locations: [{ country: "NO" }] },
    { content: "What's your favorite thing about Norway?", locations: [{ country: "NO" }] },
    { content: "How's your Norwegian language progress?", locations: [{ country: "NO" }] },
    { content: "What attracts you most about Norwegian work culture?", locations: [{ country: "NO" }] },
    { content: "What's your Norwegian level?", locations: [{ country: "NO" }] },
    { content: "How do you like Oslo?", locations: [{ city: "Oslo" }] },
    { content: "How was your internship at DNB?", locations: [{ city: "Oslo" }] },
    { content: "Why did you choose DNB again for your internship?", locations: [{ city: "Oslo" }] },
    { content: "What's your favorite part about working at DNB?", locations: [{ city: "Oslo" }] },
    { content: "What's your favorite area in Oslo?", locations: [{ city: "Oslo" }] },
    { content: "How do you find the work-life balance in Oslo?", locations: [{ city: "Oslo" }] },
    { content: "Is Tromsø your dream city?", locations: [{ city: "Tromsø" }] },

    // Sweden
    { content: "What's your Swedish level?", locations: [{ country: "SE" }] },
    { content: "Do you like Sweden so far?", locations: [{ country: "SE" }] },
    { content: "Do you like Sundsvall so far?", locations: [{ city: "Sundsvall" }] },
    { content: "How's Mid Sweden University?", locations: [{ city: "Sundsvall" }] },
    { content: "When can I find you at Brancode Center's rink?", locations: [{ city: "Sundsvall" }] },
    { content: "Are you enjoying Mid Sweden University?", locations: [{ city: "Sundsvall" }] },
    { content: "How's the winter sports in Sundsvall?", locations: [{ city: "Sundsvall" }] },
    { content: "Are you learning Swedish at MIUN?", locations: [{ city: "Sundsvall" }] },
    { content: "What activities do you do in Sundsvall?", locations: [{ city: "Sundsvall" }] },
    { content: "How's your Swedish coming along?", locations: [{ country: "SE" }] },

    // Finland
    { content: "How was your semester in Kokkola?", locations: [{ city: "Kokkola" }] },
    { content: "What did you learn at Centria University?", locations: [{ city: "Kokkola" }] },
    { content: "How was your experience in Finland?", locations: [{ country: "FI" }] },

    // France
    { content: "Did you left France?", locations: [{ country: "FR" }] },
    { content: "Are you from Laval?", locations: [{ city: "Laval" }] },
    { content: "Do you study in Laval?", locations: [{ city: "Laval" }] },
    { content: "Did you enjoy studying at ESIEA in Laval?", locations: [{ city: "Laval" }] },
    { content: "How was growing up in Laval?", locations: [{ city: "Laval" }] },
    { content: "What made you leave France for Nordic countries?", locations: [{ country: "FR" }] },
    { content: "How did ParcourSup lead you to ESIEA?", locations: [{ country: "FR" }] },

    // General
    { content: "Tell me about your studies", locations: [] },
    { content: "What tech do you work with?", locations: [] },
    { content: "What awards have you won?", locations: [] },
    { content: "What certifications do you have?", locations: [] },
    { content: "Where have you interned?", locations: [] },
    { content: "What projects have you done?", locations: [] },
    { content: "What's your tech stack like?", locations: [] },
    { content: "What languages do you speak?", locations: [] },
    { content: "Who's recommended you?", locations: [] },
    { content: "Where are you from originally?", locations: [] },
    { content: "What degree are you going for?", locations: [] },

    // Education & Academic Journey
    { content: "Why did you choose Software Engineering?", locations: [] },
    { content: "How was your integrated master's program?", locations: [] },
    { content: "What motivated you to study abroad?", locations: [] },

    // Technical Skills & Projects
    { content: "What made you interested in TypeScript?", locations: [] },
    { content: "How did you learn frontend development?", locations: [] },
    { content: "What's your favorite project you've built?", locations: [] },
    { content: "How did you get into mobile development?", locations: [] },

    // Personal Development
    { content: "How do you learn new technologies?", locations: [] },
    { content: "How do you stay updated with tech trends?", locations: [] },
    { content: "What's your typical coding workflow?", locations: [] },

    // Career & Future Plans
    { content: "What's your dream role in tech?", locations: [] },
    { content: "Where do you see yourself in 5 years?", locations: [] },
    { content: "What kind of company culture do you prefer?", locations: [] },
    { content: "What's your ideal work environment?", locations: [] },

    // Languages & Communication
    { content: "How do you handle the language barriers?", locations: [] },
    { content: "Which language do you code in most?", locations: [] },

    // Background & Motivation
    { content: "What inspired you to work internationally?", locations: [] },
    { content: "How has your background influenced your career?", locations: [] },
    { content: "What drives you in software development?", locations: [] },
  ]

  const result: Question[] = []

  // Find questions matching the city
  const cityQuestions = contents.filter((q) => q.locations.some((l) => l.city === location.city))

  // Find questions matching the country
  const countryQuestions = contents.filter((q) => q.locations.some((l) => l.country === location.country))

  // Find non-location specific questions
  const generalQuestions = contents.filter((q) => q.locations.length === 0)

  // Add a random city-specific question if available
  if (cityQuestions.length > 0) {
    result.push(cityQuestions[Math.floor(Math.random() * cityQuestions.length)])
  }

  // Add country-specific questions
  if (countryQuestions.length > 0) {
    const remainingCountryQuestions = countryQuestions.filter((q) => !result.includes(q))

    if (remainingCountryQuestions.length > 0) {
      result.push(remainingCountryQuestions[Math.floor(Math.random() * remainingCountryQuestions.length)])
    }
  }

  // Fill remaining slots with general questions
  while (result.length < 4) {
    const remainingGeneralQuestions = generalQuestions.filter((q) => !result.includes(q))
    if (remainingGeneralQuestions.length === 0) break

    result.push(remainingGeneralQuestions[Math.floor(Math.random() * remainingGeneralQuestions.length)])
  }

  // If we still don't have 4 questions, fill with random questions from the entire pool
  while (result.length < 4) {
    const remainingQuestions = contents.filter((q) => !result.includes(q))
    if (remainingQuestions.length === 0) break

    result.push(remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)])
  }

  return result
}
