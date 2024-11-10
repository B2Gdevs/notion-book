// A modified version of the setNestedValue function that ensures type safety
export function setNestedValue<T>(obj: T, path: string, value: any): T {
    const keys = path.split('.');
    let current: any = obj; // Temporarily treat as any for nested assignment
    for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return obj;
}

// Making handleInputChange generic
export function handleInputChange<T>(e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<T>>) {
    const { name, value } = e.target;
    setState((prev: T) => setNestedValue({ ...prev }, name, value));
}

// Usage with useState in a component for User
// const [editUser, setEditUser] = useState<User>({ email: '' }); // Email is required, so initializing accordingly