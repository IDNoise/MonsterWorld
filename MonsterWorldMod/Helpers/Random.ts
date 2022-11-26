export function IsPctRolled(value: number): boolean {
    return math.random(1, 100) <= value;
}