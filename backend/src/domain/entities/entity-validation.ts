export function assertDefined<T>(value: T | null | undefined, fieldName: string): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error(`${fieldName} is required`);
    }
}

export function assertNonEmptyString(value: string, fieldName: string): void {
    if (!value || !value.trim()) {
        throw new Error(`${fieldName} is required`);
    }
}

export function assertValidDateString(value: string, fieldName: string): void {
    assertNonEmptyString(value, fieldName);

    if (Number.isNaN(Date.parse(value))) {
        throw new Error(`${fieldName} must be a valid date`);
    }
}

export function assertEmailFormat(value: string, fieldName: string): void {
    assertNonEmptyString(value, fieldName);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
        throw new Error(`${fieldName} must be a valid email`);
    }
}