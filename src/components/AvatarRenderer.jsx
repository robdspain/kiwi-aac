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

    const headSvg = ASSETS.heads[head] || ASSETS.heads.round;
    const eyesSvg = typeof ASSETS.eyes[eyes] === 'function'
        ? ASSETS.eyes[eyes](eyeColor)
        : ASSETS.eyes.happy(eyeColor);
    const mouthSvg = ASSETS.mouths[mouth] || ASSETS.mouths.smile;
    const hairSvg = typeof ASSETS.hair[hair] === 'function' 
        ? ASSETS.hair[hair](hairColor) 
        : ASSETS.hair.short(hairColor);
    const facialHairSvg = ASSETS.facial_hair[facialHair] || '';
    const accessorySvg = ASSETS.accessories[accessory] || '';

    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
        >
            <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                </filter>
            </defs>
            <g filter="url(#shadow)">
                {/* 1. Head Base */}
                <g fill={skin}>
                    <g dangerouslySetInnerHTML={{ __html: headSvg }} />
                </g>

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
