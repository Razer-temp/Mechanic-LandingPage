// AI Bike Diagnosis Engine — keyword-based diagnostic system

export interface DiagnosisResult {
    title: string;
    causes: string[];
    urgency: 'low' | 'medium' | 'high';
    cost: string;
    tip: string;
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
    start: ['start', 'crank', 'ignition', "won't start", 'dead', 'kick'],
    noise: ['noise', 'sound', 'rattle', 'knock', 'tick', 'clunk', 'grind'],
    brake: ['brake', 'stop', 'squeak', 'squeal', 'disc', 'pad'],
    oil: ['oil', 'leak', 'drip', 'smoke', 'burning smell'],
    battery: ['battery', 'charge', 'electric', 'light dim', 'drain', 'voltage'],
    mileage: ['mileage', 'fuel', 'petrol', 'efficiency', 'consumption', 'average'],
    vibration: ['vibrat', 'shake', 'wobble', 'shudder'],
    overheat: ['heat', 'hot', 'overheat', 'temperature', 'coolant'],
};

export function diagnose(text: string): DiagnosisResult | null {
    const lower = text.toLowerCase();
    for (const [key, words] of Object.entries(keywordMap)) {
        for (const word of words) {
            if (lower.includes(word)) return diagnosisKB[key];
        }
    }
    return null;
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
