import { defineConfig } from 'cz-git'

const scopes = [
  'design',
  'blog',
  'home',
  'work',
  'projects',
  'life',
  'now',
  'uses',
  'contact',
  'analytics',
  'integrations',
  'maintenance',
  'seo',
  'deps',
  'ci',
  'docs',
]

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
  rules: { 'scope-enum': [2, 'always', scopes], 'header-max-length': [2, 'always', 100] },
  prompt: { scopes, allowCustomScopes: false, allowEmptyScopes: true },
})
