
import { ASSETS, HAIR_COLORS } from '../utils/avatarAssets';

const AvatarRenderer = ({ recipe, size = 100 }) => {
    const { 
        head = 'round', 
        skin = '#F1C27D', 
        hair = 'short', 
        hairColor = '#4B2C20', 
        eyeColor = '#333333',
        facialHair = 'none', 
        eyes = 'happy', 
        mouth = 'smile',
        accessory = 'none' 
    } = recipe;

    // Get Hair Highlight
    const hairDef = HAIR_COLORS.find(c => c.color === hairColor) || HAIR_COLORS[1];
    const hairHighlight = hairDef.highlight;

    const headSvg = (ASSETS.heads[head] || ASSETS.heads.round)(skin);
    const eyesSvg = typeof ASSETS.eyes[eyes] === 'function'
        ? ASSETS.eyes[eyes](eyeColor)
        : ASSETS.eyes.happy(eyeColor);
    const mouthSvg = ASSETS.mouths[mouth] || ASSETS.mouths.smile;
    const hairSvg = typeof ASSETS.hair[hair] === 'function' 
        ? ASSETS.hair[hair](hairColor, hairHighlight) 
        : ASSETS.hair.short(hairColor, hairHighlight);
    const facialHairSvg = ASSETS.facial_hair[facialHair] || '';
    const accessorySvg = ASSETS.accessories[accessory] || '';

    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', pointerEvents: 'none' }}
        >
            <defs>
                <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={skin} />
                    <stop offset="100%" stopColor={skin} stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="faceShadow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="80%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                </radialGradient>
                <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={hairColor} />
                    <stop offset="100%" stopColor={hairColor} stopOpacity="0.9" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15"/>
                </filter>
            </defs>
            <g filter="url(#shadow)">
                {/* 1. Head Base */}
                <g dangerouslySetInnerHTML={{ __html: headSvg }} />

                {/* 2. Eyes */}
                <g dangerouslySetInnerHTML={{ __html: eyesSvg }} />

                {/* 3. Mouth */}
                <g dangerouslySetInnerHTML={{ __html: mouthSvg }} />

                {/* 4. Hair */}
                <g dangerouslySetInnerHTML={{ __html: hairSvg }} />

                {/* 5. Facial Hair */}
                <g dangerouslySetInnerHTML={{ __html: facialHairSvg }} />

                {/* 6. Accessories */}
                <g dangerouslySetInnerHTML={{ __html: accessorySvg }} />
            </g>
        </svg>
    );
};

export default AvatarRenderer;
