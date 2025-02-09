export function isBase64StringUnderSizeLimit(base64String: string, sizeLimitInBytes: number): boolean {
    const stringLength = base64String.length;
    const sizeInBytes = (stringLength * 3) / 4;

    return sizeInBytes <= sizeLimitInBytes;
}