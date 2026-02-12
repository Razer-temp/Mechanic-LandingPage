// AI Bike Diagnosis Engine — keyword-based diagnostic system

export interface DiagnosisResult {
    title: string;
    causes: string[];
    urgency: 'low' | 'medium' | 'high';
    cost: string;
    tip: string;
}

export interface ConversationResult {
    reply: string;
    isConversational: true;
}

const diagnosisKB: Record<string, DiagnosisResult> = {
    start: {
        title: 'Starting Problem Detected',
        causes: ['Dead or weak battery', 'Faulty spark plug', 'Clogged carburetor/fuel injector', 'Starter motor issue'],
        urgency: 'medium',
        cost: '₹300 – ₹2,500',
        tip: 'Check if your battery is older than 18 months — most starting issues begin there.',
    },
    noise: {
        title: 'Abnormal Engine Noise',
        causes: ['Worn timing chain', 'Loose engine mounting', 'Low engine oil', 'Valve clearance issue'],
        urgency: 'high',
        cost: '₹500 – ₹4,000',
        tip: "Don't ride with unusual engine noise — it can lead to major engine damage.",
    },
    brake: {
        title: 'Brake System Issue',
        causes: ['Worn brake pads', 'Air in brake line', 'Warped brake disc', 'Low brake fluid'],
        urgency: 'high',
        cost: '₹400 – ₹2,000',
        tip: 'Brake issues are safety-critical. Get them inspected immediately.',
    },
    oil: {
        title: 'Oil Leak / Oil Issue',
        causes: ['Worn gasket or seal', 'Loose oil drain plug', 'Cracked engine casing', 'Overfilled oil'],
        urgency: 'medium',
        cost: '₹200 – ₹3,000',
        tip: 'Riding with low oil can cause permanent engine seizure.',
    },
    battery: {
        title: 'Battery / Electrical Problem',
        causes: ['Battery past lifespan', 'Faulty charging system (rectifier/regulator)', 'Corroded terminals', 'Parasitic drain from aftermarket accessories'],
        urgency: 'medium',
        cost: '₹500 – ₹2,500',
        tip: 'A healthy battery should read 12.4V+ when the engine is off.',
    },
    mileage: {
        title: 'Poor Fuel Efficiency',
        causes: ['Dirty air filter', 'Incorrect tire pressure', 'Old spark plug', 'Rich fuel mixture / carburetor issue'],
        urgency: 'low',
        cost: '₹200 – ₹1,500',
        tip: 'Regular servicing every 3,000 km keeps your mileage optimal.',
    },
    vibration: {
        title: 'Excessive Vibration',
        causes: ['Unbalanced wheels', 'Worn chain sprocket', 'Engine mounting loose', 'Bent rim'],
        urgency: 'medium',
        cost: '₹300 – ₹2,000',
        tip: 'Vibrations accelerate wear on many parts — address it early.',
    },
    overheat: {
        title: 'Engine Overheating',
        causes: ['Low coolant (liquid-cooled)', 'Clogged radiator fins', 'Faulty thermostat', 'Old / wrong grade engine oil'],
        urgency: 'high',
        cost: '₹400 – ₹3,500',
        tip: 'Stop riding immediately if the engine is overheating to avoid seizure.',
    },
};

const keywordMap: Record<string, string[]> = {
    start: [
        'start', 'crank', 'ignition', "won't start", "doesn't start", 'dead', 'kick',
        'self not working', 'kickstart hard', 'morning problem', 'cold start',
        'choke', 'battery down', 'pick nahi', 'starting issue', 'starter motor',
        'engine not starting', 'no start', 'difficult to start'
    ],
    noise: [
        'noise', 'sound', 'rattle', 'knock', 'tick', 'clunk', 'grind',
        'dhak dhak', 'tak tak', 'metallic sound', 'chain noise', 'loud',
        'exhaust loud', 'tappet', 'valve noise', 'weird sound', 'strange noise',
        'knocking', 'clicking', 'grinding', 'abnormal sound'
    ],
    brake: [
        'brake', 'stop', 'squeak', 'squeal', 'disc', 'pad',
        'braking', 'stopping', 'brake not working', 'soft brake', 'hard brake',
        'brake fade', 'spongy', 'brake pedal', 'brake lever', 'no brakes'
    ],
    oil: [
        'oil', 'leak', 'drip', 'smoke', 'burning smell',
        'oil leak', 'engine oil', 'leaking', 'oil dripping', 'black smoke',
        'white smoke', 'blue smoke', 'oil consumption', 'low oil'
    ],
    battery: [
        'battery', 'charge', 'electric', 'light dim', 'drain', 'voltage',
        'battery dead', 'charging issue', 'battery not charging', 'weak battery',
        'battery problem', 'electrical problem', 'lights not working', 'horn weak'
    ],
    mileage: [
        'mileage', 'fuel', 'petrol', 'efficiency', 'consumption', 'average',
        'low mileage', 'poor mileage', 'fuel consumption', 'average low',
        'eating fuel', 'too much petrol', 'bad average', 'kmpl'
    ],
    vibration: [
        'vibrat', 'shake', 'wobble', 'shudder',
        'vibration', 'shaking', 'wobbling', 'unstable', 'handlebar shake',
        'seat vibration', 'engine vibration', 'excessive vibration'
    ],
    overheat: [
        'heat', 'hot', 'overheat', 'temperature', 'coolant',
        'overheating', 'too hot', 'engine hot', 'temperature high', 'heating',
        'radiator', 'cooling', 'boiling'
    ],
};

// Brand-specific tips
const brandSpecificIssues: Record<string, Record<string, string>> = {
    'royal enfield': {
        start: 'Classic/Bullet models often face carburetor issues in winter. Try warming it up first.',
        oil: 'RE bikes can leak oil from pushrod tubes—common on older models.',
        noise: 'Tappet noise is normal on older RE models, but get it checked if it\'s excessive.',
    },
    'hero': {
        mileage: 'Hero bikes are known for excellent mileage—check air filter and tire pressure first.',
        start: 'Hero Splendor/Passion: Check the CDI unit if starting is intermittent.',
    },
    'bajaj': {
        noise: 'Pulsar models: Check timing chain tensioner if you hear rattling from the engine.',
        start: 'Bajaj bikes: Ensure the fuel petcock is in the ON position, not RESERVE.',
    },
    'tvs': {
        mileage: 'TVS Apache models: Use manufacturer-recommended octane fuel for best mileage.',
        brake: 'TVS scooters: Check brake shoes if you feel reduced braking power.',
    },
    'honda': {
        start: 'Honda Activa: If self-start isn\'t working, check the fuse near the battery.',
        oil: 'Honda bikes rarely leak oil—if yours does, get it checked immediately.',
    },
    'yamaha': {
        noise: 'Yamaha FZ/R15: Chain noise is common. Lubricate and adjust chain tension.',
    },
    'ktm': {
        overheat: 'KTM Duke models run hot naturally. Ensure you\'re using synthetic engine oil.',
    },
};

// Conversational response handling
export function handleConversation(text: string): ConversationResult | null {
    const lower = text.trim().toLowerCase();

    // Greetings
    if (/^(hi|hello|hey|hii|helo|namaste|namaskar|good morning|good evening|greetings)\b/.test(lower)) {
        return {
            reply: "Hey there! 👋 I'm your SmartBike Pro AI assistant. I can help diagnose bike issues, suggest repairs, and provide cost estimates. Tell me what's troubling your bike!",
            isConversational: true
        };
    }

    // Identity/About questions
    if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('your name')) {
        return {
            reply: "I'm the SmartBike Pro AI Mechanic! 🤖🏍️ I specialize in diagnosing two-wheeler issues for all major Indian brands. Just describe your bike's problem and I'll help identify the cause, urgency level, and estimated repair cost.",
            isConversational: true
        };
    }

    if (lower.includes('what can you do') || lower.includes('how can you help') || lower.includes('how do you work')) {
        return {
            reply: "I can help you with:\n• Diagnosing bike issues (engine, brakes, battery, etc.)\n• Estimating repair costs in ₹\n• Providing maintenance tips\n• Brand-specific advice (Hero, Honda, Bajaj, RE, TVS, etc.)\n• Seasonal tips (monsoon, winter)\n\nJust tell me what's wrong with your bike and I'll guide you! 💡",
            isConversational: true
        };
    }

    // Thanks/appreciation
    if (/(thank|thanks|thx|thanku|appreciated|helpful|great|awesome|nice|good)/.test(lower) && lower.length < 30) {
        return {
            reply: "You're welcome! 😊 If you have any other bike issues or need help booking a service, just let me know. Stay safe on the road! 🏍️",
            isConversational: true
        };
    }

    // Service/pricing inquiries
    if ((lower.includes('service') || lower.includes('servicing')) && (lower.includes('cost') || lower.includes('price') || lower.includes('charge'))) {
        return {
            reply: "Our service packages start from ₹699 for basic servicing! We offer:\n• General Service: ₹699-₹1,699\n• Engine Work: ₹1,500-₹5,500\n• Brake Service: ₹400-₹1,500\n• Full Diagnostic: ₹199\n\nExact pricing depends on your bike type and issue. Want to book a service? Just scroll up to the booking section! 📅",
            isConversational: true
        };
    }

    if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
        return {
            reply: "To book a service, just scroll up to the 'Book Service' section on this page! 📅 You can also call us directly at +91 98115 30780. We're here 9 AM - 7 PM daily!",
            isConversational: true
        };
    }

    // General advice
    if (lower.includes('maintenance') || lower.includes('care') || (lower.includes('keep') && lower.includes('good'))) {
        return {
            reply: "🔧 Top maintenance tips:\n• Service every 3,000 km or 3 months\n• Check tire pressure weekly (maintain 28-32 PSI)\n• Change engine oil every 3,000-5,000 km\n• Clean air filter monthly\n• Lubricate chain every 500 km\n• Check brake pads every service\n\nRegular care = Better mileage + Longer life! 💪",
            isConversational: true
        };
    }

    // Default - not a conversation, might be diagnostic
    return null;
}

export function diagnose(text: string): DiagnosisResult | null {
    const lower = text.toLowerCase();
    const matches: string[] = [];

    // Find ALL matching categories
    for (const [key, words] of Object.entries(keywordMap)) {
        for (const word of words) {
            if (lower.includes(word)) {
                matches.push(key);
                break; // Move to next category
            }
        }
    }

    let result: DiagnosisResult | null = null;

    // If multiple matches, prioritize by urgency
    if (matches.length > 1) {
        const sorted = matches.sort((a, b) => {
            const urgencyOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
            return urgencyOrder[diagnosisKB[b].urgency] - urgencyOrder[diagnosisKB[a].urgency];
        });
        result = { ...diagnosisKB[sorted[0]] }; // Clone to avoid mutation
    } else if (matches.length === 1) {
        result = { ...diagnosisKB[matches[0]] };
    }

    // Apply brand-specific tips if brand mentioned
    if (result) {
        const brandMentioned = Object.keys(brandSpecificIssues).find(brand =>
            lower.includes(brand.replace(' ', ''))
        );
        if (brandMentioned) {
            const specificTip = brandSpecificIssues[brandMentioned][matches[0]];
            if (specificTip) result.tip = `🏍️ ${specificTip}`;
        }

        // Apply seasonal/weather context
        if (lower.includes('rain') || lower.includes('monsoon')) {
            if (matches[0] === 'start') {
                result.tip = '🌧️ Monsoon tip: Moisture in spark plug is common. Let it dry or replace it.';
            }
            if (matches[0] === 'brake') {
                result.tip = '🌧️ Wet brakes reduce stopping power. Pump brakes gently to dry them out.';
            }
        }

        if (lower.includes('winter') || lower.includes('cold') || lower.includes('morning')) {
            if (matches[0] === 'start') {
                result.tip = '❄️ Cold start issues: Use choke and give 2-3 kicks before trying self-start.';
            }
        }

        // Severity detection - upgrade urgency
        const criticalWords = ['can\'t ride', 'dangerous', 'accident', 'stopped suddenly', 'completely stopped'];
        if (criticalWords.some(word => lower.includes(word))) {
            result.urgency = 'high';
            result.tip = '🚨 URGENT: This sounds serious. Stop riding and get it checked immediately!';
        }
    }

    // Smarter fallback - extract hints even when no exact match
    if (!result) {
        // Cold/morning issues
        if (lower.includes('morning') || lower.includes('cold')) {
            return {
                title: 'Possible Cold Start Issue',
                causes: ['Battery weak in cold weather', 'Choke needed', 'Old/thick engine oil'],
                urgency: 'medium',
                cost: '₹300 – ₹1,500',
                tip: '❄️ Cold weather affects batteries and fuel mix. Try using choke and warm up the engine.',
            };
        }

        // Performance issues
        if (lower.includes('slow') || lower.includes('pickup') || lower.includes('power')) {
            return {
                title: 'Performance/Pickup Issue',
                causes: ['Air filter clogged', 'Carburetor needs tuning', 'Clutch slipping', 'Old spark plug'],
                urgency: 'low',
                cost: '₹200 – ₹2,000',
                tip: '⚡ Performance drops are usually maintenance-related. Service your bike regularly.',
            };
        }

        // Smoking issues
        if (lower.includes('smok') || lower.includes('fume')) {
            return {
                title: 'Engine Smoking Issue',
                causes: ['Oil leak into combustion chamber', 'Worn piston rings', 'Valve seal damage'],
                urgency: 'high',
                cost: '₹1,500 – ₹8,000',
                tip: 'Smoking is a sign of internal engine wear. Get it diagnosed before major damage occurs.',
            };
        }
    }

    return result;
}

// AI Cost Estimator
type BikeType = 'scooter' | 'commuter' | 'sport' | 'cruiser' | 'electric';
type ServiceType = 'general' | 'engine' | 'brake' | 'oil' | 'electrical' | 'emergency';

const costMatrix: Record<BikeType, Record<ServiceType, [number, number]>> = {
    scooter: { general: [699, 1499], engine: [1200, 4500], brake: [400, 1200], oil: [300, 600], electrical: [350, 1500], emergency: [299, 1000] },
    commuter: { general: [799, 1699], engine: [1500, 5500], brake: [500, 1500], oil: [350, 700], electrical: [400, 1800], emergency: [299, 1200] },
    sport: { general: [1299, 2999], engine: [2500, 10000], brake: [800, 2500], oil: [500, 1200], electrical: [600, 3000], emergency: [499, 2000] },
    cruiser: { general: [1499, 3499], engine: [3000, 12000], brake: [800, 2800], oil: [600, 1500], electrical: [700, 3500], emergency: [599, 2500] },
    electric: { general: [999, 2499], engine: [2000, 8000], brake: [500, 1800], oil: [0, 0], electrical: [800, 4000], emergency: [399, 1800] },
};

export interface CostEstimate {
    min: number;
    max: number;
    note: string;
}

export function estimateCost(bikeType: string, serviceType: string): CostEstimate | null {
    const range = costMatrix[bikeType as BikeType]?.[serviceType as ServiceType];
    if (!range) return null;
    if (range[0] === 0 && range[1] === 0) {
        return { min: 0, max: 0, note: "Electric bikes don't require oil changes!" };
    }
    return {
        min: range[0],
        max: range[1],
        note: `Estimated for ${bikeType} • ${serviceType} service. Final cost confirmed after inspection.`,
    };
}
