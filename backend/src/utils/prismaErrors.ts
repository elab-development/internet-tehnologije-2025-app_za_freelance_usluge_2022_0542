export function isPrismaUniqueError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === "P2002"
  );
}
