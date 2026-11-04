import type { Certification } from '@/lib/content/schemas'

// From Francis's LinkedIn "Licenses & Certifications". The homepage shows the newest six; /work shows all.
export const certifications: Certification[] = [
  { name: 'Introduction to Subagents', issuer: 'Anthropic', year: 2026 },
  { name: 'Introduction to Agent Skills', issuer: 'Anthropic', year: 2026 },
  { name: 'Software Architecture: Domain-Driven Design', issuer: 'LinkedIn Learning', year: 2026 },
  { name: 'Hands-On AI: Implementing Agentic Systems', issuer: 'LinkedIn Learning', year: 2026 },
  {
    name: 'ChatGPT: Crafting Exceptional GPTs for Enhanced Productivity and Innovation',
    issuer: 'LinkedIn Learning',
    year: 2026,
  },
  { name: 'AWS for Developers: DynamoDB', issuer: 'LinkedIn Learning', year: 2025 },
  { name: 'Start Writing Prompts like a Pro', issuer: 'Google', year: 2025 },
  {
    name: 'Building with Google Gemini Advanced and Ultra',
    issuer: 'LinkedIn Learning',
    year: 2025,
  },
  {
    name: 'Automate and Innovate with ChatGPT AI Agents and Zapier',
    issuer: 'LinkedIn Learning',
    year: 2025,
  },
  { name: 'Chief Technology Officer Career Guide', issuer: 'LinkedIn Learning', year: 2023 },
  {
    name: 'Software Design: From Requirements to Release',
    issuer: 'LinkedIn Learning',
    year: 2023,
  },
  { name: 'C# Developers: Learn The Art of Writing Clean Code', issuer: 'Udemy', year: 2017 },
  { name: 'Basics of Scrum, Agile, and Project Delivery', issuer: 'Udemy', year: 2017 },
  { name: 'Programming in Microsoft C# - Exam Ref 70-483', issuer: 'Udemy', year: 2017 },
]
