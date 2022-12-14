import type { BaseSchema } from "yup";

export function validate(value: any, schema: BaseSchema): string | boolean {
    try {
        schema.validateSync(value);
        return true;
    } catch (err) {
        return (err as Error).message;
    }
}
