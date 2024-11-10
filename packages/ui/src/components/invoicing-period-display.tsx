import { CodeBlock, InvoicingPeriod, Org, Select, SelectContent, SelectItem, SelectTrigger } from "..";

interface InvoicingPeriodDisplayProps {
	org: Org;
	onChange?: (selectedPeriod: InvoicingPeriod) => void; // Change the type to InvoicingPeriod
}

export const InvoicingPeriodDisplay: React.FC<InvoicingPeriodDisplayProps> = ({ org, onChange }) => {
	const orgInvoicingPeriod = org?.invoicing_period || InvoicingPeriod.DAILY;

	return (
		<div className="border border-2 border-black rounded-lg bg-primary-cucumber-green p-2 pb-4 h-fit flex flex-col justify-start items-start gap-1">
			<h2 className="font-righteous flex justify-start items-center mb-2 gap-1">
				Invoicing Period: <CodeBlock>{InvoicingPeriod[orgInvoicingPeriod]}</CodeBlock> 
			</h2>
			<Select
				value={orgInvoicingPeriod}
				onValueChange={(selectedPeriod) => {
					if (onChange) {
						onChange(selectedPeriod as InvoicingPeriod); // Cast to InvoicingPeriod
					}
				}}
			>
				<SelectTrigger aria-label='Invoicing Period' disabled={false}>
					{InvoicingPeriod[orgInvoicingPeriod]}
				</SelectTrigger>
				<SelectContent>
					{Object.values(InvoicingPeriod).map((period) => (
						<SelectItem key={period} value={period}>
							{period}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};