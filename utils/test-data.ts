export const ROUTES = {
  home:     '/',
  games:    '/igri',
  top:      '/top',
  news:     '/novini',
  login:    '/login',
  profile:  '/profil',
  contact:  '/kontakti',
  gdpr:     '/gdpr',
} as const;

export const TEST_GAMES = {
  popular:     'Catan',
  nonexistent: 'xyzxyz987abc_notreal',
} as const;

export const NAV_LINKS = {
  games:     'Игри',
  top:       'Топ 100',
  news:      'Новини',
  community: 'Общност',
} as const;

export const TOP_CATEGORIES = [
  'Стратегически',
  'Тематични',
  'Семейни',
  'Парти',
  'Абстрактни',
  'Кооперативни',
] as const;
