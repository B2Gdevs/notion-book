import { BudgetFrequency, BudgetType, Org, OrgGroup, OrgType } from '../models/orgModels';

// Helper function to determine the color of the org type tag
export const getOrgTypeTagColor = (orgType?: string) => {
	switch (orgType) {
		case OrgType.RESTAURANT:
			return 'bg-yellow-500 text-white'; // replace with your desired color
		case OrgType.RECIPIENT:
			return 'bg-green-500 text-white'; // replace with your desired color
		// add other org types and colors here
		default:
			return 'bg-gray-300 text-gray-700';
	}
};

export const defaultOrg = {
	id: null,
	external_id: null,
	name: '',
	logo_url: '',
	brand_image_url: '',
	description: '',
	budget: {
		id: '',
		name: 'default',
		amount: 0,
		type: BudgetType.RECURRING,
		frequency: BudgetFrequency.DAILY,
		userIds: [],
	},
	// ... other default values
	deal: {
		colorfull_percentage: 0.25,
	},
	distribution_list: {},
} as Org;

export const defaultOrgGroup = {
	id: '',
	name: '',
	org_ids: [],
} as OrgGroup;