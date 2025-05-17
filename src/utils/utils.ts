import { generateUniqueIdSlug } from "./uniqueCode.utils";

export const GenerateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') + "-" + generateUniqueIdSlug(6);
}