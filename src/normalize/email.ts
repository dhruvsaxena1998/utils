type Providers = 'gmail.com' | 'googlemail.com' | 'live.com' | 'hotmail.com' | 'outlook.com';

type ProviderOption = {
  cut: RegExp;
  alias?: Providers;
};

const PATTERN = {
  PLUS: /\+.*$/g,
  PLUS_AND_DOT: /\.|\+.*$/g,
};

const providers: Record<Providers, ProviderOption> = {
  'gmail.com': {
    cut: PATTERN.PLUS_AND_DOT,
  },
  'googlemail.com': {
    cut: PATTERN.PLUS_AND_DOT,
    alias: 'gmail.com',
  },
  'live.com': {
    cut: PATTERN.PLUS_AND_DOT,
  },
  'hotmail.com': {
    cut: PATTERN.PLUS,
  },
  'outlook.com': {
    cut: PATTERN.PLUS,
  },
};

/**
 *
 * @description
 * Normalize email address (remove + and . from email address)
 *
 * <br />
 *
 * ```ts
 *  import { normalizeEmail } from 'utils/normalize/email';
 *
 *  // email    - string
 *  // custom   - boolean (default: false)       - if true, normalize custom domain email address
 *  // pattern  - Regexp  (default: /\.|\+.*$/g) - custom regex pattern to normalize email addres
 *
 *   normalizeEmail(email)
 *   normalizeEmail(email, true)
 *   normalizeEmail(email, true, /\.*$/g)
 *  ```
 */
export const normalizeEmail = (email: string, custom = false, pattern = PATTERN.PLUS_AND_DOT) => {
  if (typeof email !== 'string') {
    throw new TypeError('normalize-email: Email should be typeof string');
  }

  const mail = email.toLowerCase();

  const emailParts = mail.split(/@/);
  if (emailParts.length !== 2) {
    throw new TypeError('normalize-email: Email validation error');
  }

  let [username, domain] = emailParts as [string, Providers];

  if (Object.keys(providers).includes(domain)) {
    const provider = providers[domain];
    username = username.replace(provider.cut, '');
    domain = provider.alias ? provider.alias : domain;
  } else if (custom) {
    username = username.replace(pattern, '');
  }

  return `${username}@${domain}`;
};
