type ProviderKeys = 'gmail.com' | 'googlemail.com' | 'live.com' | 'hotmail.com' | 'outlook.com'

type Providers = Record<ProviderKeys, Provider>

type Provider = {
    cut: RegExp;
    alias?: ProviderKeys;
}

const PATTERN = {
    PLUS: /\+.*$/g,
    PLUS_AND_DOT: /\.|\+.*$/g
}

const providers: Providers = {
    'gmail.com': {
        cut: PATTERN.PLUS_AND_DOT
    },
    'googlemail.com': {
        cut: PATTERN.PLUS_AND_DOT,
        alias: 'gmail.com'
    },
    'live.com': {
        cut: PATTERN.PLUS_AND_DOT,
    },
    'hotmail.com': {
        cut: PATTERN.PLUS
    },
    'outlook.com': {
        cut: PATTERN.PLUS
    }
}

const normalizeEmail = (email: string, custom = false, pattern = PATTERN.PLUS_AND_DOT) => {
    if (typeof email !== 'string') {
        throw new TypeError('normalize-email: Email should be typeof string')
    }

    const mail = email.toLowerCase()

    const emailParts = mail.split(/@/)
    if (emailParts.length !== 2) {
        throw new TypeError('normalize-email: Email validation error')
    }

    let username = emailParts[0] as string
    let domain = emailParts[1] as ProviderKeys

    if (Object.keys(providers).includes(domain)) {
        const provider = providers[domain]
        username = username.replace(provider.cut, '')
        domain = provider.alias ? provider.alias : domain
    } else {
        if (custom) {
            username = username.replace(pattern, '')
        }
    }

    return username + '@' + domain
}