import React from 'react';

export const CubeLoader = () => {
    const cubeSpanStyle = (i: number): React.CSSProperties => ({
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: `rotateY(calc(90deg * ${i})) translateZ(37.5px)`,
        background: 'url(https://res.cloudinary.com/dzmqies6h/image/upload/v1707246506/branding/CF_LOGO_GREEN_wghhgy.png) center/cover no-repeat' ,
    });

    const cubeTopStyle: React.CSSProperties = {
        position: 'absolute',
        width: '75px',
        height: '75px',
        background: 'url(https://res.cloudinary.com/dzmqies6h/image/upload/v1707246506/branding/CF_LOGO_GREEN_wghhgy.png) center/cover no-repeat',
        transform: 'rotateX(90deg) translateZ(37.5px)',
        transformStyle: 'preserve-3d',
    };

    const cubeTopBeforeStyle: React.CSSProperties = {
        content: "''",
        position: 'absolute',
        width: '75px',
        height: '75px',
        background: 'url(https://res.cloudinary.com/dzmqies6h/image/upload/v1707246506/branding/CF_LOGO_GREEN_wghhgy.png) center/cover no-repeat',
        transform: 'translateZ(-90px)',
        filter: 'blur(10px)',
        boxShadow: '0 0 10px hsl(40, 30%, 98%), 0 0 20px hsl(164, 32%, 51%), 0 0 30px hsl(40, 30%, 98%), 0 0 40px hsl(164, 32%, 51%)',
    };

    return (
        <div style={{ position: 'relative', width: '75px', height: '75px', transformStyle: 'preserve-3d', transform: 'rotateX(-30deg)', animation: 'animate 4s linear infinite' }} className="cube-loader">
            <style>
                {`
                @keyframes animate {
                    0% {
                        transform: rotateX(-30deg) rotateY(0);
                    }
                    100% {
                        transform: rotateX(-30deg) rotateY(360deg);
                    }
                }
                `}
            </style>
            <div style={{ position: 'absolute', width: '100%', height: '100%', transformStyle: 'preserve-3d' }} className="cube-wrapper">
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={cubeSpanStyle(i)} className="cube-span" />
                ))}
            </div>
            <div style={cubeTopStyle} className="cube-top">
                <div style={cubeTopBeforeStyle}></div>
            </div>
        </div>
    );
};

