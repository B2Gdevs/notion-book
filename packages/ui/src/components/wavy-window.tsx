import { WavyBackground } from "./aceternity-ui/wavy-background";

interface WavyWindowProps {
    mainText: string;
    subText: string;
}

export const WavyWindow: React.FC<WavyWindowProps> = ({ mainText, subText }) => {
    return (
        <WavyBackground
            waveWidth={50}
            colors={['#2b2b2b', 'black', '#1a1a1a', '#0d0d0d', '#000000', '#314844']}
            speed='slow'
            containerClassName='flex text-center items-center justify-center rounded-lg mt-2 h-1/2 border-2 border-black'
            backgroundFill='bg-primary-off-white'>
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-2xl md:text-4xl lg:text-7xl text-white font-righteous inter-var text-center">
                    {mainText}
                </p>
                <p className="text-base md:text-lg mt-4 text-secondary-pink-salmon font-righteous inter-var text-center">
                    {subText}
                </p>
            </div>
        </WavyBackground>
    );
}
