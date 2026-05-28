export default function access(initialState: { role?: string } | undefined) {
  const role = initialState?.role;
  return {
    canAdmin: role === 'ADMIN',
    canUser: role === 'USER' || role === 'ADMIN',
    normalUser: role === 'USER',
  };
}
