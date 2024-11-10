'use client';

import { FC, useState } from 'react';

interface TextBoxProps {
	maxChars?: number;
	text?: string;
	headerText?: string;
	onTextChange?: (value: string) => void; // New prop to handle text change
	disabled?: boolean;
	placeholderText?: string;
}

export const TextBox: FC<TextBoxProps> = ({
	maxChars = 100,
	text,
	headerText = 'Enter Text',
	onTextChange,
	disabled = false,
	placeholderText = 'Type here...',
}: TextBoxProps) => {
	const [content, setContent] = useState(text ?? '');

	const handleContentChange = (value: string) => {
		setContent(value);
		if (onTextChange) {
			onTextChange(value);
		}
	};

	return (
		<div className='w-full flex flex-col p-2 gap-2 items-center justify-center'>
			<div className="w-full  text-primary-spinach-green left-5 font-righteous">
				{headerText}
			</div>
			<textarea
				className="w-full rounded-2xl border border-primary-spinach-green h-32 p-2 overflow-y-auto no-scrollbar resize-none font-sans"
				placeholder={placeholderText}
				value={content}
				onChange={(e) => {
					if (e.target.value.length <= maxChars) {
						handleContentChange(e.target.value);
					}
				}}
				disabled={disabled}
			/>
			<div className="text-xs self-end text-primary-spinach-green font-sans ">
				{content.length}/{maxChars}
			</div>
		</div>
	);
};