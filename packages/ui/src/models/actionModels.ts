export interface Action {
    id?: string;
    name: string;
    toolTip?: string;
    modalTitle?: string;
    modalDescription: string;
    onClick?: () => void;
    icon: any;
    isDangerous?: boolean;
    noPopUp?: boolean;
}