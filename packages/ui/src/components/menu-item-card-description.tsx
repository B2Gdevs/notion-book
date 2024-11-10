interface DescriptionProps {
    className?: string;
    layout?: 'vertical' | 'horizontal';
    description: string;
}

export const MenuItemCardDescription: React.FC<DescriptionProps> = ({ className, layout, description }) => {
    const upperCaseFirstLetterDescription = description.charAt(0).toUpperCase() + description.slice(1);
    const truncateDescription = (desc: string) =>
        desc.length > 140 ? `${desc.substring(0, 140)}...` : desc;

    return (
        <div className={className}>
            <div
                className={`${layout === 'vertical'
                    ? 'text-primary-off-white'
                    : 'text-primary-almost-black'
                    } text-sm font-sans leading-tight`}
            >
                {truncateDescription(upperCaseFirstLetterDescription ?? '')}
            </div>
        </div>
    );
};